// Vercel Serverless Function — FloorDSGN Contact Form
// Stable relay: form → /api/contact → n8n webhook → Telegram
// N8N_WEBHOOK_URL env var: set in Vercel dashboard when cloudflared URL changes

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL ||
    'https://dairy-nationally-grades-floors.trycloudflare.com/webhook/floordsgn-contact';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const payload = {
      name:         body.name || '',
      phone:        body.phone || '',
      email:        body.email || '',
      project_type: body.project_type || '',
      floor_system: body.floor_system || '',
      area:         body.area || '',
      message:      body.message || '',
      source:       'floordsgn-vercel',
      ts:           new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}`);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Contact relay error:', err.message);
    // Still return 200 to user — don't show backend errors on form
    return res.status(200).json({ ok: true, note: 'queued' });
  }
}
