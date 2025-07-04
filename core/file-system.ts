
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
        // Ensure textContent is populated for chunky HTML files specifically
        if (mimeType.startsWith('text/') || mimeType.endsWith('executable') || fileName === '0index.html' || fileName.startsWith('chunky-')) {
            fileBlob.textContent = fileData;
        }
        unpacked.push(fileBlob);
    }
    return unpacked;
}


// Helper functions for extractAssetsFromChunkyFileContent
function base64ToUint8Array(base64: string): Uint8Array {
    let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (standardBase64.length % 4 !== 0) {
        standardBase64 += '=';
    }
    try {
        const byteCharacters = atob(standardBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
    } catch (e) {
        console.error("Error in base64 decoding: ", e);
        return new Uint8Array(0);
    }
}

function isGzipCompressed(data: Uint8Array): boolean {
    return data.length >= 2 && data[0] === 0x1F && data[1] === 0x8B;
}

export async function extractAssetsFromChunkyFileContent(chunkyFileBlob: FileBlob): Promise<Record<string, FileBlob>> {
    const extractedAssets: Record<string, FileBlob> = {};
    if (!chunkyFileBlob.textContent) {
        console.warn(`No textContent found for ${chunkyFileBlob.name}`);
        return extractedAssets;
    }

    const htmlContent = chunkyFileBlob.textContent;
    const scriptContentMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptContentMatch || !scriptContentMatch[1]) {
        console.warn(`No script content found in ${chunkyFileBlob.name}`);
        return extractedAssets;
    }

    const scriptContent = scriptContentMatch[1];
    // Adjusted regex to be non-greedy for the JSON content itself
    const jsonDataMatches = scriptContent.matchAll(/data \+= `({[\s\S]*?})`;/g);
    if (!jsonDataMatches) {
        console.warn(`No JSON data chunks found in script of ${chunkyFileBlob.name}`);
        return extractedAssets;
    }

    const aggregatedChunks: Record<string, { name: string, base64Data: string, numbers: number[] }> = {};

    for (const match of jsonDataMatches) {
        const jsonDataString = match[1];
        try {
            const json = JSON.parse(jsonDataString);
            if (json && json.file && json.content && typeof json.content.chunk === 'string') {
                const assetName = json.file;
                if (!aggregatedChunks[assetName]) {
                    aggregatedChunks[assetName] = { name: assetName, base64Data: '', numbers: [] };
                }
                // Assuming chunks might not always be ordered by 'number', but typically they are concatenated.
                // If strict ordering by 'number' is needed, this part needs adjustment.
                // For now, direct concatenation based on appearance order.
                aggregatedChunks[assetName].base64Data += json.content.chunk;
                if (json.number !== undefined) { // Store chunk numbers if present
                    aggregatedChunks[assetName].numbers.push(json.number);
                }
            }
        } catch (e) {
            console.error(`Error parsing JSON chunk from ${chunkyFileBlob.name}:`, jsonDataString, e);
        }
    }

    // Import pako dynamically only when needed, or ensure it's globally available/imported at top of module
    const pako = await import('pako');

    for (const assetName in aggregatedChunks) {
        const assetData = aggregatedChunks[assetName];
        let uint8Array = base64ToUint8Array(assetData.base64Data);

        if (isGzipCompressed(uint8Array)) {
            try {
                uint8Array = pako.inflate(uint8Array);
            } catch (e) {
                console.error(`Error decompressing ${assetName}:`, e);
                continue; // Skip this asset if decompression fails
            }
        }

        const mimeType = getMimeType(assetName);
        const blob = new Blob([uint8Array], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const fileBlob: FileBlob = {
            name: assetName,
            url,
            type: mimeType,
            size: blob.size,
            raw: blob,
        };
        // For text-based assets, we might want to read their content
        if (mimeType.startsWith('text/')) {
            try {
                fileBlob.textContent = await blob.text();
            } catch (e) {
                console.warn(`Could not read text content for ${assetName}:`, e);
            }
        }
        extractedAssets[assetName] = fileBlob;
        console.log(`Extracted asset: ${assetName}, size: ${blob.size}, type: ${mimeType}, url: ${url}`);
    }

    return extractedAssets;
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
