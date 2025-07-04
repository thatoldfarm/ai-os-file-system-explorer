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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '80%',
        height: '80%',
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ color: '#d4d4d4', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: '#3c3c3c',
            border: '1px solid #555',
            color: '#ccc',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>Close</button>
        </div>
        <iframe
          src={src}
          style={{ width: '100%', height: 'calc(100% - 40px)', border: '1px solid #333' }}
          title={title}
        />
      </div>
    </div>
  );
};

interface EmulatorProps {
  isVisible: boolean;
  src: string;
  onClose: () => void;
  onCopy: (text: string) => void;
  copiedContent: string;
  title?: string;
}

export const SectorforthEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow {...props} title="Sectorforth Emulator" />;
};

export const GenericEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow {...props} title={props.title || "Emulator"} />;
};
