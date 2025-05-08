import { processCloudwatchErrorLogs } from "./cloudwatch";

export async function handler(event, context) {
  try {
    const cloudwatchLogs = await processCloudwatchErrorLogs();
    return {
      statusCode: 200,
      body: JSON.stringify(cloudwatchLogs),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return { 
      statusCode: 500,
      body: 'Error processing event: ' + error.message 
    };
    
  }
}