"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

// The finite submission states drive button availability and accessible status text.
type SubmissionState = "idle" | "sending" | "success" | "error";

/** Reusable contact dialog that submits messages to the protected server endpoint. */
export default function ContactModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [startedAt, setStartedAt] = useState(0);

  function openDialog(presetNotes = "") {
    // Record the opening time for the server-side minimum-completion-time check.
    setSubmissionState("idle");
    setStatusMessage("");
    setNotes(presetNotes);
    setStartedAt(Date.now());
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    // Project cards can request this shared modal without coupling their button markup
    // to the dialog component. The project name becomes a helpful message draft.
    function handleDemoRequest(event: Event) {
      const { project } = (event as CustomEvent<{ project: string }>).detail;
      openDialog(
        `I'm interested in a ${project} demonstration or demo login credentials.`,
      );
    }

    window.addEventListener("open-contact-form", handleDemoRequest);
    return () =>
      window.removeEventListener("open-contact-form", handleDemoRequest);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("sending");
    setStatusMessage("Sending your message…");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      // The custom request header is checked alongside same-origin headers by the API.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "portfolio-contact-form",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(result?.error || "The message could not be sent.");
      }

      form.reset();
      setNotes("");
      setSubmissionState("success");
      setStatusMessage(
        "Thanks for reaching out. Your message has been sent successfully.",
      );
    } catch (error) {
      setSubmissionState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending. Please try again.",
      );
    }
  }

  return (
    <>
      <button
        className="contact-trigger"
        type="button"
        onClick={() => openDialog()}
      >
        <span>
          <b>Contact Me</b>
          <small>Send a private message</small>
        </span>
        <span aria-hidden="true">+</span>
      </button>

      <dialog
        className="contact-dialog"
        ref={dialogRef}
        aria-labelledby="contact-form-title"
        onClose={() => {
          if (submissionState !== "sending") {
            setStatusMessage("");
          }
        }}
      >
        <div className="dialog-heading">
          <div>
            <p className="dialog-kicker">Contact form</p>
            <h2 id="contact-form-title">Start a conversation.</h2>
          </div>
          <button
            className="dialog-close"
            type="button"
            onClick={closeDialog}
            aria-label="Close contact form"
          >
            ×
          </button>
        </div>

        {submissionState === "success" ? (
          <div className="contact-success" role="status">
            <p>{statusMessage}</p>
            <button type="button" onClick={closeDialog}>
              Close
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="contact-name">Name *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-business">Business</label>
              <input
                id="contact-business"
                name="business"
                type="text"
                autoComplete="organization"
                maxLength={120}
              />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="contact-email">Email *</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="form-field form-field-wide">
              <label htmlFor="contact-notes">Notes</label>
              <textarea
                id="contact-notes"
                name="notes"
                rows={5}
                maxLength={3000}
                placeholder="Tell me about the role, project, or question."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            {/* Legitimate visitors never interact with this honeypot field. */}
            <div className="form-honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <input
              name="startedAt"
              type="hidden"
              value={startedAt}
              readOnly
            />

            <p className="form-privacy">
              Your message is used only to respond to your inquiry. Read the{" "}
              <a href="/privacy" target="_blank" rel="noreferrer">
                Privacy Notice
              </a>
              .
            </p>

            <div className="form-submit-row">
              <p className={`form-status ${submissionState}`} aria-live="polite">
                {statusMessage}
              </p>
              <button
                className="submit-contact"
                type="submit"
                disabled={submissionState === "sending"}
              >
                {submissionState === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

/** Opens ContactModal with a project-specific demo request already drafted. */
export function DemoContactButton({ project }: { project: string }) {
  function openContactForm() {
    window.dispatchEvent(
      new CustomEvent("open-contact-form", { detail: { project } }),
    );
  }

  return (
    <button className="demo-access" type="button" onClick={openContactForm}>
      <span>
        <b>Demo access</b>
        <small>
          Request a guided demonstration or demo username and password.
        </small>
      </span>
      <span>Contact Me</span>
    </button>
  );
}
