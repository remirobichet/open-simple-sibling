// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require("path");
const { promises: fsp } = require("fs");
const fs = require("fs");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('open-single-sibling.openSibling', async function () {
		if (!vscode.window.activeTextEditor) {
			vscode.window.showInformationMessage('Cannot open single sibling because there is no opened file');
			return
		}
		
		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		const currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
		const currentlyOpenTabfileDir = path.dirname(currentlyOpenTabfilePath);

		let fileCount = (await fsp.readdir(currentlyOpenTabfileDir)).length
		console.error('fileCount',fileCount)

		if (fileCount !== 2) {
			if (fileCount < 2) {
				vscode.window.showInformationMessage('Cannot open single sibling because there is less than 2 file in the folder');
			}
			if (fileCount > 2) {
				vscode.window.showInformationMessage('Cannot open single sibling because there is more than 2 file in the folder');
			}
			return
		}

		let siblingName
		fs.readdirSync(currentlyOpenTabfileDir).forEach(file => {
			if (file !== currentlyOpenTabfileName) {
				siblingName = file
			}
		});
		console.error('siblingName',siblingName)

		if (!siblingName) {
			vscode.window.showInformationMessage('Error retrieving siglings name');
			return
		}
		
		let uri = vscode.Uri.parse(`${currentlyOpenTabfileDir}/${siblingName}`)
		vscode.workspace.openTextDocument(uri).then((a) => {
			vscode.window.showTextDocument(a, 0, false)
		}, (error) => {
			console.error(error);
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
