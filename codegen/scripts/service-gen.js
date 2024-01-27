import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prismaSchemaPath = path.join(__dirname, '../../prisma/schema.prisma');
const prismaSchema = fs.readFileSync(prismaSchemaPath, 'utf8');

const modelRegex = /model\s+(\w+)/g;
let match;
const modelNames = [];

while ((match = modelRegex.exec(prismaSchema)) !== null) {
    modelNames.push(match[1]);
}

const templatePath = path.join(__dirname, '../templates/serviceTemplate.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

modelNames.forEach(modelName => {
    const renderedCode = ejs.render(template, {
        modelName: capitalizeFirstLetter(modelName),
        modelNameLowerCase: modelName.toLowerCase()
    });

    const outputPath = path.join(__dirname, `../output/services/${modelName}Service.js`);
    fs.writeFileSync(outputPath, renderedCode);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
