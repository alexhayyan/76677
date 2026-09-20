export async function onRequestPost(context) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const body = await context.request.json();
    const { game, product, price, name, telegram, date } = body || {};

    if (!game || !product || !name || !telegram) {
      return new Response(JSON.stringify({ ok: false, error: "Заполнены не все поля" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors }
      });
    }

    const token = context.env.BOT_TOKEN;
    const chatId = context.env.ADMIN_CHAT_ID;

    if (!token || !chatId) {
      return new Response(JSON.stringify({ ok: false, error: "BOT_TOKEN/ADMIN_CHAT_ID не настроены" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors }
      });
    }

    const text = [
      "🛎 НОВАЯ ЗАЯВКА",
      "",
      `🎮 Игра: ${game}`,
      `📦 Товар: ${product}`,
      `💰 Цена: ${price == null ? "Уточняется" : Number(price).toLocaleString("ru-RU") + " ₽"}`,
      `👤 Имя: ${name}`,
      `💬 Telegram: ${telegram}`,
      `🕒 Время: ${date || new Date().toLocaleString("ru-RU")}`
    ].join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!tg.ok) {
      const detail = await tg.text();
      return new Response(JSON.stringify({ ok: false, error: "Telegram API error", detail }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...cors }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...cors }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
