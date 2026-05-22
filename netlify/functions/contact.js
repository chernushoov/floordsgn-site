// Netlify Function — FloorDSGN Contact Form
// Mirror of api/contact.js (Vercel). Same flow: form → /api/contact → n8n → Telegram.
// N8N_WEBHOOK_URL env var: set in Netlify dashboard when cloudflared URL rotates.

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL ||
    'https://dairy-nationally-grades-floors.trycloudflare.com/webhook/floordsgn-contact';

  let body = {};
  try { body = event.body ? JSON.parse(event.body) : {}; } catch { body = {}; }

  const payload = {
    name:         body.name || '',
    phone:        body.phone || '',
    email:        body.email || '',
    project_type: body.project_type || '',
    floor_system: body.floor_system || '',
    area:         body.area || '',
    message:      body.message || '',
    source:       'floordsgn-netlify',
    ts:           new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`n8n returned ${response.status}`);
    return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Contact relay error:', err.message);
    return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, note: 'queued' }) };
  }
};
