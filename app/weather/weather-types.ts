/** Measurement systems accepted by both the UI and /api/weather. */
export type WeatherUnits = "IMPERIAL" | "METRIC";

/** Normalized daily forecast data; UI code does not depend on Google's raw schema. */
export type WeatherForecastDay = {
  /** Calendar date in YYYY-MM-DD format. */
  date: string;
  condition: string;
  iconUrl: string;
  high: number;
  low: number;
  precipitationChance: number;
};

/**
 * Successful response contract returned by /api/weather.
 *
 * The server converts Google Weather and Geocoding responses into this stable shape,
 * allowing the client component to focus on rendering rather than provider details.
 */
export type WeatherResult = {
  location: string;
  latitude: number;
  longitude: number;
  /** IANA time-zone name used to format dates and observation times locally. */
  timeZone: string;
  /** ISO timestamp for the current observation. */
  observedAt: string;
  units: WeatherUnits;
  temperatureSymbol: "°F" | "°C";
  speedLabel: "mph" | "km/h";
  current: {
    condition: string;
    iconUrl: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitationChance: number;
    uvIndex: number;
  };
  forecast: WeatherForecastDay[];
};

/** Safe, user-facing error response returned by /api/weather. */
export type WeatherErrorResponse = {
  error: string;
  /** True when deployment variables are absent rather than an upstream call failing. */
  configurationRequired?: boolean;
};
