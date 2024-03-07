# 构建阶段
FROM node:lts as build-stage

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖并构建项目
RUN npm install
RUN npm run build:site

# 运行阶段
FROM nginx:stable-alpine as production-stage

# 从构建阶段复制构建结果到 Nginx 服务目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3003

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

