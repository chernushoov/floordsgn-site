// Netlify Function — FloorDSGN Contact Form
//
// Lead delivery cascade (first non-empty channel wins; failures fall through):
//   1. Telegram Bot API direct  — if TG_BOT_TOKEN + TG_CHAT_ID env vars are set
//   2. n8n webhook              — if N8N_WEBHOOK_URL env var is set
//   3. Log to console + return 200 so Netlify Forms still captures the lead
//
// The form HTML uses `data-netlify="true"` so the submission is captured in
// the Netlify Forms dashboard regardless of what this function does — no
// lead is ever lost. This function exists solely to push a real-time
// notification to the owner.
//
// Env vars (set in Netlify dashboard → Site settings → Environment variables):
//   TG_BOT_TOKEN   — BotFather token, e.g. "8123456789:AAH...". Required for
//                    Telegram delivery.
//   TG_CHAT_ID     — owner chat id or "@channelname". Required for Telegram.
//   N8N_WEBHOOK_URL — optional, fallback webhook for n8n / Zapier / Make.

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

  let body = {};
  try { body = event.body ? JSON.parse(event.body) : {}; } catch { body = {}; }

  const payload = {
    name:         body.name || '',
    phone:        body.phone || '',
    email:        body.email || '',
    project_type: body.project_type || body['project-type'] || '',
    floor_system: body.floor_system || body['floor-system'] || '',
    area:         body.area || '',
    message:      body.message || '',
    source:       body.source || 'floordsgn-netlify',
    page:         body.page || event.headers?.referer || '',
    ts:           new Date().toISOString(),
  };

  const delivered = [];
  const errors = [];

  // 1. Telegram direct
  if (process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID) {
    try {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TG_CHAT_ID,
            text: formatTelegramMessage(payload),
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        }
      );
      if (!tgRes.ok) {
        const errText = await tgRes.text().catch(() => '');
        throw new Error(`Telegram returned ${tgRes.status}: ${errText.slice(0, 200)}`);
      }
      delivered.push('telegram');
    } catch (err) {
      errors.push(`telegram: ${err.message}`);
    }
  }

  // 2. n8n webhook fallback
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!n8nRes.ok) throw new Error(`n8n returned ${n8nRes.status}`);
      delivered.push('n8n');
    } catch (err) {
      errors.push(`n8n: ${err.message}`);
    }
  }

  if (errors.length) console.error('Contact relay errors:', errors.join(' | '));

  return {
    statusCode: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      delivered: delivered.length ? delivered : ['netlify-forms-only'],
    }),
  };
};

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTelegramMessage(p) {
  const lines = ['<b>🟢 Новый лид — Floor.DSGN</b>', ''];
  if (p.name)         lines.push(`<b>Имя:</b> ${escapeHtml(p.name)}`);
  if (p.phone)        lines.push(`<b>Тел:</b> ${escapeHtml(p.phone)}`);
  if (p.email)        lines.push(`<b>Email:</b> ${escapeHtml(p.email)}`);
  if (p.project_type) lines.push(`<b>Тип проекта:</b> ${escapeHtml(p.project_type)}`);
  if (p.floor_system) lines.push(`<b>Система:</b> ${escapeHtml(p.floor_system)}`);
  if (p.area)         lines.push(`<b>Площадь:</b> ${escapeHtml(p.area)} м²`);
  if (p.message)      lines.push('', `<b>Сообщение:</b>`, escapeHtml(p.message));
  lines.push('', `<i>${escapeHtml(p.source)} · ${escapeHtml(p.page)}</i>`);
  return lines.join('\n');
}
