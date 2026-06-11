# Notes Desktop

A lightweight desktop note-taking application built with React, TypeScript and Electron.

Notes Desktop allows users to create, edit, organize and back up notes locally while providing a native desktop experience on Windows.

---

# Features

* Create notes
* Edit note title and content
* Delete notes
* Search notes
* Automatic local persistence
* Import backups
* Export backups
* Native desktop application with Electron
* Windows executable generation

---

# Technologies

## Frontend

* React
* TypeScript
* Vite

## Desktop

* Electron
* Electron Builder

## Development Tools

* Git
* npm

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/JoaoOliveira20/notes-desktop.git
cd notes-desktop
```

## Install dependencies

```bash
npm install
```

## Run in development mode

```bash
npm run electron:dev
```

This command will:

* Start the Vite development server
* Launch Electron
* Open the desktop application automatically

---

# Available Scripts

## Development

```bash
npm run electron:dev
```

Runs Vite and Electron together.

## Frontend Only

```bash
npm run dev
```

Runs only the Vite development server.

## Build Frontend

```bash
npm run build
```

Generates:

```text
dist/
```

## Generate Windows Executable

```bash
npm run dist
```

This command:

1. Builds the React application
2. Packages the Electron application
3. Generates a Windows installer

Output directory:

```text
build-release/
```

Example:

```text
build-release/
├── Notes Desktop Setup 0.0.0.exe
└── win-unpacked/
```

---

# Local Storage

Notes are stored locally on the user's machine using Electron and the file system.

Storage flow:

```text
React
 ↓
electronAPI
 ↓
IPC
 ↓
Electron Main Process
 ↓
notes.json
```

Changes are automatically saved whenever a note is created, edited or deleted.

---

# Backup System

## Export Backup

Exports all notes into a JSON file.

Example:

```text
backup.json
```

## Import Backup

Imports a previously exported JSON backup and restores all notes.

---

# Roadmap

* Dark Mode
* Light Mode
* Note sorting
* Creation date
* Last update date
* Pinned notes
* Categories
* Tags
* Keyboard shortcuts
* Cloud synchronization
* Mobile version

---

# Author

João Oliveira