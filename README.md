# CFG Derivation and Parse Tree Generator

**Live Demo:**  
https://bhanvi-tafl-project.netlify.app/

---

## Overview

A browser-based tool to parse a **Context-Free Grammar (CFG)**, derive a target string, and visualize:

- Parsed grammar table  
- Leftmost and rightmost derivation steps  
- Full derivation chains  
- Parse tree  

---

## Features

- Supports multiple productions per non-terminal  
- Handles epsilon (`ε` or `epsilon`)  
- Step-by-step derivation navigation (next/previous)  
- Full derivation view  
- Canvas-based parse tree visualization  
- Includes example grammars for quick testing  

---

## Project Structure

```
.
├── index.html          # UI layout and entry point
├── css/
│   └── style.css       # Styling
├── js/
│   ├── grammar.js      # Grammar parsing and validation
│   ├── derivation.js   # Derivation logic and tree construction
│   ├── tree.js         # Parse tree rendering
│   └── app.js          # UI logic and interactions
```

---

## Run Locally

1. Download or clone the repository  
2. Open `index.html` in any browser  

No build tools or external dependencies are required.

---

## Usage

1. Enter grammar rules in the format:
   ```
   A -> alpha | beta
   ```
2. Enter the target string  
3. Click **Generate**  

The tool will display:
- Parsed grammar  
- Step-by-step derivations  
- Full derivation chains  
- Parse tree  

---

## Notes

- Non-terminals must be uppercase letters (`A–Z`)  
- The first rule defines the start symbol  
- If execution slows down:
  - Simplify the grammar  
  - Avoid left recursion  

---

## Author

Bhanvi Kumar
