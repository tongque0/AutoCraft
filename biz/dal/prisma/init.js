import { PrismaClient } from '@prisma/client';

export function InitPrisma() {

    const connectionString = process.env.Prisma_DATABASE;
    try {
        // 使用连接字符串创建PrismaClient实例
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: connectionString,
                },
            },
        });

        // 测试数据库连接
        prisma.$connect()
            .then(() => {
                console.log('成功使用Prisma连接到数据库');
            })
            .catch((err) => {
                console.error('无法连接到MySQL数据库: ', err);
                throw err;
            });

        return prisma;
    } catch (error) {
        console.error("无法初始化Prisma Client: ", error);
        throw error;
    }
}
