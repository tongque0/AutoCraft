
# NodeServer

这是一个使用node服务端的开发模版，致力于快速简单的构建高稳定，高可用的服务。


## 技术栈

**客户端:**

**服务端:** Node, Express,Prisma,Docker


## 运行测试

要运行测试，运行以下命令

开发环境运行：将加载.env.development下环境变量，使用nodemon启动
```bash
  npm run dev
```

生产环境运行：将加载.env.product下环境变量
```bash
  npm run prod
```

数据库迁移：将根据prisma文件夹下内容，自动迁移数据库。
```bash
  npm run migrate
```
数据库预览：在浏览器5555端口，启动数据库预览
```bash
  npm run prisma
```

Dokcer:
```bash
  docker-compose up --build
```
 Docker 运行环境的配置位于 docker-compose 文件中，默认加载 .env.docker-development 环境变量文件。注意：在使用开发时，可以选择使用 Docker 运行数据库，确保环境变量文件正确配置。

 注意事项:开梯子可能造成数据库连接失败，以至于程序运行失败

## 开发

1. **定义 API 在 apifox 中**
   - 使用 [api文档中](https://2gleddbc8g.apifox.cn/api-141489153) 进行 API 定义。
   - 密码：NodeServer
   - 模板包含用户相关接口，可根据需要进行删改。

2. **编写业务代码**
   - 业务代码应按照 MVC 或类似架构进行组织。
   - `handler` 层处理请求和响应，与路由绑定。
   - `route` 层定义路由，将请求映射到对应的 `handler`。
   - `service` 层处理具体的业务逻辑。
   - `model` 层表示数据结构，可能与数据库进行交互（因为使用Prisma，model层不明显）。

3. **编写测试**
   - 在 `handler` 层，为每个接口编写单元测试，确保其正常工作。
   - 在 `service` 层测试业务逻辑，使用测试框架（如 Mocha、Jest）。

4. **自动化部署**
   - 考虑使用 CI/CD 流水线自动构建、测试和部署。
   - 确保提交到版本控制库后的自动化流程。

5. **持续改进**
   - 定期回顾和改进开发流程。
   - 收集团队反馈，调整流程以提高效率和代码质量。


## 文档

[express](https://nodejs.cn/express/guide/)
[Prisma](https://prisma.yoga/concepts/components/prisma-schema#accessing-environment-variables-from-the-schema)
[Apifox](https://apifox.com/?utm_source=baidu&utm_medium=sem&utm_campaign=251527561&utm_content=7811417731&utm_term=apifox%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93&bd_vid=6126891854488729200)
[Docker](https://www.docker.com/)
