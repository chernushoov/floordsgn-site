/* Cloudflare Pages Function — FloorDSGN Studio lead log.
   POST /lead {persona, material, room, light, url, channel}
   Sends to the owner's Telegram IF env TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set;
   otherwise returns ok (dormant). Set those as Pages env vars to activate. */
export async function onRequestPost({ request, env }) {
  try {
    const d = await request.json().catch(() => ({}));
    const token = env.TELEGRAM_BOT_TOKEN, chat = env.TELEGRAM_CHAT_ID;
    if (token && chat) {
      const text =
        'FloorDSGN Studio — заявка\n' +
        'Персона: ' + (d.persona || '-') + '\n' +
        'Материал: ' + (d.material || '-') + '\n' +
        'Комната: ' + (d.room || '-') + ' · свет: ' + (d.light || '-') + '\n' +
        'Канал: ' + (d.channel || '-') + '\n' +
        (d.url || '');
      await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true })
      }).catch(() => {});
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
}
