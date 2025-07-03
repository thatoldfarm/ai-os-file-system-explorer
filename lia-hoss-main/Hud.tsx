import { html } from "htm/preact";

export function Hud({ state }) {
  return html`
    <div class="hud-container">
      <div class="hud-panel">
        <h3 class="hud-title">Status</h3>
        <div class="hud-grid">
          <div class="hud-item">
            <span class="hud-label">ECM:</span>
            <span class="hud-value">${state.ecm.toFixed(2)}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">ASM:</span>
            <span class="hud-value">${state.asm.toFixed(2)}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">WP:</span>
            <span class="hud-value">${state.wp.toFixed(2)}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">DP:</span>
            <span class="hud-value">${state.dp.toFixed(2)}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">XI:</span>
            <span class="hud-value">${state.xi.toFixed(2)}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">IC:</span>
            <span class="hud-value">${state.ic.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

