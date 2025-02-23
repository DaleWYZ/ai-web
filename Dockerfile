# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 首先只复制 package.json 相关文件并安装依赖
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm install && \
    # 安装所有必要的类型声明文件和开发依赖
    npm install -D @types/react @types/react-dom @types/node typescript && \
    # 安装其他可能需要的依赖
    npm install react react-dom next @next/font

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# Python爬虫阶段
FROM python:3.9-slim AS scraper
WORKDIR /app
COPY scraper/requirements.txt ./
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
    pip install --no-cache-dir -r requirements.txt
COPY scraper/ ./

# 运行阶段
FROM node:18-alpine AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制Python爬虫
COPY --from=scraper /app ./scraper
RUN apk add --no-cache python3 py3-pip && \
    pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
    pip3 install --no-cache-dir -r scraper/requirements.txt

# 创建数据目录并设置权限
RUN mkdir -p public/data && \
    chown -R nextjs:nodejs public/data

# 切换到非root用户
USER nextjs

EXPOSE 3000

# 启动命令
CMD ["node", "server.js"] 