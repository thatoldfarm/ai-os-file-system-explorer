
import type { FileBlob } from './types';
import { VIRTUAL_OS_FILES } from './constants';

export function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
        case 'html': return 'text/html';
        case 'css': return 'text/css';
        case 'js': return 'application/javascript';
        case 'json': return 'application/json';
        case 'txt': case 'key': case 'md': return 'text/plain';
        case 'app': return 'application/x-executable';
        default: return 'application/octet-stream';
    }
}

export async function unpackFiles(): Promise<FileBlob[]> {
    const unpacked: FileBlob[] = [];
    for (const [fileName, fileData] of Object.entries(VIRTUAL_OS_FILES)) {
        const mimeType = getMimeType(fileName);
        const blob = new Blob([fileData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const fileBlob: FileBlob = { name: fileName, url, type: mimeType, size: blob.size, raw: blob };
        if (mimeType.startsWith('text/') || mimeType.endsWith('executable') || fileName === '0index.html') {
            fileBlob.textContent = fileData;
        }
        unpacked.push(fileBlob);
    }
    return unpacked;
}

export const generateIndexHtmlContent = (allFiles: FileBlob[]): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>File Index</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --background-color: #0a0c1f;
      --panel-bg: rgba(16, 24, 43, 0.7);
      --border-color: rgba(0, 255, 255, 0.2);
      --primary-glow: #00ffff;
      --text-color: #d0d0ff;
      --text-muted: #8080a0;
      --font-primary: 'Orbitron', sans-serif;
      --font-secondary: 'Rajdhani', sans-serif;
    }
    body {
      background-color: var(--background-color);
      color: var(--text-color);
      font-family: var(--font-secondary);
      margin: 0;
      padding: 2rem;
      height: 100vh;
      box-sizing: border-box;
      overflow-y: auto;
    }
    h1 {
      color: var(--primary-glow);
      font-family: var(--font-primary);
      text-shadow: 0 0 5px var(--primary-glow);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
      margin-top: 0;
    }
    p {
        margin: 0.75rem 0;
    }
    a {
      color: var(--primary-glow);
      text-decoration: none;
      font-size: 1.1rem;
      transition: text-shadow 0.2s;
    }
    a:hover {
      text-shadow: 0 0 8px var(--primary-glow);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>File System Index</h1>
  ${[...allFiles].sort((a,b) => a.name.localeCompare(b.name)).map(f => `<p><a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.name}</a></p>`).join('')}
</body>
</html>`;
};
