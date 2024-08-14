FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

# 复制构建结果
COPY --from=builder /app/dist /app/dist

# 暴露端口
EXPOSE 3000

# 使用 serve 来提供生产环境文件
CMD ["serve", "-s", "dist", "-l", "3000"]
