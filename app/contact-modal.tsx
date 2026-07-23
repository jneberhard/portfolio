"use client";

import { FormEvent, useRef, useState } from "react";

type SubmissionState = "idle" | "sending" | "success" | "error";

export default function ContactModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function openDialog() {
    setSubmissionState("idle");
    setStatusMessage("");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("sending");
    setStatusMessage("Sending your message…");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) {
        throw new Error("The message could not be sent.");
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage(
        "Thanks for reaching out. Your message has been sent successfully.",
      );
    } catch {
      setSubmissionState("error");
      setStatusMessage(
        "Something went wrong while sending. Please try again in a moment.",
      );
    }
  }

  return (
    <>
      <button className="contact-trigger" type="button" onClick={openDialog}>
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
              />
            </div>

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
