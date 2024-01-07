import mysql from "mysql2"


export function InitMysql() {
    // 从配置文件中获取MySQL配置

    try {
        // 创建MySQL连接池
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST || 'localhost',
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '', // 添加密码字段
            database: process.env.MYSQL_DATABASE || 'test',
            waitForConnections: true,
            connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
            idleTimeout: process.env.MYSQL_MAX_IDLE || 60000, // 空闲连接超时时间（毫秒）
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('无法连接到MySQL数据库: ', err);
                throw err;
            } else {
                console.log('成功连接到mysql数据库')
                connection.release(); // 释放连接
            }
        });
        return pool;

    } catch (error) {
        console.error("无法初始化MySQL连接池: ", error);
        throw error;
    }
}


