import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice | Jim Eberhard",
  description:
    "How Jim Eberhard's portfolio handles contact-form information and technical website data.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="site-header shell privacy-header">
        <div className="brand-cluster">
          <Link
            className="mark"
            href="/"
            aria-label="Return to Jim Eberhard's portfolio"
          >
            JE
          </Link>
        </div>
        <span className="site-name">Jim Eberhard / Privacy</span>
        <nav aria-label="Privacy page navigation">
          <Link href="/">Portfolio</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <main className="privacy-main shell">
        <section className="privacy-hero" aria-labelledby="privacy-title">
          <p className="eyebrow">Privacy notice</p>
          <h1 id="privacy-title">
            Clear about <em>your data.</em>
          </h1>
          <p className="privacy-updated">Last updated July 27, 2026</p>
        </section>

        <div className="privacy-layout">
          <aside className="privacy-summary" aria-labelledby="summary-title">
            <p className="eyebrow" id="summary-title">
              At a glance
            </p>
            <ul>
              <li>No advertising or sale of personal information.</li>
              <li>No analytics or tracking cookies are intentionally used.</li>
              <li>Contact details are used only to respond to inquiries.</li>
              <li>The contact destination remains server-side and private.</li>
            </ul>
          </aside>

          <article className="privacy-content">
            <section>
              <h2>Scope</h2>
              <p>
                This notice applies to Jim Eberhard’s portfolio website and its
                contact form. Linked project websites have their own practices
                and are not covered by this notice.
              </p>
            </section>

            <section>
              <h2>Information collected</h2>
              <p>
                When you submit the contact form, the site collects your name
                and email address. A business name and notes are optional. A
                demo-request button may prefill the name of the project you
                selected.
              </p>
              <p>
                Standard technical request information, such as an IP address,
                browser details, timestamps, and request headers, may be
                processed temporarily by the hosting and email-delivery
                services for operation, security, and abuse prevention.
              </p>
            </section>

            <section>
              <h2>How information is used</h2>
              <p>
                Contact information is used to reply to your question, discuss
                an opportunity, arrange a demonstration, or provide appropriate
                demo access. Technical information is used to deliver the site,
                protect the contact form, prevent duplicate messages, and
                diagnose failures.
              </p>
              <p>
                Please do not submit passwords, financial records, government
                identifiers, health information, or other sensitive personal
                information through the form.
              </p>
            </section>

            <section>
              <h2>Service providers</h2>
              <p>
                Vercel hosts the website and server-side contact endpoint.
                Resend processes and delivers contact-form emails. The
                recipient’s email provider may also process and retain the
                resulting message. Review the{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Vercel Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resend Privacy Policy
                </a>{" "}
                for their practices.
              </p>
              <p>
                Small project and social icons may be requested from the linked
                project, GitHub, or LinkedIn domains. Those providers may
                receive ordinary network information such as your IP address
                and browser type; icon requests are configured not to send a
                referrer.
              </p>
            </section>

            <section>
              <h2>Storage and retention</h2>
              <p>
                The portfolio does not store contact submissions in its own
                database. Messages may remain in the receiving mailbox and in
                provider operational logs until deleted or removed under the
                applicable provider’s retention practices. Information is kept
                only as long as reasonably needed to respond, maintain records
                of the conversation, prevent abuse, or meet legal obligations.
              </p>
            </section>

            <section>
              <h2>Cookies and tracking</h2>
              <p>
                This portfolio does not intentionally use analytics,
                advertising trackers, or tracking cookies. Hosting providers
                may maintain limited infrastructure logs needed to operate and
                secure their services.
              </p>
            </section>

            <section>
              <h2>Security</h2>
              <p>
                The site uses HTTPS, server-only secrets, input validation,
                request-size limits, same-origin checks, abuse controls, and
                browser security policies. No internet transmission or storage
                system can be guaranteed completely secure, so avoid sending
                confidential information through the contact form.
              </p>
            </section>

            <section>
              <h2>Your choices</h2>
              <p>
                You may ask about, correct, or request deletion of information
                submitted through this portfolio by using the{" "}
                <Link href="/#contact">Contact Me form</Link>. Enough
                information may be requested to verify and locate the relevant
                message.
              </p>
            </section>

            <section>
              <h2>Children and changes</h2>
              <p>
                This professional portfolio is not directed to children under
                13. This notice may be updated as the site or its service
                providers change. The latest revision date will appear at the
                top of this page.
              </p>
            </section>
          </article>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="footer-inner">
          <span>Jim Eberhard © 2026</span>
          <Link href="/">Return to portfolio</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </footer>
    </>
  );
}
