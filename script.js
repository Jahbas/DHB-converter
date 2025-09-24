class NumberConverterCalculator {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateHistoryDisplay();
    }
    
    initializeElements() {
        // Main elements
        this.mainInput = document.getElementById('mainInput');
        this.inputTypeIndicator = document.getElementById('inputType');
        this.decimalResult = document.getElementById('decimalResult');
        this.hexResult = document.getElementById('hexResult');
        this.binaryResult = document.getElementById('binaryResult');
        this.historyList = document.getElementById('historyList');
        
        // Calculator buttons
        this.calcButtons = document.querySelectorAll('.calc-btn');
        this.clearBtn = document.getElementById('clearBtn');
        this.backspaceBtn = document.getElementById('backspaceBtn');
        this.equalsBtn = document.getElementById('equalsBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Theme elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeMenu = document.getElementById('themeMenu');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        // Settings elements
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsMenu = document.getElementById('settingsMenu');
        this.closeSettings = document.getElementById('closeSettings');
        this.functionButtons = document.querySelectorAll('.func-btn');
        
        // Copy and notification elements
        this.copyButtons = document.querySelectorAll('.copy-btn');
        this.notification = document.getElementById('notification');
    }
    
    initializeState() {
        this.history = JSON.parse(localStorage.getItem('converterHistory')) || [];
        this.isUpdating = false;
    }
    
    initializeEventListeners() {
        // Main input handling
        this.mainInput.addEventListener('input', (e) => this.handleMainInput(e));
        this.mainInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Calculator buttons
        this.calcButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCalcButton(e));
        });
        
        // Control buttons
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.backspaceBtn.addEventListener('click', () => this.backspace());
        this.equalsBtn.addEventListener('click', () => this.evaluateExpression());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // History functionality
        this.historyList.addEventListener('click', (e) => {
            if (e.target.closest('.history-item')) {
                this.loadFromHistory(e.target.closest('.history-item'));
            }
        });
        
        // Theme functionality
        this.themeToggle.addEventListener('click', () => this.toggleThemeMenu());
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => this.changeTheme(e.target.closest('.theme-option').dataset.theme));
        });
        
        // Settings functionality
        this.settingsToggle.addEventListener('click', () => this.toggleSettingsMenu());
        this.closeSettings.addEventListener('click', () => this.closeSettingsMenu());
        this.functionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFunctionButton(e));
        });
        
        // Copy functionality
        this.copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCopyButton(e));
        });
        
        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                this.closeThemeMenu();
            }
            if (!e.target.closest('.settings-selector')) {
                this.closeSettingsMenu();
            }
        });
    }
    
    // Input handling
    handleMainInput(event) {
        if (this.isUpdating) return;
        
        const value = event.target.value.trim();
        this.updateInputTypeIndicator(value);
        
        if (value === '') {
            this.clearResults();
            return;
        }
        
        if (this.isMathematicalExpression(value)) {
            this.evaluateAndConvert(value);
        } else {
            this.convertNumber(value);
        }
    }
    
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.evaluateExpression();
        }
        
        if (event.key === 'Escape') {
            this.clearInput();
        }
    }
    
    handleCalcButton(event) {
        const operation = event.target.dataset.op;
        const currentValue = this.mainInput.value;
        const cursorPos = this.mainInput.selectionStart;
        
        let newValue;
        if (operation === '(' || operation === ')') {
            newValue = currentValue.slice(0, cursorPos) + operation + currentValue.slice(cursorPos);
        } else {
            newValue = currentValue.slice(0, cursorPos) + ' ' + operation + ' ' + currentValue.slice(cursorPos);
        }
        
        this.mainInput.value = newValue;
        this.mainInput.dispatchEvent(new Event('input'));
        this.mainInput.focus();
        
        const newCursorPos = cursorPos + operation.length + (operation === '(' || operation === ')' ? 0 : 2);
        this.mainInput.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    handleFunctionButton(event) {
        const func = event.target.dataset.func;
        const currentValue = this.mainInput.value;
        const cursorPos = this.mainInput.selectionStart;
        
        let newValue;
        if (this.isConstant(func)) {
            newValue = currentValue.slice(0, cursorPos) + this.getConstantValue(func) + currentValue.slice(cursorPos);
        } else {
            newValue = currentValue.slice(0, cursorPos) + func + '(' + currentValue.slice(cursorPos);
        }
        
        this.mainInput.value = newValue;
        this.mainInput.dispatchEvent(new Event('input'));
        this.mainInput.focus();
        
        const newCursorPos = cursorPos + func.length + (this.isConstant(func) ? 0 : 1);
        this.mainInput.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    // Validation and type detection
    isValidDecimal(value) {
        return /^\d+$/.test(value) && parseInt(value, 10) >= 0;
    }
    
    isValidHex(value) {
        return /^[0-9A-Fa-f]+$/.test(value);
    }
    
    isValidBinary(value) {
        return /^[01]+$/.test(value);
    }
    
    isMathematicalExpression(value) {
        return /[+\-*/^%()]/.test(value) || /\s+[+\-*/^%]\s+/.test(value) || /[a-zA-Z]/.test(value);
    }
    
    isConstant(func) {
        return ['pi', 'e', 'phi'].includes(func);
    }
    
    getConstantValue(func) {
        const constants = {
            'pi': Math.PI.toString(),
            'e': Math.E.toString(),
            'phi': '1.618033988749895'
        };
        return constants[func] || '0';
    }
    
    // Input type indicator
    updateInputTypeIndicator(value) {
        if (value === '') {
            this.inputTypeIndicator.textContent = 'Auto-detect';
            return;
        }
        
        if (this.isMathematicalExpression(value)) {
            this.inputTypeIndicator.textContent = 'Expression';
        } else if (this.isValidDecimal(value)) {
            this.inputTypeIndicator.textContent = 'Decimal';
        } else if (this.isValidHex(value)) {
            this.inputTypeIndicator.textContent = 'Hexadecimal';
        } else if (this.isValidBinary(value)) {
            this.inputTypeIndicator.textContent = 'Binary';
        } else {
            this.inputTypeIndicator.textContent = 'Mixed';
        }
    }
    
    // Number conversion
    convertNumber(value) {
        let decimal;
        
        try {
            if (this.isValidDecimal(value)) {
                decimal = parseInt(value, 10);
            } else if (this.isValidHex(value)) {
                decimal = parseInt(value, 16);
            } else if (this.isValidBinary(value)) {
                decimal = parseInt(value, 2);
            } else {
                this.showError();
                return;
            }
            
            if (isNaN(decimal)) {
                this.showError();
                return;
            }
            
            this.updateResults(decimal);
            this.addChangeAnimation();
        } catch (error) {
            this.showError();
        }
    }
    
    // Expression evaluation
    evaluateAndConvert(expression, saveToHistory = false) {
        try {
            let processedExpression = this.processExpression(expression);
            const result = this.safeEval(processedExpression);
            
            if (isNaN(result) || !isFinite(result)) {
                this.showError();
                return;
            }
            
            const finalResult = Number.isInteger(result) ? Math.floor(result) : result;
            this.updateResults(finalResult);
            this.addChangeAnimation();
            
            if (saveToHistory) {
                this.addToHistory(expression, finalResult);
            }
        } catch (error) {
            this.showError();
        }
    }
    
    processExpression(expression) {
        // Replace hex numbers
        expression = expression.replace(/\b0x([0-9A-Fa-f]+)\b/g, (match, hex) => parseInt(hex, 16));
        expression = expression.replace(/\b([0-9A-Fa-f]+)\b/g, (match) => {
            if (/[A-Fa-f]/.test(match)) {
                return parseInt(match, 16);
            }
            return match;
        });
        
        // Replace binary numbers
        expression = expression.replace(/\b([01]+)\b/g, (match) => {
            if (match.length > 1 || match === '1') {
                return parseInt(match, 2);
            }
            return match;
        });
        
        // Replace ^ with ** for exponentiation
        expression = expression.replace(/\^/g, '**');
        
        // Add mathematical functions
        expression = this.addMathFunctions(expression);
        
        return expression;
    }
    
    addMathFunctions(expression) {
        const functions = {
            'sin': 'Math.sin',
            'cos': 'Math.cos',
            'tan': 'Math.tan',
            'asin': 'Math.asin',
            'acos': 'Math.acos',
            'atan': 'Math.atan',
            'log': 'Math.log10',
            'ln': 'Math.log',
            'sqrt': 'Math.sqrt',
            'cbrt': 'Math.cbrt',
            'abs': 'Math.abs',
            'floor': 'Math.floor',
            'ceil': 'Math.ceil',
            'round': 'Math.round',
            'factorial': 'this.factorial',
            'gcd': 'this.gcd',
            'lcm': 'this.lcm'
        };
        
        for (const [func, replacement] of Object.entries(functions)) {
            const regex = new RegExp(`\\b${func}\\s*\\(`, 'g');
            expression = expression.replace(regex, `${replacement}(`);
        }
        
        return expression;
    }
    
    safeEval(expression) {
        try {
            const cleanExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
            return Function('"use strict"; return (' + cleanExpression + ')')();
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }
    
    // Mathematical functions
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }
    
    // Results display
    updateResults(decimal) {
        this.isUpdating = true;
        
        this.decimalResult.textContent = decimal.toString();
        this.hexResult.textContent = decimal.toString(16).toUpperCase();
        this.binaryResult.textContent = this.formatBinary(decimal.toString(2));
        
        this.isUpdating = false;
    }
    
    formatBinary(binaryString) {
        // Add spaces every 8 digits for better readability
        if (binaryString.length > 8) {
            return binaryString.replace(/(.{8})/g, '$1 ').trim();
        }
        return binaryString;
    }
    
    clearResults() {
        this.decimalResult.textContent = '0';
        this.hexResult.textContent = '0';
        this.binaryResult.textContent = '0';
    }
    
    // Control functions
    clearInput() {
        this.mainInput.value = '';
        this.clearResults();
        this.inputTypeIndicator.textContent = 'Auto-detect';
        this.mainInput.focus();
    }
    
    backspace() {
        const currentValue = this.mainInput.value;
        const cursorPos = this.mainInput.selectionStart;
        
        if (cursorPos > 0) {
            const newValue = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);
            this.mainInput.value = newValue;
            this.mainInput.dispatchEvent(new Event('input'));
            this.mainInput.setSelectionRange(cursorPos - 1, cursorPos - 1);
        }
    }
    
    evaluateExpression() {
        const value = this.mainInput.value.trim();
        if (value && this.isMathematicalExpression(value)) {
            this.evaluateAndConvert(value, true);
        }
    }
    
    // Error handling
    showError() {
        this.decimalResult.textContent = 'Error';
        this.hexResult.textContent = 'Error';
        this.binaryResult.textContent = 'Error';
        
        [this.decimalResult, this.hexResult, this.binaryResult].forEach(result => {
            result.style.color = '#ff6b6b';
        });
        
        setTimeout(() => {
            [this.decimalResult, this.hexResult, this.binaryResult].forEach(result => {
                result.style.color = '';
            });
        }, 2000);
    }
    
    addChangeAnimation() {
        [this.decimalResult, this.hexResult, this.binaryResult].forEach(result => {
            result.classList.add('changed');
            setTimeout(() => {
                result.classList.remove('changed');
            }, 300);
        });
    }
    
    // History management
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }
        
        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-expression="${item.expression}">
                <div class="expression">${item.expression}</div>
                <div class="result">= ${item.result} (${item.timestamp})</div>
            </div>
        `).join('');
    }
    
    loadFromHistory(historyItem) {
        const expression = historyItem.dataset.expression;
        this.mainInput.value = expression;
        this.mainInput.dispatchEvent(new Event('input'));
        this.mainInput.focus();
    }
    
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    saveHistory() {
        localStorage.setItem('converterHistory', JSON.stringify(this.history));
    }
    
    // Theme functionality
    initializeTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
        this.changeTheme(savedTheme);
    }
    
    toggleThemeMenu() {
        this.themeMenu.classList.toggle('active');
    }
    
    closeThemeMenu() {
        this.themeMenu.classList.remove('active');
    }
    
    changeTheme(themeName) {
        document.documentElement.removeAttribute('data-theme');
        
        if (themeName !== 'dark') {
            document.documentElement.setAttribute('data-theme', themeName);
        }
        
        localStorage.setItem('selectedTheme', themeName);
        this.closeThemeMenu();
        this.updateActiveTheme(themeName);
    }
    
    updateActiveTheme(themeName) {
        this.themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === themeName) {
                option.classList.add('active');
            }
        });
    }
    
    // Settings functionality
    toggleSettingsMenu() {
        this.settingsMenu.classList.toggle('active');
    }
    
    closeSettingsMenu() {
        this.settingsMenu.classList.remove('active');
    }
    
    // Copy functionality
    handleCopyButton(event) {
        const targetId = event.target.closest('.copy-btn').dataset.target;
        const targetElement = document.getElementById(targetId);
        const textToCopy = targetElement.textContent;
        
        this.copyToClipboard(textToCopy);
    }
    
    async copyToClipboard(text) {
        try {
            // Remove spaces from binary numbers for copying
            const cleanText = text.replace(/\s/g, '');
            
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(cleanText);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = cleanText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showNotification();
        } catch (error) {
            console.error('Failed to copy text: ', error);
            this.showNotification('Failed to copy');
        }
    }
    
    showNotification(message = 'Copied to clipboard!') {
        const notificationText = this.notification.querySelector('.notification-text');
        notificationText.textContent = message;
        
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 2000);
    }
}

// Initialize the converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberConverterCalculator();
});

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('clearBtn').click();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('clearHistoryBtn').click();
    }
});