import * as vscode from 'vscode';
// 必须是具名函数，不能是匿名，否则export * from的时候拿不到名字
export const helloWorld = (context: vscode.ExtensionContext) => {
    // 注册HelloWord命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World！你好，小茗同学！');
    }));
};