import express from 'express';
import * as dotenv from 'dotenv'; dotenv.config();
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { InitDB } from './biz/dal/init.js'
import { SetLogger } from './biz/util/logger.js';
import { RouterRegister } from './biz/router/register.js';

async function main() {

    //初始化数据库
    InitDB()

    const app = express(); // 创建 Express 应用实例

    registerMiddleware(app); // 注册中间件

    await RouterRegister(app)

    const port = process.env.EXPRESS_PORT||3000; // 从配置获取端口
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

function registerMiddleware(app) {
    // Helmet 增强应用的安全性
    app.use(helmet());

    // CORS 中间件用于处理跨源资源共享（CORS）
    app.use(cors());

    //日志,将morgan日志重定向至Winston
    const logger = SetLogger()
    app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));

    // Express 内置中间件用于解析 JSON 格式的请求体
    app.use(express.json());

    // Express 内置中间件用于解析 URL 编码的请求体
    app.use(express.urlencoded({ extended: true }));

    // 这里可以添加更多的中间件...

}

main().catch(error => {
    console.error('Failed to start the server:', error);
});
