# Remove Comments

**Remove Comments** is a Visual Studio Code extension that allows you to easily manage comments in your code. It provides commands to remove all comments, minify the file, and create console log statements for selected text.

## Features

- **Remove All Comments**: Removes all single-line and multi-line comments from your code.
- **Minify File**: Minifies your code by removing unnecessary whitespace and line breaks.
- **Console Log Selection**: Creates a `console.log` statement for the selected text on the next line.

## Commands

### Remove All Comments

Removes all comments from the current file.

- **Command Palette**: `Remove All Comments`
- **Command ID**: `remove-comments.removeAllComments`

### Minify File

Minifies the current file by removing unnecessary whitespace and line breaks.

- **Command Palette**: `Minify File`
- **Command ID**: `remove-comments.minifyFile`

### Console Log Selection

Creates a `console.log` statement for the selected text on the next line.

- **Command Palette**: `Console Log Selection`
- **Command ID**: `remove-comments.consoleLogSelection`
- **Keyboard Shortcut**: `Ctrl+Shift+L`

## Installation

1. **Compile Your Extension**: Open a terminal in the root directory of your extension and run:

   ```bash
   npm run compile
   ```

2. **Package the Extension**: Create a VSIX package by running:

   ```bash
   vsce package
   ```

3. **Install the VSIX in VS Code**:
   - Open VS Code.
   - Go to Extensions view (`Ctrl+Shift+X`).
   - Click on the three dots (More Actions) at the top of the Extensions view.
   - Select `Install from VSIX...`.
   - Choose the generated `.vsix` file.

## Usage

1. **Remove All Comments**:

   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `Remove All Comments` and select the command.

2. **Minify File**:

   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `Minify File` and select the command.

3. **Console Log Selection**:
   - Select the text you want to log.
   - Press `Ctrl+Shift+G` or open the Command Palette (`Ctrl+Shift+P`) and type `Console Log Selection` to execute the command.

## Enable/Disable the Extension

1. **Enable Extension**:

   - Go to the Extensions view in VS Code.
   - Find `Remove Comments` and click `Enable`.

2. **Disable Extension**:
   - Go to the Extensions view in VS Code.
   - Find `Remove Comments` and click `Disable`.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](#).

## License

This project is licensed under the MIT License.
