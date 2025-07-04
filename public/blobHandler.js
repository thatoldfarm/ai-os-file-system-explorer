// blobHandler.js

// Store blobs in a map with directory structure
const blobs = new Map();

// Function to get a Blob from a URL or filename with directory support
function getBlobFromURLOrFilename(urlOrFilename) {
  // Check if the input contains directory structure
  if (urlOrFilename.includes('/')) {
    const [directory, filename] = urlOrFilename.split('/');

    // Check if the directory exists in the blobs map
    if (!blobs.has(directory)) {
      console.error(`Directory not found: ${directory}`);
      return null;
    }

    // Check if the file exists in the directory
    const directoryBlobs = blobs.get(directory);
    if (!directoryBlobs.has(filename)) {
      console.error(`File not found in directory ${directory}: ${filename}`);
      return null;
    }

    return directoryBlobs.get(filename);
  } else {
    // If there's no directory structure, treat it as a direct filename
    if (blobs.has(urlOrFilename)) {
      return blobs.get(urlOrFilename);
    } else {
      console.error(`Blob not found for URL or filename: ${urlOrFilename}`);
      return null;
    }
  }
}

// Function to create an object URL for a Blob and place it in a directory
function createObjectURLInDirectory(blob, directory, filename) {
  if (blob instanceof Blob) {
    const objectURL = URL.createObjectURL(blob);

    // Create or retrieve the directory in the blobs map
    if (!blobs.has(directory)) {
      blobs.set(directory, new Map());
    }

    // Store the Blob in the directory with both URL and filename
    blobs.get(directory).set(objectURL, blob);
    blobs.get(directory).set(filename, blob);

    return objectURL;
  } else {
    console.error(`Object URL not created. Invalid Blob provided.`);
    return null;
  }
}

// Export a function to handle script requests for resources
function handleScriptResourceRequest(scriptName, resourcePath) {
  // Check if the requested resource is in a directory within the blobs map
  const fullResourcePath = `${scriptName}/${resourcePath}`;
  const blob = getBlobFromURLOrFilename(fullResourcePath);

  if (blob) {
    return URL.createObjectURL(blob);
  } else {
    console.error(`Resource not found: ${fullResourcePath}`);
    return null;
  }
}

// Export functions for external use
export { getBlobFromURLOrFilename, createObjectURLInDirectory, handleScriptResourceRequest };