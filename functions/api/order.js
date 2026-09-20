export async function onRequestPost(context) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const body = await context.request.json();

    console.log("ORDER BODY:", JSON.stringify(body));

    const { game, product, price, name, telegram, date } = body || {};

    if (!game || !product || !name || !telegram) {
      console.log("ERROR: Не заполнены обязательные поля");

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Заполнены не все поля"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }

    const token = context.env.BOT_TOKEN;
    const chatId = context.env.ADMIN_CHAT_ID;

    console.log("BOT_TOKEN exists:", !!token);
    console.log("ADMIN_CHAT_ID exists:", !!chatId);

    if (!token || !chatId) {
      console.log("ERROR: Переменные окружения не настроены");

      return new Response(
        JSON.stringify({
          ok: false,
          error: "BOT_TOKEN/ADMIN_CHAT_ID не настроены"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }

    const text = [
      "🛎 НОВАЯ ЗАЯВКА",
      "",
      `🎮 Игра: ${game}`,
      `📦 Товар: ${product}`,
      `💰 Цена: ${
        price == null
          ? "Уточняется"
          : Number(price).toLocaleString("ru-RU") + " ₽"
      }`,
      `👤 Имя: ${name}`,
      `💬 Telegram: ${telegram}`,
      `🕒 Время: ${date || new Date().toLocaleString("ru-RU")}`
    ].join("\n");

    console.log("Отправляем сообщение в Telegram...");

    const tg = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    const detail = await tg.text();

    console.log("Telegram status:", tg.status);
    console.log("Telegram response:", detail);

    if (!tg.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Telegram API error",
          detail: detail
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...cors
        }
      }
    );

  } catch (e) {
    console.log("SERVER ERROR:", e?.message || e);

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid request"
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...cors
        }
      }
    );
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
