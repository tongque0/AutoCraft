import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行出错: ${error}`);
                return reject(error);
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
}

async function codegen() {
    try {
        console.log("开始生成 Service 层代码...");
        await runScript(path.join(__dirname, './scripts/service-gen.js'));

        console.log("开始生成 Handler 层代码...");
        await runScript(path.join(__dirname, './scripts/handler-gen.js'));

        console.log("开始生成 Router 层代码...");
        await runScript(path.join(__dirname, './scripts/router-gen.js'));

        console.log("所有代码生成完毕！");
    } catch (error) {
        console.error("代码生成过程中发生错误:", error);
    }
}

codegen();
