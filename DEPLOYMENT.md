# Songy - Инструкция по деплою на продакшн

## Вариант 1: Бесплатный хостинг (Рекомендуется для старта)

### Railway (Рекомендуется)
**Бесплатно:** $5 кредит в месяц (достаточно для небольшого магазина)

1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. Нажмите "New Project" → "Deploy from GitHub"
3. Выберите ваш репозиторий
4. Railway автоматически определит стек и настроит деплой
5. Добавьте переменные окружения:
   - `MONGO_URL` - MongoDB Atlas URI (бесплатно)
   - `STRIPE_API_KEY` - ваш ключ Stripe
   - `JWT_SECRET` - случайная строка для токенов
6. Railway даст URL вида: `https://songy-production.up.railway.app`

### Render (Альтернатива)
**Бесплатно:** Базовый тариф с ограничениями

1. Зарегистрируйтесь на [render.com](https://render.com)
2. Создайте "Web Service" из GitHub
3. Настройте:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Для фронтенда создайте "Static Site"
5. Добавьте переменные окружения

### Vercel + Railway
**Идеально для React + Python:**

1. **Frontend на Vercel (бесплатно):**
   - [vercel.com](https://vercel.com) → Import Project
   - Выберите папку `frontend`
   - Добавьте `REACT_APP_BACKEND_URL=https://your-backend.railway.app`

2. **Backend на Railway:**
   - Деплой папки `backend` на Railway
   - Настройте MongoDB Atlas

### MongoDB Atlas (Бесплатная база данных)

1. Зарегистрируйтесь на [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Создайте бесплатный кластер (M0 Sandbox - 512MB)
3. В Security → Database Access создайте пользователя
4. В Network Access добавьте `0.0.0.0/0` (разрешить все IP)
5. Нажмите Connect → Drivers → скопируйте connection string
6. Замените `<password>` на ваш пароль

**Пример строки подключения:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/songy?retryWrites=true&w=majority
```

---

## Вариант 2: Деплой через Emergent (1-клик)

### Шаг 1: Сохранить код на GitHub
1. В чате Emergent нажмите кнопку **"Save to GitHub"** в нижней части поля ввода
2. Выберите репозиторий или создайте новый
3. Код автоматически запушится в ваш репозиторий

### Шаг 2: Деплой на продакшн
1. В интерфейсе Emergent нажмите кнопку **"Deploy"**
2. Выберите план деплоя (Free или Pro)
3. После деплоя вы получите URL вида: `https://your-app-name.emergent.app`

### Шаг 3: Подключение домена songy.me
1. Перейдите в настройки деплоя в Emergent
2. Добавьте кастомный домен `songy.me`
3. В панели управления вашего домена добавьте DNS записи:
   - **Type**: CNAME
   - **Name**: @ или www
   - **Value**: (будет указан в Emergent)

---

## Вариант 2: Самостоятельный деплой

### Требования
- VPS сервер (DigitalOcean, AWS, Hetzner и т.д.)
- Docker и Docker Compose
- Домен с настроенным DNS

### Шаг 1: Подготовка сервера

```bash
# Установить Docker
curl -fsSL https://get.docker.com | sh

# Установить Docker Compose
sudo apt install docker-compose-plugin
```

### Шаг 2: Клонировать репозиторий

```bash
git clone https://github.com/your-username/songy.git
cd songy
```

### Шаг 3: Настроить переменные окружения

```bash
# Backend (.env)
cp backend/.env.example backend/.env
nano backend/.env
```

Содержимое `backend/.env`:
```
MONGO_URL=mongodb://mongo:27017/songy
DB_NAME=songy
JWT_SECRET=your-super-secret-key-change-this
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

```bash
# Frontend (.env)
nano frontend/.env
```

Содержимое `frontend/.env`:
```
REACT_APP_BACKEND_URL=https://songy.me
```

### Шаг 4: Создать docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=https://songy.me
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017/songy
      - DB_NAME=songy
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - frontend
      - backend

volumes:
  mongo_data:
```

### Шаг 5: Создать nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:8001;
    }

    server {
        listen 80;
        server_name songy.me www.songy.me;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name songy.me www.songy.me;

        ssl_certificate /etc/ssl/songy.me.crt;
        ssl_certificate_key /etc/ssl/songy.me.key;

        location /api/ {
            proxy_pass http://backend/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Шаг 6: Получить SSL сертификат

```bash
# Используя Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d songy.me -d www.songy.me

# Скопировать сертификаты
mkdir ssl
cp /etc/letsencrypt/live/songy.me/fullchain.pem ssl/songy.me.crt
cp /etc/letsencrypt/live/songy.me/privkey.pem ssl/songy.me.key
```

### Шаг 7: Запустить

```bash
docker-compose up -d
```

### Шаг 8: Настроить DNS

В панели управления доменом songy.me добавьте:
- **A Record**: @ → IP вашего сервера
- **A Record**: www → IP вашего сервера

---

## Настройка Stripe для продакшн

1. Перейдите в [Stripe Dashboard](https://dashboard.stripe.com)
2. Переключитесь в режим **Live** (не Test)
3. Скопируйте **Publishable key** и **Secret key**
4. Настройте Webhook:
   - URL: `https://songy.me/api/checkout/webhook`
   - События: `checkout.session.completed`
5. Скопируйте **Webhook signing secret**
6. Обновите переменные окружения

---

## Чек-лист перед запуском

- [ ] Домен настроен и DNS записи добавлены
- [ ] SSL сертификат установлен
- [ ] Stripe переведен в Live режим
- [ ] База данных MongoDB запущена
- [ ] Переменные окружения настроены
- [ ] Загружен логотип и контент
- [ ] Протестирован процесс оплаты
- [ ] Создан админ аккаунт

---

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Перезапуск сервисов
docker-compose restart

# Обновление после изменений
git pull
docker-compose build
docker-compose up -d

# Резервное копирование БД
docker exec mongo mongodump --out /backup
docker cp mongo:/backup ./backup
```

---

## Поддержка

Если возникли вопросы по деплою, обратитесь в поддержку Emergent или создайте issue в репозитории.
