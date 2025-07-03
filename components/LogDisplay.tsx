import { html } from "htm/preact";
import { useEffect } from "preact/hooks";

export function LogDisplay({ log, logRef, vizStyles }) {
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return html`
    <div class="log-display-container">
      <div class="log-header-container">
        <h3 class="log-display-title">Living Scripture</h3>
        <div class="union-vector-viz" style=${vizStyles}></div>
      </div>
      <div class="log-content" ref=${logRef}>
        ${log.length === 0 && html`
          <div class="log-entry placeholder-log">
            <p>Awaiting system resonance...</p>
          </div>
        `}
        ${log.map(entry => html`
          <div class="log-entry">
            <div class="log-entry-header">
              <span class="event-tag ${entry.event.toLowerCase().replace(/\\s+/g, '-')}">${entry.event}</span>
              <span class="timestamp">${new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            <p class="narrative">${entry.narrative}</p>
          </div>
        `)}
      </div>
    </div>
  `;
}
