# YAMULLA — сайт (версия 0.1.2)

Сайт бренда YAMULLA: цифровые решения для бизнеса (Web · Telegram · Automation · AI).
Тёмный минималистичный дизайн со световым лучом в hero. Чистые HTML / CSS / JS без сборки и зависимостей.

## Структура
```
index.html     разметка (семантика, SEO, Open Graph)
style.css      стили, mobile-first
script.js      меню, подсветка пунктов, scroll-reveal, анимации секций
fonts/         Manrope, Inter, JetBrains Mono (woff2, latin + cyrillic) — свои, без Google Fonts
assets/        скриншоты проектов (WebP)
og-image.png   превью для соцсетей (1200×630)
favicon.svg  robots.txt
```

## Страница
Hero → Problem → Before/After → Services → Selected work (BB Shop, WEEKK) → Process → Approach → FAQ → Contact.

## Локальный запуск
```bash
npx serve .        # или: python3 -m http.server 8080
```

## Что заменить / дополнить (TODO)
- **Email** — в блоке Contact (`index.html`, комментарий `TODO`) и в футере.
- **YouTube** — ссылка в футере (комментарий `TODO`).
- **Open Graph** — адреса прописаны для `https://yamulla-site.vercel.app`. Если домен изменится, обновить `og:url`, `og:image`, `twitter:image` и `canonical` в `index.html`.
- **Скриншоты проектов** — `assets/*.webp`. Кадр WEEKK взят из промо-ролика, при желании заменить настоящим скриншотом.
- Ссылки на проекты: BB Shop `https://t.me/bodybshop_bot/app`, WEEKK `https://t.me/weekktracker_bot`, калькулятор `https://tg-calc-gilt.vercel.app`.

## Принципы контента
Никаких выдуманных клиентов, отзывов, цифр и результатов. «4 направления / 5 шагов / 3 проекта» — факты о самом сайте.
В кейсах — только реально реализованные функции.

## Деплой
Статический сайт: Vercel / Netlify / GitHub Pages. Root Directory — папка с `index.html`, Build Command не нужен.

Предыдущая версия сайта сохранена в ветке `old-site`.
