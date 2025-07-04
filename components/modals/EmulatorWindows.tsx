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

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (isVisible && iframeRef.current && src) {
      const iframe = iframeRef.current;
      const handleLoad = () => {
        // This is a simplified example. In a real app, you'd fetch
        // the actual blob data for seabios, vgabios, and the fda/hda.
        // For now, we'll send placeholder URLs or identifiers.
        const mockBlobs = {
          "seabios.bin": "/public/seabios.bin", // Placeholder
          "vgabios.bin": "/public/vgabios.bin", // Placeholder
        };
        if (title === "Sectorforth Emulator") {
          mockBlobs["sectorforth.img"] = "/public/sectorforth.img"; // Placeholder
        } else if (title === "FreeDOS Emulator") {
          mockBlobs["freedos.boot.disk.160K.img"] = "/public/freedos.boot.disk.160K.img"; // Placeholder
        }
        // libv86.js is usually loaded via a script tag in the iframe's HTML,
        // so we might not need to send it via postMessage if start-*.html handles it.
        // However, if start-*.html expects it in blobs, include it.
        mockBlobs["libv86.js"] = "/public/libv86.js";


        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'emulatorAssets', payload: mockBlobs }, '*');
        }
      };

      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [isVisible, src, title]);

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
          ref={iframeRef}
          src={src}
          style={{ width: '100%', height: 'calc(100% - 40px)', border: '1px solid #333' }}
          title={title}
          sandbox="allow-scripts allow-same-origin" // Added sandbox for security, allow-scripts for emulator
        />
      </div>
    </div>
  );
};

interface EmulatorProps {
  isVisible: boolean;
  src: string;
  onClose: () => void;
  // onCopy and copiedContent might not be needed if emulators are self-contained pages
  // onCopy: (text: string) => void;
  // copiedContent: string;
  title?: string;
}

export const SectorforthEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow {...props} title="Sectorforth Emulator" />;
};

export const GenericEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  // Ensure a default title if not provided, especially for FreeDOS
  return <EmulatorWindow {...props} title={props.title || "FreeDOS Emulator"} />;
};
