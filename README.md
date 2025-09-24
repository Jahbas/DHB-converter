# Number Converter & Calculator

A sleek, dark-themed web-based number converter and calculator that supports decimal, hexadecimal, and binary number systems with advanced mathematical operations.

![Number Converter](https://img.shields.io/badge/Number%20Converter-Web%20App-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🔢 **Number Conversion**
- **Decimal** ↔ **Hexadecimal** ↔ **Binary** conversion
- Real-time conversion as you type
- Auto-detection of input number format
- Support for mixed number bases in calculations

### 🧮 **Advanced Calculator**
- Basic operations: `+`, `-`, `×`, `÷`
- Exponentiation: `^` (power)
- Modulo: `%`
- Parentheses: `()` for complex expressions
- Mixed base calculations (e.g., `0xFF + 1010`)

### 📚 **History Management**
- Persistent calculation history
- Click to reload previous calculations
- Timestamps for each entry
- Clear history functionality
- Local storage (saved in browser)

### 🎨 **Modern UI/UX**
- **Multiple Themes**: Dark, Light, Ocean, and Purple themes
- **Theme Selector**: Easy theme switching with preview
- **Glass-morphism effects** with backdrop blur
- **Rounded corners** and smooth animations
- **Responsive design** (mobile-friendly)
- **Visual feedback** and error handling
- **Input type indicator** with auto-detection
- **Consistent white text** across all themes

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start converting and calculating!**

No installation or setup required - it's a pure client-side web application.

## 📖 Usage Examples

### Single Number Conversion
```
Input: 255
Output: Decimal: 255, Hex: FF, Binary: 11111111

Input: FF
Output: Decimal: 255, Hex: FF, Binary: 11111111

Input: 1010
Output: Decimal: 10, Hex: A, Binary: 1010
```

### Mathematical Expressions
```
Input: 10 + 5
Output: Decimal: 15, Hex: F, Binary: 1111

Input: 0xFF * 2
Output: Decimal: 510, Hex: 1FE, Binary: 111111110

Input: (10 + 5) * 2
Output: Decimal: 30, Hex: 1E, Binary: 11110

Input: 2^8
Output: Decimal: 256, Hex: 100, Binary: 100000000
```

### Mixed Base Calculations
```
Input: 0xFF + 1010
Output: Decimal: 265, Hex: 109, Binary: 100001001

Input: 255 % 16
Output: Decimal: 15, Hex: F, Binary: 1111
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Evaluate expression |
| `Escape` | Clear input |
| `Ctrl+K` | Clear input |
| `Ctrl+L` | Clear history |

## 🎨 Theme System

### **Available Themes:**
- **Dark** (Default) - Original dark blue gradient
- **Light** - Clean light gradient with blue accents
- **Ocean** - Purple to blue gradient
- **Purple** - Soft purple to pink gradient

### **Theme Features:**
- **Theme Selector**: Click the 🎨 button in bottom right
- **Instant Switching**: Themes change immediately
- **Persistent Storage**: Your choice is saved
- **Visual Previews**: See theme colors before switching
- **Consistent Design**: All themes maintain the same layout and functionality

## 🎯 Supported Operations

### Number Formats
- **Decimal**: `123`, `456`
- **Hexadecimal**: `FF`, `A1B2`, `0xFF` (with or without prefix)
- **Binary**: `1010`, `1111`

### Mathematical Operations
- **Addition**: `+`
- **Subtraction**: `-`
- **Multiplication**: `×` or `*`
- **Division**: `÷` or `/`
- **Exponentiation**: `^`
- **Modulo**: `%`
- **Parentheses**: `()` for grouping

## 🏗️ Project Structure

```
converter/
├── index.html          # Main HTML structure
├── style.css           # Dark theme styling
├── script.js           # Core functionality
└── README.md           # This file
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations, and glass-morphism
- **Vanilla JavaScript**: No external dependencies
- **Local Storage**: Persistent history

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Key Features
- **Real-time conversion**: Updates as you type
- **Expression parsing**: Handles complex mathematical expressions
- **Error handling**: Graceful error display
- **Responsive design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation support
- **Theme system**: 4 beautiful themes with persistent storage
- **History management**: Track and reload previous calculations
- **Mixed base calculations**: Combine different number systems

## 🎨 Customization

### Adding New Themes
To add a new theme, add CSS variables in `style.css`:

```css
/* New Theme */
[data-theme="newtheme"] {
    --bg-primary: linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%);
    --bg-card: rgba(255, 255, 255, 0.1);
    --bg-input: rgba(255, 255, 255, 0.15);
    --bg-input-focus: rgba(255, 255, 255, 0.2);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.8);
    --text-muted: rgba(255, 255, 255, 0.6);
    --border-color: rgba(255, 255, 255, 0.2);
    --border-focus: #accent-color;
    --accent-color: #accent-color;
    --error-color: #error-color;
    --success-color: #success-color;
    --warning-color: #warning-color;
}
```

Then add the theme option to the HTML and JavaScript.

### Adding New Operations
To add new mathematical operations, modify the `processExpression()` function in `script.js`:

```javascript
// Add new operation
expression = expression.replace(/newOp/g, 'newOperation');
```

## 🐛 Troubleshooting

### Common Issues

**Q: Numbers not converting correctly?**
A: Make sure you're using valid number formats:
- Decimal: Only digits 0-9
- Hexadecimal: Digits 0-9 and letters A-F
- Binary: Only digits 0 and 1

**Q: History not saving?**
A: Check if your browser allows local storage. Try clearing browser data and refreshing.

**Q: Calculator buttons not working?**
A: Make sure JavaScript is enabled in your browser.

**Q: Theme not changing?**
A: Make sure you're clicking the theme option, not just the preview circle. Try refreshing the page.

**Q: Theme not persisting after refresh?**
A: Check if your browser allows localStorage. Try clearing browser data and refreshing.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📧 Support

If you encounter any issues or have questions, please open an issue in the project repository.

---

**Made with ❤️ for developers and number enthusiasts!**
