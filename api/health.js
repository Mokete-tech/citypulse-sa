// Vercel Serverless Function for health check
export default function handler(req, res) {
  // Return basic health information
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VITE_APP_ENV || 'production',
    version: '1.0.0'
  });
}
