import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import nativeRequire from '../native-require';
/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */
const provideHover = (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) => {
    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    const word = document.getText(document.getWordRangeAtPosition(position));

    if (/\/package\.json$/.test(fileName)) {
        console.log('进入provideHover方法');
        const json = document.getText();
        if (new RegExp(`"(dependencies|devDependencies)":\\s*?\\{[\\s\\S]*?${word.replace(/\//g, '\\/')}[\\s\\S]*?\\}`, 'gm').test(json)) {
            let destPath = `${workDir}/node_modules/${word.replace(/"/g, '')}/package.json`;
            console.log('destPath: ', destPath);
            if (fs.existsSync(destPath)) {
                console.log('[ 111 ]', 111);
                const content = nativeRequire(destPath);
                console.log('content: ', content);
                // hover内容支持markdown语法
                let strs = '';
                const tips = (strArr: string[]) => {
                    strArr.forEach(str => {
                        strs += str.trim()+'\n';
                    });
                };
                tips([
                    `- **名称**：${content.name}`,
                    `- **版本**：${content.version}`,
                    `- **许可协议**：${content.license}`
                ]);

                return new vscode.Hover(strs);
            }
        }
    }
};


export const hoverTips = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(vscode.languages.registerHoverProvider('json', {
        provideHover
    }));
};