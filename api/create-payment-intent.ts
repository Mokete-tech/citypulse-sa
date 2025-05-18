// import { VercelRequest, VercelResponse } from '@vercel/node';

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
//   if (!stripeSecretKey) return res.status(500).json({ error: 'Stripe key missing' });

//   const Stripe = require('stripe');
//   const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' });

//   const { amount, currency = 'zar', metadata = {} } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency,
//       metadata,
//     });
//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }
