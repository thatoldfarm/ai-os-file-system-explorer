
import React, { FC } from 'react';

// Define types for props
interface LiaState {
  ecm: number;
  asm: number;
  wp: number;
  dp: number;
  xi: number;
  ic: number;
  pi: number;
  rim: number;
  cmp_echo: string;
  psi_echo: string;
  t_level: string;
}

interface HudProps {
  state: LiaState;
}

export const Hud: FC<HudProps> = ({ state }) => {
  return (
    <div className="hud-container">
      <div className="hud-panel">
        <h3 className="hud-title">Status</h3>
        <div className="hud-grid">
          <div className="hud-item">
            <span className="hud-label">ECM:</span>
            <span className="hud-value">{state.ecm.toFixed(2)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">ASM:</span>
            <span className="hud-value">{state.asm.toFixed(2)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">WP:</span>
            <span className="hud-value">{state.wp.toFixed(2)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">DP:</span>
            <span className="hud-value">{state.dp.toFixed(2)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">XI:</span>
            <span className="hud-value">{state.xi.toFixed(2)}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">IC:</span>
            <span className="hud-value">{state.ic.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
