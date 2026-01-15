---
title: "Review Agent"
description: "An Agent First, Local First desktop application"
date: 2025-01-11
---
Review Agent is an Agent-First, Local-First desktop application for autonomous, privacy-focused code reviews. It leverages local LLMs (via Ollama) to ensure that your source code never leaves your machine.

## 1. Key Features
**Autonomous Code Review**: Proactively detects bugs, security vulnerabilities, and code smells.
**Privacy-First**: Powered by Ollama. No internet connection or cloud API is required.
**Chain-of-Thought**: Displays the agent's internal reasoning process before providing final suggestions.
**Batch Processing**: Scan entire directories or project modules in a single session.
**Extensible Add-ins**: A sandbox environment to run custom scripts and UI dialogs.
**Language Agnostic**: Auto-detects programming languages and applies relevant rule sets.

## 2. Usage
### Install
You can download the latest releases of Review Agent at: [GitHub Releases](https://github.com/hohuuduc/ReviewSource/releases)

### Reviewing a Single File
Paste code into the editor or use File > Open to load a source file. The agent automatically identifies the language.

### Multi-File Batch Review
Select Folder: Navigate to Batch > Scan Directory. The system scans for compatible files and adds them to a processing queue.

### Using Add-ins (Plugins)
The Add-in system allows you to extend application functionality using JavaScript files.

**How to create a plugin:**
1. Create a `.js` file in the `.addins` directory.
2. Define the plugin structure as follows:

```javascript
exports.default = {
  metadata: {
    name: "Plugin Name" // Displayed in the Plugins menu
  },
  // Option 1: Execute action immediately
  action: function(api) {
    api.send({
      action: 'setFile',
      data: { content: '// Sample code', language: 'javascript' }
    });
  },
  // Option 2: Create a custom UI dialog
  createDialog: function(api) {
    const div = document.createElement('div');
    div.innerHTML = '<button id="btn">Click me</button>';
    div.querySelector('#btn').onclick = () => {
      console.log('Current Model:', api.config.model);
    };
    return div;
  }
};
```

**Supported APIs:**
- `api.send(payload)`: Send data back to the editor (supports `setFile` or `setFiles`).
- `api.config`: Access configuration information (host, model, prompt...).

## 3. Configuration & Settings
To customize the agent's behavior, navigate to the Settings panel:

**AI Engine Settings**
| Setting | Description |
| :--- | :--- |
| Ollama Endpoint | The URL where your Ollama instance is running. |
| Model Selection |The specific LLM used for inference. |

**Rule Management**
You can define custom JSON rules in the config/rules directory.
- **Critical**: High-priority issues (Security leaks, breaking bugs).
- **Warning**: Best practices (Naming conventions, linting).

## 5. Technical Stack
**Runtime**: Neutralinojs (Native OS Bridge)
**Frontend**: Angular (Standalone Components & Signals)
**AI Engine**: Ollama (Local Streaming API)

## 6. Benchmark

:::collapse("Benchmark Hardware Configuration")

| Component | Specification |
| :--- | :--- |
| **CPU** | Xeon E5-2699 (45M cache; 2,30 GHz) |
| **GPU** | NVIDIA Tesla P40 (24GB VRAM) |
| **RAM** | 48GB DDR4 |
| **OS** | Windows 10 |

:::

## 7. Optimization