
import React, { FC } from 'react';
import type { FileBlob } from '../core/types';

const FileIcon: FC<{ type: string }> = ({ type }) => {
    let iconSymbol;
    if (type.startsWith("image/")) iconSymbol = "🖼️";
    else if (type.startsWith("video/")) iconSymbol = "🎬";
    else if (type.startsWith("audio/")) iconSymbol = "🎵";
    else if (type === "text/html") iconSymbol = "🌐";
    else if (type === "application/x-executable") iconSymbol = "⚙️";
    else if (type.startsWith("text/")) iconSymbol = "📄";
    else iconSymbol = "📦";
    return <span className="file-icon" role="img" aria-label="file type icon">{iconSymbol}</span>;
};

const FileActions: FC<{ file: FileBlob }> = ({ file }) => {
    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`${type} copied!`);
        } catch (err) {
            console.error(`Failed to copy ${type}:`, err);
        }
    };
    return (
        <div className="file-actions">
            <button className="action-button" title="Copy Content" disabled={!file.textContent} onClick={(e) => { e.stopPropagation(); copyToClipboard(file.textContent || "", "Content"); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button className="action-button" title="Copy Blob URL" onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url, "URL"); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
            </button>
            <button className="action-button" title="Open in New Tab" onClick={(e) => { e.stopPropagation(); window.open(file.url, "_blank"); }}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
        </div>
    );
};

const FileItem: FC<{ file: FileBlob; onSelect: () => void; isActive: boolean }> = ({ file, onSelect, isActive }) => (
  <li className={`file-item ${isActive ? 'active' : ''}`} onClick={onSelect} tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onSelect()}>
    <FileIcon type={file.type} />
    <span className="file-name">{file.name}</span>
    <FileActions file={file} />
    <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
  </li>
);

export const FileExplorer: FC<{ files: FileBlob[]; onSelect: (file: FileBlob) => void; activeFile: FileBlob | null; }> = ({ files, onSelect, activeFile }) => {
    const copyFilenames = async () => {
        const names = files.map(f => f.name).join("\n");
        try {
            await navigator.clipboard.writeText(names);
            alert("File names copied!");
        } catch (err) {
            console.error("Failed to copy names:", err);
        }
    };
    return (
        <aside className="file-explorer">
            <div className="file-explorer-header">
                <h2>File System</h2>
                <button className="copy-filenames-button" onClick={copyFilenames} title="Copy all file names">Copy Names</button>
            </div>
            <ul className="file-list">
                {files.map(file => <FileItem key={file.name} file={file} onSelect={() => onSelect(file)} isActive={activeFile?.name === file.name} />)}
            </ul>
        </aside>
    );
};
