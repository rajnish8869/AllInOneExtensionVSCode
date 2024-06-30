"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // Command to remove all comments and minify
    let removeCommentsAndMinifyDisposable = vscode.commands.registerCommand("remove-comments.removeAllComments", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fullText = document.getText();
            // Regular expressions to match single-line and multi-line comments
            const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
            const multiLineComment = /\/\*[\s\S]*?\*\//gm;
            // Remove comments
            let textWithoutComments = fullText
                .replace(singleLineComment, "")
                .replace(multiLineComment, "");
            // Apply the changes to the editor
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
            edit.replace(document.uri, fullRange, textWithoutComments);
            vscode.workspace.applyEdit(edit);
        }
    });
    // Command to minify without removing comments
    let minifyDisposable = vscode.commands.registerCommand("remove-comments.minifyFile", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fullText = document.getText();
            // Regular expressions to match single-line and multi-line comments
            const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
            const multiLineComment = /\/\*[\s\S]*?\*\//gm;
            // Remove comments
            let textWithoutComments = fullText
                .replace(singleLineComment, "")
                .replace(multiLineComment, "");
            // Minify the code by removing unnecessary whitespace and line breaks
            let minifiedText = textWithoutComments
                .replace(/\s+/g, " ")
                .replace(/(\s*;\s*)/g, ";")
                .replace(/(\s*{\s*)/g, "{")
                .replace(/(\s*}\s*)/g, "}")
                .replace(/(\s*\(\s*)/g, "(")
                .replace(/(\s*\)\s*)/g, ")")
                .replace(/(\s*\[\s*)/g, "[")
                .replace(/(\s*\]\s*)/g, "]")
                .replace(/(\s*,\s*)/g, ",");
            // Apply the changes to the editor
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
            edit.replace(document.uri, fullRange, minifiedText);
            vscode.workspace.applyEdit(edit);
        }
    });
    // Command to create a console log for selected text
    let consoleLogDisposable = vscode.commands.registerCommand("remove-comments.consoleLogSelection", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            if (selectedText) {
                const logStatement = `console.log('${selectedText}:', ${selectedText});\n`;
                const position = selection.end.with(selection.end.line + 1, 0);
                editor.edit((editBuilder) => {
                    editBuilder.insert(position, logStatement);
                });
            }
            else {
                vscode.window.showInformationMessage("No text selected");
            }
        }
    });
    // Command to remove comments from the selected text
    let removeCommentsFromSelectionDisposable = vscode.commands.registerCommand("remove-comments.removeCommentsFromSelection", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            if (selectedText) {
                // Regular expressions to match single-line and multi-line comments
                const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
                const multiLineComment = /\/\*[\s\S]*?\*\//gm;
                // Remove comments from the selected text
                let textWithoutComments = selectedText
                    .replace(singleLineComment, "")
                    .replace(multiLineComment, "");
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, textWithoutComments);
                });
            }
            else {
                vscode.window.showInformationMessage("No text selected");
            }
        }
    });
    // Command to remove comments from all files
    let removeCommentsFromAllFilesDisposable = vscode.commands.registerCommand("remove-comments.removeCommentsFromAllFiles", async () => {
        const files = await vscode.workspace.findFiles("**/*.{js,ts,tsx,jsx,css}", "**/node_modules/**");
        if (!files.length) {
            vscode.window.showInformationMessage("No files found");
            return;
        }
        const progressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: "Removing comments from all files...",
            cancellable: true,
        };
        vscode.window.withProgress(progressOptions, async (progress, token) => {
            let completed = 0;
            for (const file of files) {
                if (token.isCancellationRequested) {
                    break;
                }
                const document = await vscode.workspace.openTextDocument(file);
                const fullText = document.getText();
                // Regular expressions to match single-line and multi-line comments
                const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
                const multiLineComment = /\/\*[\s\S]*?\*\//gm;
                // Remove comments
                let textWithoutComments = fullText
                    .replace(singleLineComment, "")
                    .replace(multiLineComment, "");
                // Apply the changes to the document
                const edit = new vscode.WorkspaceEdit();
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
                edit.replace(document.uri, fullRange, textWithoutComments);
                await vscode.workspace.applyEdit(edit);
                await document.save();
                completed++;
                progress.report({
                    message: `${completed}/${files.length} files processed`,
                    increment: (1 / files.length) * 100,
                });
            }
            vscode.window.showInformationMessage("Comment removal completed");
        });
    });
    // Show Quick Pick menu
    let showQuickPickDisposable = vscode.commands.registerCommand("remove-comments.showQuickPick", async () => {
        const options = [
            { label: "Remove All Comments" },
            { label: "Minify File" },
            { label: "Console Log Selection" },
            { label: "Remove Comments from Selection" },
            { label: "Remove Comments from All Files" },
        ];
        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: "Select an action",
        });
        if (!selection) {
            return; // No action selected
        }
        switch (selection.label) {
            case "Remove All Comments":
                vscode.commands.executeCommand("remove-comments.removeAllComments");
                break;
            case "Minify File":
                vscode.commands.executeCommand("remove-comments.minifyFile");
                break;
            case "Console Log Selection":
                vscode.commands.executeCommand("remove-comments.consoleLogSelection");
                break;
            case "Remove Comments from Selection":
                vscode.commands.executeCommand("remove-comments.removeCommentsFromSelection");
                break;
            case "Remove Comments from All Files":
                vscode.commands.executeCommand("remove-comments.removeCommentsFromAllFiles");
                break;
        }
    });
    context.subscriptions.push(removeCommentsAndMinifyDisposable);
    context.subscriptions.push(minifyDisposable);
    context.subscriptions.push(consoleLogDisposable);
    context.subscriptions.push(removeCommentsFromSelectionDisposable);
    context.subscriptions.push(removeCommentsFromAllFilesDisposable);
    context.subscriptions.push(showQuickPickDisposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
