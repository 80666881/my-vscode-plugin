import * as vscode from 'vscode';
import * as path from 'path';
import nativeRequire from '../native-require';

const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) => {
    const line = document.lineAt(position);
    // 获取文件名
    const fileName = document.fileName;
    // 获取文件目录
    const workDir = path.dirname(fileName);
    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    console.log('lineText: ', lineText);
    // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
    if (/(^|=| )\w+\.dependencies\.$/g.test(lineText)) {
        try {
            const json = nativeRequire(workDir + '/package.json');
            console.log('json: ', json.dependencies);
            const dependencies = Object.keys(json.dependencies || {}).concat(Object.keys(json.devDependencies || {}));
            return dependencies.map(dep => {
                // vscode.CompletionItemKind 表示提示的类型
                return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
            });
        } catch (e) {
            console.log('[ e ]', e);
        }

    }
};
/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
    return null;
}

export const autoComplete = (context: vscode.ExtensionContext) => {

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(['javascript'], {
        provideCompletionItems,
        resolveCompletionItem,

    }, '.'));
};