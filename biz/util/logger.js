import winston from 'winston';

let logger = null;

export function SetLogger() {
    if (!logger) {
        const alignedWithColorsAndTime = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        );

        logger = winston.createLogger({
            level: process.env.LOG_LEVEL,
            format: winston.format.json(),
            transports: [
                // 控制台输出使用易读格式
                new winston.transports.Console({
                    format: alignedWithColorsAndTime,
                }),
                // 文件输出使用 JSON 格式
                new winston.transports.File({
                    filename: process.env.LOG_FILE_NAME,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                })
            ]
        });
    }
    return logger;
}
