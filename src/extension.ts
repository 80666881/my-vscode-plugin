import * as vscode from 'vscode';
import * as plugins from './plugins';
export function activate(context: vscode.ExtensionContext) {
	const keys = Object.keys(plugins);
	keys.forEach((key) => {
		plugins[key as keyof typeof plugins](context);
	});
}

/**
 * 插件被释放时触发
 */
 exports.deactivate = function() {
    console.log('您的扩展“vscode-plugin-demo”已被释放！');
};