import { useState } from "react";

const TOOLS = [
  {
    id: "explain",
    label: "Code Explainer",
    icon: "⟨/⟩",
    placeholder: "Paste your code here...",
    prompt: (input) =>
      `Explain the following code clearly and concisely. Break it down step by step so a junior developer can understand it.\n\n${input}`,
    color: "#00E5FF",
  },
  {
    id: "summarize",
    label: "Text Summarizer",
    icon: "≡",
    placeholder: "Paste any text or documentation here...",
    prompt: (input) =>
      `Summarize the following text concisely. Extract the key points in a clear, structured format.\n\n${input}`,
    color: "#B2FF59",
  },
  {
    id: "bugfinder",
    label: "Bug Finder",
    icon: "⚠",
    placeholder: "Paste code you want to debug...",
    prompt: (input) =>
      `Analyze the following code for bugs, errors, and potential issues. List each problem found and suggest a fix for each one.\n\n${input}`,
    color: "#FF6D6D",
  },
];

export default function DevToolkit() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runTool() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: activeTool.prompt(input) }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setOutput(text);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={{ ...styles.logoDot, background: activeTool.color }} />
            <span style={styles.logoText}>DEV TOOLKIT</span>
          </div>
          <p style={styles.tagline}>AI-powered tools for developers</p>
        </div>
      </header>

      {/* Tool Tabs */}
      <nav style={styles.nav}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool);
              setInput("");
              setOutput("");
              setError("");
            }}
            style={{
              ...styles.tab,
              ...(activeTool.id === tool.id
                ? { ...styles.tabActive, borderColor: tool.color, color: tool.color }
                : {}),
            }}
            className="tab-btn"
          >
            <span style={styles.tabIcon}>{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.panel}>
          {/* Input */}
          <div style={styles.editorWrap}>
            <div style={{ ...styles.editorLabel, color: activeTool.color }}>
              INPUT
            </div>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTool.placeholder}
              spellCheck={false}
            />
          </div>

          {/* Run Button */}
          <div style={styles.btnRow}>
            <button
              onClick={runTool}
              disabled={loading || !input.trim()}
              style={{
                ...styles.runBtn,
                background: loading || !input.trim() ? "#1a1a1a" : activeTool.color,
                color: loading || !input.trim() ? "#444" : "#000",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
              className="run-btn"
            >
              {loading ? (
                <span style={styles.spinner} className="spinner" />
              ) : (
                `Run ${activeTool.label}`
              )}
            </button>
            {input && (
              <button
                onClick={() => { setInput(""); setOutput(""); setError(""); }}
                style={styles.clearBtn}
              >
                Clear
              </button>
            )}
          </div>

          {/* Output */}
          {(output || error || loading) && (
            <div style={styles.outputWrap}>
              <div style={{ ...styles.editorLabel, color: activeTool.color }}>
                OUTPUT
              </div>
              <div style={styles.output}>
                {loading && (
                  <div style={styles.loadingText}>
                    <span className="blink">▋</span> Analyzing...
                  </div>
                )}
                {error && <div style={styles.errorText}>{error}</div>}
                {output && <pre style={styles.outputText}>{output}</pre>}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        Built with React + Anthropic API &nbsp;·&nbsp; Yosuf Sadat
      </footer>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e0e0e0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid #1e1e1e",
    padding: "32px 40px 24px",
  },
  headerInner: {
    maxWidth: 860,
    margin: "0 auto",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
    transition: "background 0.3s",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#fff",
  },
  tagline: {
    fontSize: 12,
    color: "#555",
    letterSpacing: "0.08em",
    margin: 0,
  },
  nav: {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid #1e1e1e",
    padding: "0 40px",
    maxWidth: "100%",
    overflowX: "auto",
  },
  tab: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#444",
    padding: "14px 24px",
    fontSize: 12,
    letterSpacing: "0.1em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "color 0.2s, border-color 0.2s",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  tabActive: {
    borderBottom: "2px solid",
  },
  tabIcon: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
    maxWidth: 900,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  editorWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  editorLabel: {
    fontSize: 10,
    letterSpacing: "0.2em",
    fontWeight: 700,
  },
  textarea: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 4,
    color: "#ccc",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    minHeight: 200,
    padding: "16px 20px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  btnRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  runBtn: {
    border: "none",
    borderRadius: 4,
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.1em",
    padding: "12px 28px",
    transition: "background 0.2s, color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  clearBtn: {
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 4,
    color: "#555",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    letterSpacing: "0.08em",
    padding: "11px 20px",
    transition: "border-color 0.2s, color 0.2s",
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid #333",
    borderTop: "2px solid #000",
    borderRadius: "50%",
    display: "inline-block",
  },
  outputWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  output: {
    background: "#0d0d0d",
    border: "1px solid #1e1e1e",
    borderRadius: 4,
    minHeight: 120,
    padding: "16px 20px",
  },
  outputText: {
    color: "#ccc",
    fontFamily: "inherit",
    fontSize: 13,
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  loadingText: {
    color: "#555",
    fontSize: 13,
  },
  errorText: {
    color: "#FF6D6D",
    fontSize: 13,
  },
  footer: {
    borderTop: "1px solid #1a1a1a",
    color: "#333",
    fontSize: 11,
    letterSpacing: "0.08em",
    padding: "16px 40px",
    textAlign: "center",
  },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #0a0a0a; }
  .tab-btn:hover { color: #aaa !important; }
  .run-btn:hover:not(:disabled) { filter: brightness(0.88); }
  textarea:focus { border-color: #333 !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .blink { animation: blink 1s step-end infinite; }
`;
