# Remove Comments

A Visual Studio Code extension to remove all single-line and multi-line comments from code, minify code, and log selected text to the console.

## Features

- Remove all single-line and multi-line comments from the entire file.
- Minify the code by removing unnecessary whitespace and line breaks.
- Create a `console.log` statement for the selected text.
- Remove comments from the selected text.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "Remove Comments".
4. Click the "Install" button.

## Usage

### Commands

The extension provides the following commands:

1. **Remove All Comments**

   - Command: `remove-comments.removeAllComments`
   - Removes all single-line and multi-line comments from the entire file.
   - Access: Open the Command Palette (`Ctrl+Shift+P`), type `Remove All Comments`, and select the command.

2. **Minify File**

   - Command: `remove-comments.minifyFile`
   - Minifies the code by removing unnecessary whitespace and line breaks.
   - Access: Open the Command Palette (`Ctrl+Shift+P`), type `Minify File`, and select the command.

3. **Console Log Selection**

   - Command: `remove-comments.consoleLogSelection`
   - Creates a `console.log` statement for the selected text.
   - Access: Select the text, then open the Command Palette (`Ctrl+Shift+A`), type `Console Log Selection`, and select the command.
   - Shortcut: `Ctrl+Shift+G`

4. **Remove Comments from Selection**
   - Command: `remove-comments.removeCommentsFromSelection`
   - Removes single-line and multi-line comments from the selected text.
   - Access: Select the text, then open the Command Palette (`Ctrl+Shift+J`), type `Remove Comments from Selection`, and select the command.
