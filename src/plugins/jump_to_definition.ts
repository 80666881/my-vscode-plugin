import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import util from './util';

const definePlugin = (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) => {
    // console.log('position: ', position);
    // 获取文件名
    const fileName = document.fileName;
    // 获取文件目录
    const workDir  = path.dirname(fileName);
    // 当前选中的单词
    const word  = document.getText(document.getWordRangeAtPosition(position));
    const line  = document.lineAt(position);
    const projectPath = util.getProjectPath(document);

    // console.log('====== 进入 provideDefinition 方法 ======');
    // console.log('fileName: ' + fileName); // 当前文件名
    // console.log('workDir: ' + workDir); // 当前文件所在目录
    // console.log('word: ' + word); // 当前光标所在单词
    // console.log('line: ' + line.lineNumber); // 当前光标所在行
    // console.log('projectPath: ' + projectPath); // 当前工程目录
    
    if (/\/package\.json$/.test(fileName)) {
        const json = document.getText();
        // console.log('=====json: ', json);
        if (new RegExp(`"(dependencies|devDependencies)":\\s*?\\{[\\s\\S]*?${word.replace(/\//g, '\\/')}[\\s\\S]*?\\}`, 'gm').test(json)) {
            let destPath = `${workDir}/node_modules/${word.replace(/"/g, '')}/README.md`;
            if (fs.existsSync(destPath)) {
                // new vscode.Position(0, 0) 表示跳转到某个文件的第一行第一列
                return new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(0, 0));
            }
        }
    }
};
export const jumpToDefinition = (context: vscode.ExtensionContext) => {
   
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['json'], {
        provideDefinition: definePlugin
    }));
};