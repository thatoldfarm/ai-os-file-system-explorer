
import React, { FC } from 'react';
import type { FileBlob } from '../core/types';
import { LiaChatInterface } from './LiaChatInterface';

export const ContentViewer: FC<{
  file: FileBlob | null;
  appProps: any;
}> = ({ file, appProps }) => {
  // Case: No file selected
  if (!file) {
    return (
      <div className="content-viewer placeholder">
        Select a file to view its content
      </div>
    );
  }

  const { type, url, textContent, name } = file;

  // Case: LIA HOSS Key (Chat Interface)
  if (name === 'LIA_HOSS.key') {
    return (
      <div className="content-viewer">
        <LiaChatInterface {...appProps} />
      </div>
    );
  }

  // Case: App files (show placeholder text)
  if (name === 'sectorforth.app' || name === 'freedos.app') {
      const appName = name === 'sectorforth.app' ? 'Sectorforth Emulator' : 'FreeDOS Emulator';
      return (
        <div className="content-viewer placeholder">
            {`${appName} selected.`}
        </div>
      );
  }

  // Case: HTML files
  if (type === 'text/html') {
    return (
      <div className="content-viewer">
        <iframe src={url} title={name} className="content-iframe" />
      </div>
    );
  }
  
  // Case: Other text files
  if (type.startsWith('text/')) {
    return (
      <div className="content-viewer">
        <pre className="content-text">{textContent}</pre>
      </div>
    );
  }

  // Case: Image files
  if (type.startsWith('image/')) {
    return (
      <div className="content-viewer">
        <img src={url} alt={name} />
      </div>
    );
  }

  // Case: Video files
  if (type.startsWith('video/')) {
    return (
      <div className="content-viewer">
        <video src={url} controls autoPlay loop />
      </div>
    );
  }
  
  // Case: Audio files
  if (type.startsWith('audio/')) {
    return (
      <div className="content-viewer">
        <audio src={url} controls autoPlay loop />
      </div>
    );
  }

  // Fallback for unknown/undisplayable types
  return (
    <div className="content-viewer placeholder content-download">
      <p>Cannot display this file type directly.</p>
      <a href={url} download={name} className="download-button">Download {name}</a>
    </div>
  );
};
