"use client";

/** Last-resort boundary for failures in the root layout itself, where the themed shell is unavailable. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f3ea",
          color: "#1b1815",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>StudioSpace hit a snag</h1>
          <p style={{ lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Something went wrong while loading the page. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ background: "#e29a2e", color: "#1b1815", border: 0, borderRadius: 10, padding: "0.75rem 1.5rem", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
