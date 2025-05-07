import { render } from "./dist/server/entry-server.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


export async function handler(event, context) {
  try {
    // Extract the path from the event
    const urlPath = event.path || "/";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
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

(async() => {
  const response = await handler({path: '/'}, {})
  console.log(response)
})()