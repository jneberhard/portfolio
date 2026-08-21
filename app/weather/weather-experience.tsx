"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type {
  WeatherErrorResponse,
  WeatherResult,
  WeatherUnits,
} from "./weather-types";

type LatLngLiteral = { lat: number; lng: number };

// Minimal local declarations for the Google Maps features used by this page. Keeping
// this surface small avoids coupling the portfolio to types for unused Maps services.
type MapsEvent = {
  latLng?: {
    lat(): number;
    lng(): number;
  };
};

type MapsMap = {
  addListener(event: string, handler: (event: MapsEvent) => void): void;
  setCenter(position: LatLngLiteral): void;
  setZoom(zoom: number): void;
};

type MapsMarker = {
  setPosition(position: LatLngLiteral): void;
};

type GoogleMapsApi = {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        center: LatLngLiteral;
        zoom: number;
        mapTypeControl: boolean;
        fullscreenControl: boolean;
        streetViewControl: boolean;
      },
    ) => MapsMap;
    Marker: new (options: {
      map: MapsMap;
      position: LatLngLiteral;
      title: string;
    }) => MapsMarker;
  };
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
    // Google invokes this callback after its asynchronously loaded script is ready.
    __portfolioWeatherMapsReady?: () => void;
  }
}

// A module-level promise prevents duplicate script tags when React remounts the
// component in development or multiple callers request Maps at the same time.
let mapsPromise: Promise<GoogleMapsApi> | null = null;

/** Loads the Maps JavaScript API once and resolves when `window.google` is ready. */
function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (mapsPromise) {
    return mapsPromise;
  }

  mapsPromise = new Promise<GoogleMapsApi>((resolve, reject) => {
    window.__portfolioWeatherMapsReady = () => {
      if (window.google?.maps) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps did not initialize."));
      }
    };

    const script = document.createElement("script");
    const parameters = new URLSearchParams({
      key: apiKey,
      loading: "async",
      callback: "__portfolioWeatherMapsReady",
      v: "weekly",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${parameters}`;
    script.async = true;
    script.onerror = () => reject(new Error("Google Maps could not be loaded."));
    document.head.appendChild(script);
  });

  return mapsPromise;
}

function weatherDateLabel(date: string, timeZone: string) {
  // Noon UTC avoids a date shifting backward or forward when formatted in another
  // time zone, which can happen when parsing a date-only string at midnight.
  const [year, month, day] = date.split("-").map(Number);
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timeZone || "UTC",
  }).format(safeDate);
}

function observedTimeLabel(value: string, timeZone: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timeZone || "UTC",
    timeZoneName: "short",
  }).format(date)}`;
}

type WeatherExperienceProps = {
  mapsApiKey: string;
  mapsConfigured: boolean;
  weatherConfigured: boolean;
};

export default function WeatherExperience({
  mapsApiKey,
  mapsConfigured,
  weatherConfigured,
}: WeatherExperienceProps) {
  // Map objects are imperative and do not belong in React state. Refs retain them
  // between renders without causing a render whenever the marker moves.
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapsMap | null>(null);
  const markerRef = useRef<MapsMarker | null>(null);

  // These refs provide event callbacks with the latest values without rebuilding the
  // Google Map or re-registering its click listener after every weather response.
  const weatherRef = useRef<WeatherResult | null>(null);
  const unitsRef = useRef<WeatherUnits>("IMPERIAL");
  const [query, setQuery] = useState("Denver, Colorado");
  const [units, setUnits] = useState<WeatherUnits>("IMPERIAL");
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(weatherConfigured);
  const [error, setError] = useState(
    weatherConfigured
      ? ""
      : "Add the Google server API key to activate live weather data.",
  );
  const [mapError, setMapError] = useState(
    mapsConfigured ? "" : "Add the browser Maps key to activate the map.",
  );
  const [lastRequest, setLastRequest] = useState<
    { type: "query"; query: string } | { type: "coordinates"; lat: number; lng: number }
  >({ type: "query", query: "Denver, Colorado" });

  const updateMap = useCallback((result: WeatherResult) => {
    if (!mapRef.current || !markerRef.current) {
      return;
    }

    const position = { lat: result.latitude, lng: result.longitude };
    mapRef.current.setCenter(position);
    mapRef.current.setZoom(8);
    markerRef.current.setPosition(position);
  }, []);

  const requestWeather = useCallback(
    async (
      request:
        | { type: "query"; query: string }
        | { type: "coordinates"; lat: number; lng: number },
      requestedUnits: WeatherUnits,
    ) => {
      if (!weatherConfigured) {
        setError("Add the Google server API key to activate live weather data.");
        return;
      }

      const parameters = new URLSearchParams({ units: requestedUnits });
      if (request.type === "query") {
        parameters.set("query", request.query);
      } else {
        parameters.set("lat", String(request.lat));
        parameters.set("lng", String(request.lng));
      }

      setLoading(true);
      setError("");

      try {
        // The browser calls the portfolio's API route, never Google Weather directly.
        // That route validates input, uses the private server key, and normalizes the
        // upstream response into WeatherResult.
        const response = await fetch(`/api/weather?${parameters}`, {
          headers: { "x-requested-with": "portfolio-weather-lab" },
        });
        const data = (await response.json()) as WeatherResult | WeatherErrorResponse;

        if (!response.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Weather request failed.");
        }

        weatherRef.current = data;
        setWeather(data);
        updateMap(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Live weather is temporarily unavailable.",
        );
      } finally {
        setLoading(false);
      }
    },
    [updateMap, weatherConfigured],
  );

  useEffect(() => {
    if (!weatherConfigured) {
      return;
    }

    // Defer the initial request until after the first render. This also gives the user
    // an immediate example forecast without requesting precise browser location.
    const timer = window.setTimeout(() => {
      void requestWeather(
        { type: "query", query: "Denver, Colorado" },
        "IMPERIAL",
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [requestWeather, weatherConfigured]);

  useEffect(() => {
    if (!mapsConfigured || !mapsApiKey || !mapElementRef.current) {
      return;
    }

    // Ignore an asynchronous result if the component unmounts before Maps finishes
    // loading; this prevents updates to stale DOM and component state.
    let cancelled = false;

    void loadGoogleMaps(mapsApiKey)
      .then((google) => {
        if (cancelled || !mapElementRef.current) {
          return;
        }

        const latestWeather = weatherRef.current;
        const center = latestWeather
          ? { lat: latestWeather.latitude, lng: latestWeather.longitude }
          : { lat: 39.7392, lng: -104.9903 };
        const map = new google.maps.Map(mapElementRef.current, {
          center,
          zoom: 8,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });
        const marker = new google.maps.Marker({
          map,
          position: center,
          title: "Weather location",
        });

        map.addListener("click", (event) => {
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();
          if (typeof lat !== "number" || typeof lng !== "number") {
            return;
          }

          // Map clicks use coordinates directly, avoiding an unnecessary forward
          // geocoding request. The API route can reverse-geocode the display label.
          const selected = { type: "coordinates" as const, lat, lng };
          marker.setPosition({ lat, lng });
          setLastRequest(selected);
          void requestWeather(selected, unitsRef.current);
        });

        mapRef.current = map;
        markerRef.current = marker;
        setMapError("");
      })
      .catch(() => {
        if (!cancelled) {
          setMapError("Google Maps could not be loaded. Check the browser key restrictions.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mapsApiKey, mapsConfigured, requestWeather]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) {
      setError("Enter a city, state, or country.");
      return;
    }

    const request = { type: "query" as const, query: cleaned };
    setLastRequest(request);
    void requestWeather(request, units);
  }

  function handleUnits(nextUnits: WeatherUnits) {
    if (nextUnits === units) {
      return;
    }

    // Re-run the last search so all displayed measurements change together.
    setUnits(nextUnits);
    unitsRef.current = nextUnits;
    void requestWeather(lastRequest, nextUnits);
  }

  return (
    <section className="weather-lab shell" aria-labelledby="weather-results-title">
      <div className="weather-controls">
        <p className="eyebrow">Search the forecast</p>
        <form className="weather-search" onSubmit={handleSearch}>
          <label htmlFor="weather-location">City, state, or country</label>
          <div>
            <input
              id="weather-location"
              name="location"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Denver, Colorado"
              maxLength={120}
              autoComplete="off"
            />
            <button type="submit" disabled={loading || !weatherConfigured}>
              {loading ? "Loading…" : "Search"}
            </button>
          </div>
        </form>

        <div className="weather-unit-toggle" aria-label="Temperature units">
          <button
            type="button"
            className={units === "IMPERIAL" ? "active" : ""}
            onClick={() => handleUnits("IMPERIAL")}
            aria-pressed={units === "IMPERIAL"}
          >
            °F
          </button>
          <button
            type="button"
            className={units === "METRIC" ? "active" : ""}
            onClick={() => handleUnits("METRIC")}
            aria-pressed={units === "METRIC"}
          >
            °C
          </button>
        </div>

        <p className="weather-instruction">
          Search for a location or select a point on the map. Precise browser
          location is never requested.
        </p>

        <div className="weather-architecture" aria-label="API architecture">
          <span>Browser</span>
          <b aria-hidden="true">→</b>
          <span>Next.js API</span>
          <b aria-hidden="true">→</b>
          <span>Google</span>
        </div>
      </div>

      <div className="weather-map-panel">
        <div ref={mapElementRef} className="weather-map" aria-label="Interactive Google Map" />
        {mapError ? (
          <div className="weather-map-message">
            <b>Map configuration needed</b>
            <p>{mapError}</p>
          </div>
        ) : null}
        <span className="weather-map-credit">Map data © Google</span>
      </div>

      <div className="weather-results" aria-live="polite" aria-busy={loading}>
        {error ? (
          <div className="weather-error" role="status">
            <p className="eyebrow">API status</p>
            <h2 id="weather-results-title">Configuration needed</h2>
            <p>{error}</p>
            <p>
              The interface, validation, map integration, and server proxy are
              ready. Live results activate when the Vercel environment variables
              are added.
            </p>
          </div>
        ) : null}

        {!error && loading ? (
          <div className="weather-loading" role="status">
            <span aria-hidden="true" />
            <p>Requesting validated weather data…</p>
          </div>
        ) : null}

        {!error && !loading && weather ? (
          <>
            <div className="weather-current">
              <div className="weather-current-heading">
                <div>
                  <p className="eyebrow">Current conditions</p>
                  <h2 id="weather-results-title">{weather.location}</h2>
                  <p>{observedTimeLabel(weather.observedAt, weather.timeZone)}</p>
                </div>
                {weather.current.iconUrl ? (
                  <Image
                    src={weather.current.iconUrl}
                    alt=""
                    width={112}
                    height={112}
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>

              <div className="weather-temperature">
                <strong>
                  {Math.round(weather.current.temperature)}
                  <small>{weather.temperatureSymbol}</small>
                </strong>
                <div>
                  <b>{weather.current.condition}</b>
                  <span>
                    Feels like {Math.round(weather.current.feelsLike)}
                    {weather.temperatureSymbol}
                  </span>
                </div>
              </div>

              <dl className="weather-metrics">
                <div>
                  <dt>Humidity</dt>
                  <dd>{weather.current.humidity}%</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>
                    {weather.current.windSpeed} {weather.speedLabel}
                  </dd>
                </div>
                <div>
                  <dt>Direction</dt>
                  <dd>{weather.current.windDirection}</dd>
                </div>
                <div>
                  <dt>Precipitation</dt>
                  <dd>{weather.current.precipitationChance}%</dd>
                </div>
                <div>
                  <dt>UV index</dt>
                  <dd>{weather.current.uvIndex}</dd>
                </div>
              </dl>
            </div>

            <div className="weather-forecast">
              <div className="weather-forecast-heading">
                <p className="eyebrow">Five-day outlook</p>
                <span>Google Weather API</span>
              </div>
              <div className="weather-forecast-grid">
                {weather.forecast.map((day) => (
                  <article key={day.date}>
                    <p>{weatherDateLabel(day.date, weather.timeZone)}</p>
                    {day.iconUrl ? (
                      <Image
                        src={day.iconUrl}
                        alt=""
                        width={66}
                        height={66}
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <h3>{day.condition}</h3>
                    <div>
                      <b>
                        {Math.round(day.high)}{weather.temperatureSymbol}
                      </b>
                      <span>
                        {Math.round(day.low)}{weather.temperatureSymbol}
                      </span>
                    </div>
                    <small>{day.precipitationChance}% precipitation</small>
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
