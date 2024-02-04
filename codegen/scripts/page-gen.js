import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取 Prisma 模型文件
const prismaSchemaPath = path.join(__dirname, '../../prisma/schema.prisma');
const prismaSchema = fs.readFileSync(prismaSchemaPath, 'utf8');
let modelName = 'User'; // 假设您的模型名称是 'User'
// 使用字符串模板字面量构建正则表达式
const modelRegex = new RegExp(`model ${modelName} \\{([\\s\\S]*?)^\\}`, 'gm');

const match = modelRegex.exec(prismaSchema);

let modelFields = [];
if (match) {
    const fields = match[1].trim().split('\n');
    modelFields = fields.map(fieldLine => {
        const fieldParts = fieldLine.trim().split(/\s+/);
        return fieldParts[0]; // 取字段名
    });
}

// 过滤掉不需要的字段
modelFields = modelFields.filter(field => field !== 'hashPassword');

// 读取 EJS 模板
const templatePath = path.join(__dirname, '../templates/pageTemplate.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

// 使用 EJS 渲染模板
const renderedCode = ejs.render(template, {
    modelFields: modelFields,
    modelName:modelName
});

const outputPath = path.join(__dirname, `../output/pages/${modelName}.vue`);
const outputDir = path.dirname(outputPath);

// 检查目录是否存在，如果不存在，则创建
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 现在可以安全地写入文件了
fs.writeFileSync(outputPath, renderedCode);
// 输出或保存生成的代码
console.log(renderedCode);
