import React from 'react';

interface EmulatorWindowProps {
  src: string;
  title: string;
}

const EmulatorWindow: React.FC<EmulatorWindowProps> = ({ src, title }) => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2>{title}</h2>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title={title}
      />
    </div>
  );
};

export const SectorforthEmulatorWindow: React.FC = () => {
  return <EmulatorWindow src="/public/start-sectorforth.html" title="Sectorforth Emulator" />;
};

export const GenericEmulatorWindow: React.FC = () => {
  return <EmulatorWindow src="/public/start-freedos.html" title="FreeDOS Emulator" />;
};
