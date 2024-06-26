import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Command to show quick pick menu for removing comments
  let showQuickPickDisposable = vscode.commands.registerCommand(
    "remove-comments.showQuickPick",
    async () => {
      const options = [
        "Remove Comments from Current File",
        "Remove Comments from Selected Text",
        "Remove Comments from All Files",
      ];
      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select an action",
      });

      switch (selectedOption) {
        case "Remove Comments from Current File":
          vscode.commands.executeCommand("remove-comments.removeAllComments");
          break;
        case "Remove Comments from Selected Text":
          vscode.commands.executeCommand(
            "remove-comments.removeCommentsFromSelection"
          );
          break;
        case "Remove Comments from All Files":
          vscode.commands.executeCommand(
            "remove-comments.removeCommentsFromAllFiles"
          );
          break;
        default:
          break;
      }
    }
  );

  // Existing commands...
  let removeCommentsAndMinifyDisposable = vscode.commands.registerCommand(
    "remove-comments.removeAllComments",
    () => {
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
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(fullText.length)
        );
        edit.replace(document.uri, fullRange, textWithoutComments);

        vscode.workspace.applyEdit(edit);
      }
    }
  );

  let minifyDisposable = vscode.commands.registerCommand(
    "remove-comments.minifyFile",
    () => {
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
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(fullText.length)
        );
        edit.replace(document.uri, fullRange, minifiedText);

        vscode.workspace.applyEdit(edit);
      }
    }
  );

  let consoleLogDisposable = vscode.commands.registerCommand(
    "remove-comments.consoleLogSelection",
    () => {
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
        } else {
          vscode.window.showInformationMessage("No text selected");
        }
      }
    }
  );

  let removeCommentsFromSelectionDisposable = vscode.commands.registerCommand(
    "remove-comments.removeCommentsFromSelection",
    () => {
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
        } else {
          vscode.window.showInformationMessage("No text selected");
        }
      }
    }
  );

  let removeCommentsFromAllFilesDisposable = vscode.commands.registerCommand(
    "remove-comments.removeCommentsFromAllFiles",
    async () => {
      const extensions = [".js", ".ts", ".tsx", ".jsx", ".css"];
      const files = await vscode.workspace.findFiles(
        `**/*{${extensions.join(",")}}`,
        "**/node_modules/**"
      );

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Removing comments from files...",
          cancellable: false,
        },
        async (progress) => {
          const totalFiles = files.length;
          let processedFiles = 0;

          const editPromises = files.map(async (file) => {
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
            const fullRange = new vscode.Range(
              document.positionAt(0),
              document.positionAt(fullText.length)
            );
            edit.replace(document.uri, fullRange, textWithoutComments);

            await vscode.workspace.applyEdit(edit);
            await document.save();

            processedFiles++;
            progress.report({
              increment: (processedFiles / totalFiles) * 100,
              message: `${processedFiles} of ${totalFiles} files processed`,
            });
          });

          await Promise.all(editPromises);

          vscode.window.showInformationMessage(
            "Comments removed from all files."
          );
        }
      );
    }
  );

  context.subscriptions.push(showQuickPickDisposable);
  context.subscriptions.push(removeCommentsAndMinifyDisposable);
  context.subscriptions.push(minifyDisposable);
  context.subscriptions.push(consoleLogDisposable);
  context.subscriptions.push(removeCommentsFromSelectionDisposable);
  context.subscriptions.push(removeCommentsFromAllFilesDisposable);
}

export function deactivate() {}
