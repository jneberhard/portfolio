import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type {
  WeatherForecastDay,
  WeatherResult,
  WeatherUnits,
} from "../../weather/weather-types";

// Denver provides a useful initial result when no search or map coordinates are sent.
const DEFAULT_LOCATION = {
  latitude: 39.7392,
  longitude: -104.9903,
  label: "Denver, CO, USA",
};
const MAX_QUERY_LENGTH = 120;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 40;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// These intentionally narrow provider types describe only Google response fields used
// by this route. Every optional field is validated or given a safe fallback later.
type GoogleTemperature = {
  degrees?: number;
  unit?: string;
};

type GoogleWeatherCondition = {
  iconBaseUri?: string;
  description?: { text?: string };
};

type GoogleCurrentConditions = {
  currentTime?: string;
  timeZone?: { id?: string };
  weatherCondition?: GoogleWeatherCondition;
  temperature?: GoogleTemperature;
  feelsLikeTemperature?: GoogleTemperature;
  relativeHumidity?: number;
  uvIndex?: number;
  precipitation?: { probability?: { percent?: number } };
  wind?: {
    direction?: { cardinal?: string };
    speed?: { value?: number };
  };
};

type GoogleForecastDay = {
  displayDate?: { year?: number; month?: number; day?: number };
  daytimeForecast?: {
    weatherCondition?: GoogleWeatherCondition;
    precipitation?: { probability?: { percent?: number } };
  };
  maxTemperature?: GoogleTemperature;
  minTemperature?: GoogleTemperature;
};

type GoogleDailyForecast = {
  forecastDays?: GoogleForecastDay[];
  timeZone?: { id?: string };
};

type GoogleGeocodingResponse = {
  status?: string;
  results?: Array<{
    formatted_address?: string;
    geometry?: {
      location?: { lat?: number; lng?: number };
    };
  }>;
};

const rateLimits = new Map<string, RateLimitEntry>();

/** Produces a consistent, non-cacheable error contract for the client component. */
function jsonError(
  error: string,
  status: number,
  configurationRequired = false,
  extraHeaders?: HeadersInit,
) {
  return NextResponse.json(
    { error, ...(configurationRequired ? { configurationRequired: true } : {}) },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...extraHeaders,
      },
    },
  );
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Retain a hash rather than the raw client address in the in-memory limiter.
  return createHash("sha256").update(ip).digest("hex");
}

// The in-memory limit applies per warm server instance. Google Cloud quotas should
// also be configured because serverless deployments can run multiple instances.
function checkRateLimit(identifier: string) {
  const now = Date.now();

  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) {
      rateLimits.delete(key);
    }
  }

  while (rateLimits.size > 1_000) {
    const oldestKey = rateLimits.keys().next().value;
    if (typeof oldestKey !== "string") {
      break;
    }
    rateLimits.delete(oldestKey);
  }

  const existing = rateLimits.get(identifier);
  if (!existing) {
    rateLimits.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1_000));
  }

  existing.count += 1;
  return null;
}

function isTrustedRequest(request: Request) {
  // This endpoint is intended for the portfolio client, not general third-party use.
  return (
    request.headers.get("sec-fetch-site") !== "cross-site" &&
    request.headers.get("x-requested-with") === "portfolio-weather-lab"
  );
}

function cleanQuery(value: string | null) {
  return (value || "")
    .trim()
    .slice(0, MAX_QUERY_LENGTH)
    .replace(/[\u0000-\u001f\u007f]+/g, " ");
}

/** Parses a finite coordinate within the latitude or longitude range supplied. */
function parseCoordinate(value: string | null, min: number, max: number) {
  if (value === null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? parsed
    : null;
}

function iconUrl(condition?: GoogleWeatherCondition) {
  // Only Google's known static asset host is accepted before the URL reaches an image.
  const baseUri = condition?.iconBaseUri;
  return typeof baseUri === "string" && baseUri.startsWith("https://maps.gstatic.com/")
    ? `${baseUri}.svg`
    : "";
}

function numberOr(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function rounded(value: number) {
  return Math.round(value * 10) / 10;
}

function formatCardinal(value?: string) {
  return value
    ? value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Variable";
}

function formatDisplayDate(date?: GoogleForecastDay["displayDate"]) {
  const year = numberOr(date?.year);
  const month = numberOr(date?.month);
  const day = numberOr(date?.day);

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function fetchGoogleJson<T>(url: URL) {
  // Next.js caches successful upstream calls for ten minutes to reduce API usage.
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 600 },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Google API returned ${response.status}`);
  }

  return (await response.json()) as T;
}

async function geocodeAddress(query: string, apiKey: string) {
  // Text searches are converted to coordinates before calling the Weather API.
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", apiKey);

  const data = await fetchGoogleJson<GoogleGeocodingResponse>(url);
  const first = data.results?.[0];
  const latitude = first?.geometry?.location?.lat;
  const longitude = first?.geometry?.location?.lng;

  if (
    data.status !== "OK" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new Error("Location was not found");
  }

  return {
    latitude,
    longitude,
    label: first?.formatted_address || query,
  };
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
  apiKey: string,
) {
  // Reverse geocoding improves the label for map clicks but is nonessential; coordinates
  // remain a useful fallback if the Geocoding API is unavailable.
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${latitude},${longitude}`);
  url.searchParams.set("key", apiKey);

  try {
    const data = await fetchGoogleJson<GoogleGeocodingResponse>(url);
    return data.status === "OK" && data.results?.[0]?.formatted_address
      ? data.results[0].formatted_address
      : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

function buildForecast(data: GoogleDailyForecast) {
  // Drop incomplete forecast days instead of sending partially valid cards to the UI.
  return (data.forecastDays || [])
    .map<WeatherForecastDay | null>((day) => {
      const date = formatDisplayDate(day.displayDate);
      const high = day.maxTemperature?.degrees;
      const low = day.minTemperature?.degrees;
      const condition = day.daytimeForecast?.weatherCondition;

      if (
        !date ||
        typeof high !== "number" ||
        typeof low !== "number" ||
        !condition?.description?.text
      ) {
        return null;
      }

      return {
        date,
        condition: condition.description.text,
        iconUrl: iconUrl(condition),
        high: rounded(high),
        low: rounded(low),
        precipitationChance: Math.round(
          numberOr(day.daytimeForecast?.precipitation?.probability?.percent),
        ),
      };
    })
    .filter((day): day is WeatherForecastDay => day !== null);
}

/** Coordinates geocoding and weather calls, then returns a stable WeatherResult. */
export async function GET(request: Request) {
  if (!isTrustedRequest(request)) {
    return jsonError("Request not allowed.", 403);
  }

  const retryAfter = checkRateLimit(getClientIdentifier(request));
  if (retryAfter) {
    return jsonError("Too many weather requests. Please try again shortly.", 429, false, {
      "Retry-After": String(retryAfter),
    });
  }

  // The private key is read only in this server route and is never returned to clients.
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!apiKey) {
    return jsonError(
      "The live Google Weather connection has not been configured yet.",
      503,
      true,
    );
  }

  const requestUrl = new URL(request.url);
  const query = cleanQuery(requestUrl.searchParams.get("query"));
  const units: WeatherUnits =
    requestUrl.searchParams.get("units") === "METRIC" ? "METRIC" : "IMPERIAL";
  const latitude = parseCoordinate(requestUrl.searchParams.get("lat"), -90, 90);
  const longitude = parseCoordinate(requestUrl.searchParams.get("lng"), -180, 180);

  if (
    (requestUrl.searchParams.has("lat") && latitude === null) ||
    (requestUrl.searchParams.has("lng") && longitude === null)
  ) {
    return jsonError("Valid latitude and longitude values are required.", 400);
  }

  try {
    let location = DEFAULT_LOCATION;

    if (query) {
      location = await geocodeAddress(query, apiKey);
    } else if (latitude !== null && longitude !== null) {
      location = {
        latitude,
        longitude,
        label: await reverseGeocode(latitude, longitude, apiKey),
      };
    }

    const commonParameters = new URLSearchParams({
      key: apiKey,
      "location.latitude": String(location.latitude),
      "location.longitude": String(location.longitude),
      unitsSystem: units,
      languageCode: "en",
    });
    const currentUrl = new URL(
      `https://weather.googleapis.com/v1/currentConditions:lookup?${commonParameters}`,
    );
    const forecastParameters = new URLSearchParams(commonParameters);
    forecastParameters.set("days", "5");
    forecastParameters.set("pageSize", "5");
    const forecastUrl = new URL(
      `https://weather.googleapis.com/v1/forecast/days:lookup?${forecastParameters}`,
    );

    // Current conditions and the forecast are independent, so fetch them concurrently.
    const [current, forecast] = await Promise.all([
      fetchGoogleJson<GoogleCurrentConditions>(currentUrl),
      fetchGoogleJson<GoogleDailyForecast>(forecastUrl),
    ]);

    if (
      typeof current.temperature?.degrees !== "number" ||
      !current.weatherCondition?.description?.text
    ) {
      throw new Error("Weather response was incomplete");
    }

    // Normalize provider-specific nesting and units into the shared client contract.
    const result: WeatherResult = {
      location: location.label,
      latitude: location.latitude,
      longitude: location.longitude,
      timeZone: current.timeZone?.id || forecast.timeZone?.id || "",
      observedAt: current.currentTime || new Date().toISOString(),
      units,
      temperatureSymbol: units === "IMPERIAL" ? "°F" : "°C",
      speedLabel: units === "IMPERIAL" ? "mph" : "km/h",
      current: {
        condition: current.weatherCondition.description.text,
        iconUrl: iconUrl(current.weatherCondition),
        temperature: rounded(current.temperature.degrees),
        feelsLike: rounded(
          numberOr(
            current.feelsLikeTemperature?.degrees,
            current.temperature.degrees,
          ),
        ),
        humidity: Math.round(numberOr(current.relativeHumidity)),
        windSpeed: rounded(numberOr(current.wind?.speed?.value)),
        windDirection: formatCardinal(current.wind?.direction?.cardinal),
        precipitationChance: Math.round(
          numberOr(current.precipitation?.probability?.percent),
        ),
        uvIndex: rounded(numberOr(current.uvIndex)),
      },
      forecast: buildForecast(forecast),
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        Vary: "x-requested-with",
      },
    });
  } catch (error) {
    console.error(
      "Weather API request failed.",
      error instanceof Error ? error.message : "Unknown error",
    );

    const message =
      error instanceof Error && error.message === "Location was not found"
        ? "That location could not be found. Try a city and state or country."
        : "Live weather is temporarily unavailable. Please try again shortly.";

    return jsonError(message, message.startsWith("That location") ? 404 : 502);
  }
}
