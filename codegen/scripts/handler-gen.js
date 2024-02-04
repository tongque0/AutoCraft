import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取模型名称
const prismaSchemaPath = path.join(__dirname, '../../prisma/schema.prisma');
const prismaSchema = fs.readFileSync(prismaSchemaPath, 'utf8');
const modelRegex = /model\s+(\w+)/g;
let match;
const modelNames = [];

while ((match = modelRegex.exec(prismaSchema)) !== null) {
    modelNames.push(match[1]);
}

// 读取 Handler 层模板
const templatePath = path.join(__dirname, '../templates/handlerTemplate.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

// 生成 Handler 层代码
modelNames.forEach(modelName => {
    const renderedCode = ejs.render(template, {
        modelName: capitalizeFirstLetter(modelName),
        modelNameLowerCase: modelName.toLowerCase()
    });

    const outputPath = path.join(__dirname, `../output/handlers/${modelName}Handler.js`);
    const outputDir = path.dirname(outputPath);

    // 检查目录是否存在，如果不存在，则创建
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 现在可以安全地写入文件了
    fs.writeFileSync(outputPath, renderedCode);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
