# 使用官方 Node.js 作为基础镜像
FROM node:21

# 设置容器内的工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json（如果存在）复制到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到容器中
COPY . .

# 为应用程序打开端口（与 docker-compose 中映射的端口相同）
EXPOSE 3002

RUN npx prisma generate
# 运行应用
CMD ["npm", "run", "prod"]

