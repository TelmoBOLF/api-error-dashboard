import { render } from "./dist/server/entry-server.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

export async function handler(event, context) {
  // Extract path from the request
  // Extract the path from the event
  const urlPath = event.rawPath ? event.rawPath : event.path || "/";

  console.log('Processing request for path:', event);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Check if this is a request for a static asset
  if (urlPath.includes('/assets/') || 
      urlPath.endsWith('.js') || 
      urlPath.endsWith('.css') || 
      urlPath.endsWith('.svg') || 
      urlPath.endsWith('.png') || 
      urlPath.endsWith('.ico')) {
    
    try {
      // Remove leading slash if present for path resolution
      const assetPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
      // Look for the asset in the client build directory
      const filePath = path.join(__dirname, 'dist/client', assetPath);
      console.log('Attempting to serve asset from:', filePath);
      
      if (!fs.existsSync(filePath)) {
        console.log('Asset not found at path:', filePath);
        return { 
          statusCode: 404,
          body: 'Asset not found'
        };
      }
      
      const content = fs.readFileSync(filePath);
      const contentType = getContentType(urlPath);
      
      console.log(`Serving asset of type ${contentType}, size: ${content.length} bytes`);
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=2592000" // 30 days cache
        },
        body: content.toString('base64'),
        isBase64Encoded: true
      };
    } catch (error) {
      console.error('Error serving asset:', error);
      return { 
        statusCode: 500,
        body: 'Error serving asset: ' + error.message 
      };
    }
  }

  try {
    
    

    const template = fs.readFileSync(
      path.resolve(__dirname, './dist/client/index.html'),
      'utf-8'
    );
    // Render the HTML
    const appContent = await render(urlPath);
    
    // Read the critical CSS and JS
    const html = template
      .replace('<!--app-html-->', appContent);

    // Return the response for API Gateway
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Render error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Internal Server Error",
    };
  }
}