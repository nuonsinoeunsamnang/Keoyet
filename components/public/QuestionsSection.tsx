"use client";

import { useState } from "react";

const styles = {
  section: {
    marginBottom: "2rem",
  } as React.CSSProperties,
  title: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "#0a0a0a",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: "0.9375rem",
    resize: "vertical",
    marginBottom: "0.75rem",
    backgroundColor: "#ffffff",
    color: "#0a0a0a",
  } as React.CSSProperties,
  submitBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9375rem",
    fontWeight: 500,
    cursor: "pointer",
  } as React.CSSProperties,
  clarificationsTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: "1.5rem",
    marginBottom: "0.75rem",
    color: "#0a0a0a",
  } as React.CSSProperties,
  clarificationCard: {
    padding: "1rem 1.25rem",
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    marginBottom: "0.75rem",
    fontSize: "0.9375rem",
  } as React.CSSProperties,
  clarificationQuestion: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  } as React.CSSProperties,
  clarificationAnswer: {
    marginLeft: "1.5rem",
    marginBottom: "0.5rem",
  } as React.CSSProperties,
  clarificationDate: {
    marginLeft: "1.5rem",
    fontSize: "0.8125rem",
    color: "#64748b",
  } as React.CSSProperties,
  showMore: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    marginTop: "0.5rem",
    color: "#2563eb",
    fontSize: "0.875rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  } as React.CSSProperties,
};

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export type Clarification = {
  id: string;
  question: string;
  answer: string;
  postedAt: string;
};

export function QuestionsSection({ clarifications = [] }: { clarifications?: Clarification[] }) {
  const [question, setQuestion] = useState("");
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? clarifications : clarifications.slice(0, 3);
  const hasMore = clarifications.length > 3;

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>
        <MessageIcon />
        Questions & Clarifications
      </h2>
      <textarea
        style={styles.textarea}
        placeholder="Ask a question about this tender."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button type="button" style={styles.submitBtn}>
        <PaperPlaneIcon />
        Submit Question
      </button>

      <h3 style={styles.clarificationsTitle}>Official Clarifications</h3>
      {visible.length === 0 ? (
        <p style={{ fontSize: "0.9375rem", color: "#64748b" }}>No official clarifications yet.</p>
      ) : (
        <>
          {visible.map((c) => (
            <div key={c.id} style={styles.clarificationCard}>
              <div style={styles.clarificationQuestion}>
                <QuestionIcon />
                <span><strong>Q:</strong> {c.question}</span>
              </div>
              <div style={styles.clarificationAnswer}>
                <strong>A:</strong> {c.answer}
              </div>
              <div style={styles.clarificationDate}>Posted: {c.postedAt}</div>
            </div>
          ))}
          {hasMore && (
            <button type="button" style={styles.showMore} onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show less" : "Show more"}
              <ChevronDownIcon />
            </button>
          )}
        </>
      )}
    </section>
  );
}
