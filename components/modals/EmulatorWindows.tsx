import React from 'react';

interface EmulatorWindowProps {
  src: string;
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

const EmulatorWindow: React.FC<EmulatorWindowProps> = ({ src, title, isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="emu-window-overlay" onClick={onClose}>
      <div className="emu-window" onClick={e => e.stopPropagation()}>
        <div className="emu-window-header">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <iframe
          src={src}
          className="emu-iframe"
          title={title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

interface EmulatorProps {
  isVisible: boolean;
  src: string;
  onClose: () => void;
  title?: string;
}

export const SectorforthEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow
            isVisible={props.isVisible}
            src={props.src}
            onClose={props.onClose}
            title="Sectorforth Emulator"
         />;
};

export const GenericEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow
            isVisible={props.isVisible}
            src={props.src}
            onClose={props.onClose}
            title={props.title || "FreeDOS Emulator"}
         />;
};