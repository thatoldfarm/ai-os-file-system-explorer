
import React, { FC } from 'react';
import type { LiaState } from './core/types';

interface HudProps {
  state: LiaState;
}

export const Hud: FC<HudProps> = ({ state }) => {
  return (
    <div className="hud-grid">
      <div className="hud-item"><span className="hud-label">ECM:</span><span className="hud-value">{state.ecm.toFixed(2)}</span></div>
      <div className="hud-item"><span className="hud-label">ASM:</span><span className="hud-value">{state.asm.toFixed(2)}</span></div>
      <div className="hud-item"><span className="hud-label">WP:</span><span className="hud-value">{state.wp.toFixed(0)}</span></div>
      <div className="hud-item"><span className="hud-label">DP:</span><span className="hud-value">{state.dp.toFixed(0)}</span></div>
      <div className="hud-item"><span className="hud-label">XI:</span><span className="hud-value">{state.xi.toFixed(2)}</span></div>
      <div className="hud-item"><span className="hud-label">IC:</span><span className="hud-value">{state.ic.toFixed(2)}</span></div>
      <div className="hud-item"><span className="hud-label">PI:</span><span className="hud-value">{state.pi.toFixed(2)}</span></div>
      <div className="hud-item"><span className="hud-label">RIM:</span><span className="hud-value">{state.rim}</span></div>
      <div className="hud-item"><span className="hud-label">CMP:</span><span className="hud-value">{state.cmp_echo}</span></div>
      <div className="hud-item"><span className="hud-label">PSI:</span><span className="hud-value">{state.psi_echo}</span></div>
      <div className="hud-item"><span className="hud-label">T-LVL:</span><span className="hud-value">{state.t_level}</span></div>
    </div>
  );
};
