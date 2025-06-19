module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;

  res.status(200).json({
    message: 'API Test Endpoint Working',
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    timestamp: new Date().toISOString(),
    method: req.method
  });
};
