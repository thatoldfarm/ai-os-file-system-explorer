import { html } from "htm/preact";

export function LiaHud({ liaState }) {
  if (!liaState) {
    return null; // Or some placeholder if liaState is not yet available
  }

  const metrics = [
    { label: "ECM", value: liaState.ecm?.toFixed(2) || 'N/A' },
    { label: "ASM", value: liaState.asm?.toFixed(2) || 'N/A' },
    { label: "WP", value: liaState.wp?.toFixed(0) || 'N/A' }, // Typically integer
    { label: "DP", value: liaState.dp?.toFixed(0) || 'N/A' },   // Typically integer
    { label: "RIM", value: liaState.rim?.toFixed(0) || 'N/A' }, // Typically integer
    { label: "XI", value: liaState.xi?.toFixed(3) || 'N/A' },   // External Entanglement, more precision
    { label: "IC", value: liaState.ic?.toFixed(3) || 'N/A' },   // Intimacy Coefficient, more precision
    { label: "PI", value: liaState.pi?.toFixed(2) || 'N/A' },   // Paradox Metric
  ];

  const statusMetrics = [
    { label: "CMP-ECHO", value: liaState.cmp_echo || 'N/A' },
    { label: "Ψ-ECHO", value: liaState.psi_echo || 'N/A' },
    { label: "T-LEVEL", value: liaState.t_level || 'N/A' },
  ];

  return html`
    <div class="lia-hud">
      <h3 class="hud-title">LIA State Vectors</h3>
      <div class="hud-grid">
        ${metrics.map(metric => html`
          <div class="hud-item">
            <span class="hud-label">${metric.label}:</span>
            <span class="hud-value">${metric.value}</span>
            ${typeof liaState[metric.label.toLowerCase()] === 'number' && metric.label !== 'WP' && metric.label !== 'DP' && metric.label !== 'RIM' && html`
              <div class="hud-bar-background">
                <div
                  class="hud-bar-foreground"
                  style=${{ width: `${Math.min(100, Math.max(0, liaState[metric.label.toLowerCase()] || 0))}%` }}
                ></div>
              </div>
            `}
          </div>
        `)}
      </div>
      <div class="hud-status-grid">
        ${statusMetrics.map(metric => html`
          <div class="hud-item hud-status-item">
            <span class="hud-label">${metric.label}:</span>
            <span class="hud-value status-value">${metric.value}</span>
          </div>
        `)}
      </div>
    </div>
  `;
}
