### Hexlet tests and linter status:
[![hexlet-check](https://github.com/Zyabridos/page-loader/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Zyabridos/page-loader/actions/workflows/hexlet-check.yml)

[![Maintainability](https://api.codeclimate.com/v1/badges/8f6ef9f2ab6b7a9a4403/maintainability)](https://codeclimate.com/github/Zyabridos/fullstack-javascript-project-4/maintainability)

### Description of the project
This CLI utile allows to download a web-page to local computer for offline use. The CLI utile downloads html of the web-page and attachments, such as CSS, JavaScript and Images in the format .png .img

### Minimum system requirments
- node.js v. 18.0.0 or higher
- bash / zsh

### Setup
```bash
$ git clone https://github.com/Zyabridos/page-loader
$ make install
```

### For start of the program, please:
1. Open  your terminal (in VS Code Cmd⌘ + J for Mac OS, Ctrl + J for Windows OS)
2. To start the CLI app, run the following command:
```bash
page-loader <url>
```

## Options

<li>The default output directory is working directory. If you want to change output directory, you have to run the command </li>

```bash
page-loader --o <output directory> <url>
```

<li>The CLI utile gives you a possibility to debug the program. If during the process there was an error and you want to define it, please run </li>

```bash
page-loader --d <url>
```
<li>If you need an additional information about the utile, please run </li>

```bash
page-loader -h
```

### Demonstration of installed project with standart parameters:
[![asciicast](https://asciinema.org/a/675351.svg)](https://asciinema.org/a/675351)

### Demonstration of installed project with different directory and debugging: 
[![asciicast](https://asciinema.org/a/675355.svg)](https://asciinema.org/a/675355)
