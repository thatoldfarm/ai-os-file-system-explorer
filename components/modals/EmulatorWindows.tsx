import React from 'react';

interface EmulatorWindowProps {
  src: string;
  title: string;
  isVisible: boolean;
  onClose: () => void;
  assetsMap: Record<string, string> | null;
}

const EmulatorWindow: React.FC<EmulatorWindowProps> = ({ src, title, isVisible, onClose, assetsMap }) => {
  if (!isVisible) {
    return null;
  }

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (isVisible && iframeRef.current && src && assetsMap) {
      const iframe = iframeRef.current;
      const handleLoad = () => {
        if (iframe.contentWindow && assetsMap && Object.keys(assetsMap).length > 0) {
          console.log(`Posting assets to ${title}:`, assetsMap);
          iframe.contentWindow.postMessage({ type: 'emulatorAssets', payload: assetsMap }, '*');
        } else if (assetsMap && Object.keys(assetsMap).length === 0) {
            console.warn(`Asset map for ${title} is empty. Emulator might not load correctly.`);
        }
      };

      // Ensure the iframe is fully loaded before trying to post a message
      if (iframe.contentWindow) { // Check if contentWindow is available (it might not be immediately)
          // If already loaded (e.g. src didn't change but assetsMap did, or fast load)
          if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
              handleLoad();
          } else {
              iframe.addEventListener('load', handleLoad);
          }
      }

      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [isVisible, src, title, assetsMap]);

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
  assetsMap: Record<string, string> | null;
  title?: string;
}

export const SectorforthEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  return <EmulatorWindow
            isVisible={props.isVisible}
            src={props.src}
            onClose={props.onClose}
            assetsMap={props.assetsMap}
            title="Sectorforth Emulator"
         />;
};

export const GenericEmulatorWindow: React.FC<EmulatorProps> = (props) => {
  // Ensure a default title if not provided, especially for FreeDOS
  return <EmulatorWindow
            isVisible={props.isVisible}
            src={props.src}
            onClose={props.onClose}
            assetsMap={props.assetsMap}
            title={props.title || "FreeDOS Emulator"}
         />;
};
