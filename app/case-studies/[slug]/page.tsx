import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactModal from "../../contact-modal";
import { caseStudies, getCaseStudy } from "../case-study-data";

type CaseStudyPageProps = {
  // Next.js 16 supplies dynamic route parameters asynchronously.
  params: Promise<{ slug: string }>;
};

/** Prebuild every case study listed in the local data module. */
export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found | Jim Eberhard" };
  }

  return {
    title: `${caseStudy.title} Case Study | Jim Eberhard`,
    description: caseStudy.summary,
  };
}

/** Renders one reusable case-study layout from the requested project slug. */
export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  // Unknown slugs use Next.js's standard 404 boundary instead of a partial page.
  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <header className="site-header shell case-study-header">
        <div className="brand-cluster">
          <Link className="mark" href="/" aria-label="Return to Jim Eberhard's portfolio">
            JE
          </Link>
        </div>
        <span className="site-name">Jim Eberhard / Case Study</span>
        <nav aria-label="Case study navigation">
          <Link href="/#work">All work</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <main className="case-study-main">
        <section className="case-study-hero shell" aria-labelledby="case-study-title">
          <div className="case-study-index">
            <span>{caseStudy.number}</span>
            <p>{caseStudy.category}</p>
          </div>
          <div className="case-study-intro">
            <p className="eyebrow">Project case study</p>
            <h1 id="case-study-title">{caseStudy.title}</h1>
            <p className="case-study-summary">{caseStudy.summary}</p>
            <div className="case-study-links">
              <a href={caseStudy.liveHref} target="_blank" rel="noreferrer">
                Visit live site <span aria-hidden="true">↗</span>
              </a>
              <a href={caseStudy.repositoryHref} target="_blank" rel="noreferrer">
                View repository <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="case-study-details shell" aria-label="Project overview">
          <aside className="case-study-stack">
            <p className="eyebrow">Technology</p>
            <ul>
              {caseStudy.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </aside>
          <div className="case-study-narrative">
            <section>
              <p className="eyebrow">01 / The challenge</p>
              <h2>What needed to work</h2>
              <p>{caseStudy.challenge}</p>
            </section>
            <section>
              <p className="eyebrow">02 / The approach</p>
              <h2>How I designed it</h2>
              <p>{caseStudy.approach}</p>
            </section>
          </div>
        </section>

        <section className="case-study-build shell" aria-labelledby="build-title">
          <div className="case-study-section-heading">
            <p className="eyebrow">03 / Technical highlights</p>
            <h2 id="build-title">Inside the build</h2>
          </div>
          <div className="case-study-highlight-grid">
            {/* Highlight numbers are presentational and follow the stored array order. */}
            {caseStudy.highlights.map((highlight, index) => (
              <article key={highlight.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="case-study-outcomes shell" aria-labelledby="outcomes-title">
          <div>
            <p className="eyebrow">04 / Outcome</p>
            <h2 id="outcomes-title">What the project demonstrates</h2>
          </div>
          <ul>
            {caseStudy.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="site-footer case-study-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <p className="footer-kicker">Interested in this project?</p>
              <p className="footer-title">
                Let&apos;s discuss the <em>details.</em>
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
            <span>{caseStudy.title} case study</span>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
