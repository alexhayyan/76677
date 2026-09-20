ЗАГРУЗКА В GITHUB

В репозитории должны находиться именно эти файлы:

index.html
functions/api/order.js

После подключения GitHub-репозитория к Cloudflare Pages:
- Framework preset: None
- Build command: пусто
- Build output directory: /

В Settings -> Variables and Secrets добавьте:
BOT_TOKEN = токен Telegram-бота
ADMIN_CHAT_ID = Telegram ID получателя заявок

После деплоя тестовый заказ с сайта отправляется через /api/order в Telegram.
