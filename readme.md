docker运行
    清理:docker-compose down
    构建:docker-compose up --build
    docke运行环境在docker-compose文件中指定为docker-development 可根据需求更改
    开发时数据库可采用docker运行，在对应环境选择对应环境即可使用docker数据库进行开发
    注意事项:开梯子可能造成数据库连接失败，以至于程序运行失败

正常运行:
    npm run dev 使用development环境和nodemon热更新运行
    npm run start
    npm run start:prod 使用product环境运行

prisma:
    orm，能够更便捷的操作数据库
    prisma用来定义数据库结构，进行迁移，迁移命令已经写为脚本，npm run migrate
    如果不使用prisma，可以在biz/dal文件的init中去除prisma连接，其他数据库也一样。dal文件夹下包括数据库的初始化，模型的定义

此项目用到
    express，prisma
# NodeSever
