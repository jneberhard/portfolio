import type { Metadata } from "next";
import Link from "next/link";
import ContactModal from "../contact-modal";
import WeatherExperience from "./weather-experience";

export const metadata: Metadata = {
  title: "Weather & Maps API Lab | Jim Eberhard",
  description:
    "An interactive Google Maps and Weather API integration demonstrating server-side credentials, validation, caching, and responsive interface design.",
  icons: {
    icon: "/project-icons/weather-api.svg",
  },
};

/**
 * Server-rendered entry point for the Weather & Maps API Lab.
 *
 * This component reads configuration on the server and passes only the browser-safe
 * Maps key to the client experience. GOOGLE_MAPS_SERVER_KEY is never passed as a
 * value; its presence is exposed only as a boolean so weather requests continue to
 * flow through /api/weather.
 */
export default function WeatherPage() {
  // NEXT_PUBLIC_ values are intentionally available to browser code. Restrict this
  // key in Google Cloud to approved HTTP referrers and the Maps JavaScript API.
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || "";

  // Do not send the private key to WeatherExperience. The API route reads it when
  // making server-to-server Weather and Geocoding API requests.
  const weatherConfigured = Boolean(process.env.GOOGLE_MAPS_SERVER_KEY);

  return (
    <>
      <header className="site-header shell weather-header">
        <div className="brand-cluster">
          <Link className="mark" href="/" aria-label="Return to Jim Eberhard's portfolio">
            JE
          </Link>
        </div>
        <span className="site-name">Jim Eberhard / API Lab</span>
        <nav aria-label="Weather project navigation">
          <Link href="/#work">All work</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <main className="weather-main">
        <section className="weather-hero shell" aria-labelledby="weather-title">
          <div>
            <p className="eyebrow">12 / API integration</p>
            <h1 id="weather-title">
              Weather <em>&amp; Maps</em> API Lab
            </h1>
          </div>
          <div className="weather-hero-copy">
            <p>
              An interactive location-based forecast built to demonstrate secure
              API orchestration—not just display a temperature.
            </p>
            <div className="weather-tech-list" aria-label="Technologies demonstrated">
              <span>Google Maps</span>
              <span>Weather API</span>
              <span>Next.js</span>
              <span>TypeScript</span>
              <span>Server caching</span>
            </div>
          </div>
        </section>

        {/* The interactive map and weather controls require browser APIs, so they
            live in a dedicated client component. */}
        <WeatherExperience
          mapsApiKey={mapsApiKey}
          mapsConfigured={Boolean(mapsApiKey)}
          weatherConfigured={weatherConfigured}
        />

        <section className="weather-engineering shell" aria-labelledby="engineering-title">
          <div>
            <p className="eyebrow">Engineering decisions</p>
            <h2 id="engineering-title">What this integration demonstrates</h2>
          </div>
          <div className="weather-engineering-grid">
            <article>
              <span>01</span>
              <h3>Server-only credentials</h3>
              <p>
                Weather and geocoding requests pass through a Next.js endpoint,
                keeping the server API key out of browser code and Git history.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Validated requests</h3>
              <p>
                Search text, coordinate ranges, unit choices, request origin, and
                response fields are checked before data reaches the interface.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Cost-aware caching</h3>
              <p>
                Upstream responses are cached for ten minutes, reducing duplicate
                billable requests while keeping the forecast appropriately fresh.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Graceful failure states</h3>
              <p>
                Missing configuration, rejected locations, limits, and upstream
                failures produce useful states instead of a broken project page.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer weather-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <p className="footer-kicker">Have an API-driven project in mind?</p>
              <p className="footer-title">
                Let&apos;s build it <em>responsibly.</em>
              </p>
            </div>
            <div className="footer-actions">
              <ContactModal />
              <Link className="case-study-back" href="/#work">
                Back to selected works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Jim Eberhard © 2026</span>
            <span>Weather &amp; Maps API Lab</span>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
