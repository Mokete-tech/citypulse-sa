// Vercel Serverless Function for handling contact form submissions
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, you would send an email or store the message in a database
    // For now, we'll just log it and return success
    console.log('Contact form submission:', { name, email, message });

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
