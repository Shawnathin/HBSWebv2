import { useState } from "react";

import type { SummaryRow } from "@/src/components/builder/types";

type QuoteModalProps = {
  isOpen: boolean;
  intent: "quote" | "cart";
  rows: SummaryRow[];
  quoteRequired: boolean;
  onClose: () => void;
};

export function QuoteModal({ isOpen, intent, rows, quoteRequired, onClose }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) {
    return null;
  }

  const quoteMode = intent === "quote" || quoteRequired;

  return (
    <div aria-labelledby="quote-modal-title" aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{quoteMode ? "Request quote" : "Cart placeholder"}</p>
            <h3 id="quote-modal-title">{quoteMode ? "Send Your Austin Build" : "Save This Build for Cart"}</h3>
            <p className="lead">
              {quoteMode
                ? "Share the selected configuration with the showroom team."
                : "The cart adapter is stubbed until BigCommerce products and options are confirmed."}
            </p>
          </div>
          <button aria-label="Close" className="modal-close" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-summary">
            {rows.map((row) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          {submitted ? (
            <div className="success-message">
              Build captured locally for the prototype. The backend quote endpoint is not connected yet.
            </div>
          ) : (
            <form
              className="modal-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="field-grid">
                <label>
                  Name
                  <input autoComplete="name" name="name" required />
                </label>
                <label>
                  Phone
                  <input autoComplete="tel" name="phone" required />
                </label>
              </div>
              <label>
                Email
                <input autoComplete="email" name="email" required type="email" />
              </label>
              <label>
                Room notes
                <textarea
                  name="notes"
                  placeholder="Room size, preferred delivery timing, stairs, elevator, or anything you want the showroom to know."
                />
              </label>
              <button className="btn primary" type="submit">
                {quoteMode ? "Send Build" : "Save Build"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
