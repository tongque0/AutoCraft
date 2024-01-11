import { InitMysql } from "./mysql/init.js";
import { InitRedis } from "./redis/init.js";
import { InitPrisma } from "./prisma/init.js";
let DB = null;
let redisClient = null;
let prisma=null
// 初始化函数
export function InitDB() {
    // DB = InitMysql();       // 初始化 MySQL
    // redisClient = InitRedis(); // 初始化 Redis
    prisma=InitPrisma()
}


// 导出数据库连接池,操作数据库时，直接使用连接池对象即可
export { DB, redisClient,prisma };


//此模版数据库操作统一采用prisma，对于其他数据库，只定义init函数作为示例，如有需要，可以自行添加使用，此文件为数据库初始化文件。


