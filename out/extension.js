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
const convertStyleToCSS = (styleObj) => {
    const entries = Object.entries(styleObj).map(([key, value]) => {
        const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        const cssValue = typeof value === "string" ? value.replace(/^'|'$/g, "") : value;
        return `${kebabKey}: ${cssValue};`;
    });
    return entries.join("\n  ");
};
const cleanInput = (input) => {
    return input.replace(/\{([^}]*)\}/g, (match, content) => {
        const cleanedContent = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "")
            .join("\n  ");
        return `{${cleanedContent}}`;
    });
};
const preprocessInput = (input) => {
    const blocks = input
        .split(/\n\n+/)
        .map((block) => block.trim())
        .filter((block) => block);
    return blocks.map((block) => {
        let wrap = false;
        let className = "";
        if (block.match(/^\.?[a-zA-Z0-9_-]+\s*{[^}]+}$/)) {
            const matches = block.match(/^\.?([a-zA-Z0-9_-]+)\s*{([^}]+)}$/);
            if (matches) {
                className = matches[1] ? `.${matches[1]}` : "";
                block = matches[2].trim();
            }
        }
        else if (block.startsWith("{") && block.endsWith("}")) {
            wrap = true;
            block = block.slice(1, -1).trim();
        }
        try {
            const jsonInput = JSON.parse(`{${block.replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":').replace(/'/g, '"')}}`);
            return { styleObj: jsonInput, wrap, className };
        }
        catch (error) {
            throw new Error("Invalid input format. Please ensure your input is correctly formatted.");
        }
    });
};
const formatCode = (code) => {
    const lines = code.split("\n").map((line) => line.trim());
    const formattedLines = lines.map((line) => {
        if (line.startsWith("{") || line.startsWith("}")) {
            return line;
        }
        const [key, value] = line.split(":");
        if (key && value) {
            return `${key.trim()}: ${value.trim()}`;
        }
        return line;
    });
    return formattedLines.join("\n");
};
function activate(context) {
    // Existing commands
    let removeCommentsAndMinifyDisposable = vscode.commands.registerCommand("remove-comments.removeAllComments", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fullText = document.getText();
            const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
            const multiLineComment = /\/\*[\s\S]*?\*\//gm;
            let textWithoutComments = fullText
                .replace(singleLineComment, "")
                .replace(multiLineComment, "");
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
            edit.replace(document.uri, fullRange, textWithoutComments);
            vscode.workspace.applyEdit(edit);
        }
    });
    let minifyDisposable = vscode.commands.registerCommand("remove-comments.minifyFile", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fullText = document.getText();
            const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
            const multiLineComment = /\/\*[\s\S]*?\*\//gm;
            let textWithoutComments = fullText
                .replace(singleLineComment, "")
                .replace(multiLineComment, "");
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
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(fullText.length));
            edit.replace(document.uri, fullRange, minifiedText);
            vscode.workspace.applyEdit(edit);
        }
    });
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
    let removeCommentsFromSelectionDisposable = vscode.commands.registerCommand("remove-comments.removeCommentsFromSelection", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            if (selectedText) {
                const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
                const multiLineComment = /\/\*[\s\S]*?\*\//gm;
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
                const singleLineComment = /(?<!http:|https:)\/\/.*$/gm;
                const multiLineComment = /\/\*[\s\S]*?\*\//gm;
                let textWithoutComments = fullText
                    .replace(singleLineComment, "")
                    .replace(multiLineComment, "");
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
    let showQuickPickDisposable = vscode.commands.registerCommand("remove-comments.showQuickPick", async () => {
        const options = [
            { label: "Remove All Comments" },
            { label: "Minify File" },
            { label: "Console Log Selection" },
            { label: "Remove Comments from Selection" },
            { label: "Remove Comments from All Files" },
            { label: "Convert Style to CSS" }, // Added new option
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
            case "Convert Style to CSS": // New case for the added command
                vscode.commands.executeCommand("extension.convertStyle");
                break;
        }
    });
    let convertStyleDisposable = vscode.commands.registerCommand("extension.convertStyle", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            try {
                const formattedInput = formatCode(selectedText);
                const cleanedInput = cleanInput(formattedInput);
                const blocks = preprocessInput(cleanedInput);
                const cssContents = blocks.map(({ styleObj, wrap, className }) => {
                    const cssContent = convertStyleToCSS(styleObj);
                    let css;
                    if (className) {
                        css = `${className} {\n  ${cssContent}\n}`;
                    }
                    else if (wrap) {
                        css = `{\n  ${cssContent}\n}`;
                    }
                    else {
                        css = cssContent;
                    }
                    return css;
                });
                const cssOutput = cssContents.join("\n\n");
                await editor.edit((editBuilder) => {
                    editBuilder.replace(selection, cssOutput);
                });
                vscode.window.showInformationMessage("Style converted to CSS!");
            }
            catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        }
    });
    context.subscriptions.push(removeCommentsAndMinifyDisposable);
    context.subscriptions.push(minifyDisposable);
    context.subscriptions.push(consoleLogDisposable);
    context.subscriptions.push(removeCommentsFromSelectionDisposable);
    context.subscriptions.push(removeCommentsFromAllFilesDisposable);
    context.subscriptions.push(showQuickPickDisposable);
    context.subscriptions.push(convertStyleDisposable); // Added new disposable
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
