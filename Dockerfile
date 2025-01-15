# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com && \
    npm install
COPY . .
RUN npm run build

# Python爬虫阶段
FROM python:3.9-slim AS scraper
WORKDIR /app
COPY scraper/requirements.txt ./
# 设置pip镜像源
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
    pip install --no-cache-dir -r requirements.txt
COPY scraper/ ./scraper/

# 运行阶段
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# 复制必要文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=scraper /app/scraper ./scraper

# 安装Python运行环境（使用阿里云镜像源）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache python3 py3-pip && \
    pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
COPY --from=scraper /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 