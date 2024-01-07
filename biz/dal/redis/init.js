import Redis from "ioredis";

export function InitRedis() {
    // 从配置文件中获取Redis配置
    try {
        // 创建Redis客户端
        const redis = new Redis({
            host: process.env.REDIS_ADDRESS.split(":")[0] || 'localhost',
            port: process.env.REDIS_ADDRESS.split(":")[1] || 6379,
            password:process.env.REDIS_PASSWORD || '',  // 如果需要密码
            db: process.env.REDIS_DB || 0  // 如果需要指定数据库
        });
        redis.on('connect', () => {
            console.log('成功连接到Redis服务器');
        });
        redis.on('error', (err) => {
            console.error('连接Redis服务器失败: ', err);
            throw err;
        });
        return redis;
    } catch (error) {
        console.error("无法初始化Redis客户端: ", error);
        throw error;
    }
}
