import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {authMiddleware} from './middleware.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//自动导入router目录下所有router实现自动注册
async function loadRoutersFromDirectory(directory, app) {
    const items = fs.readdirSync(directory);

    for (let item of items) {
        // 跳过名为 'middleware.js' 中间件文件
        if (item === 'middleware.js') {
            continue;
        }
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && path.extname(item) === '.js') {
            try {
                const routerModule = await import(`file://${fullPath}`);
                const router = routerModule.default;
                if (router) {
                    // 假设路由路径与文件结构相对应
                    const routePath = fullPath.substring(__dirname.length, fullPath.length - 3).replace(/\\/g, '/');
                    // app.use(routePath, router); //可在此实现路由组，也可在单个router实现路由组
                    app.use('/', router)
                }
            } catch (error) {
                console.error(`Error loading router module ${item}:`, error);
            }
        } else if (stat.isDirectory()) {
            await loadRoutersFromDirectory(fullPath, app);
        }
    }
}

export async function RouterRegister(app) {
    app.use(authMiddleware)
    await loadRoutersFromDirectory(__dirname, app);
}
