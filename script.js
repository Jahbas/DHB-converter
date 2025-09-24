class NumberConverterCalculator {
    constructor() {
        this.mainInput = document.getElementById('mainInput');
        this.inputTypeIndicator = document.getElementById('inputType');
        this.decimalResult = document.getElementById('decimalResult');
        this.hexResult = document.getElementById('hexResult');
        this.binaryResult = document.getElementById('binaryResult');
        this.historyList = document.getElementById('historyList');
        
        this.calcButtons = document.querySelectorAll('.calc-btn');
        this.clearBtn = document.getElementById('clearBtn');
        this.backspaceBtn = document.getElementById('backspaceBtn');
        this.equalsBtn = document.getElementById('equalsBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Theme elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeMenu = document.getElementById('themeMenu');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        this.history = JSON.parse(localStorage.getItem('converterHistory')) || [];
        this.isUpdating = false;
        
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateHistoryDisplay();
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
        
        // History item clicks
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
        
        // Close theme menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                this.closeThemeMenu();
            }
        });
    }
    
    handleMainInput(event) {
        if (this.isUpdating) return;
        
        const value = event.target.value.trim();
        this.updateInputTypeIndicator(value);
        
        if (value === '') {
            this.clearResults();
            return;
        }
        
        // Check if it's a mathematical expression
        if (this.isMathematicalExpression(value)) {
            this.evaluateAndConvert(value);
        } else {
            // Single number conversion
            this.convertNumber(value);
        }
    }
    
    handleKeyDown(event) {
        // Handle Enter key for evaluation
        if (event.key === 'Enter') {
            event.preventDefault();
            this.evaluateExpression();
        }
        
        // Handle Escape key to clear
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
        
        // Set cursor position after the inserted operation
        const newCursorPos = cursorPos + operation.length + (operation === '(' || operation === ')' ? 0 : 2);
        this.mainInput.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    isMathematicalExpression(value) {
        // Check if the value contains mathematical operators
        return /[+\-*/^%()]/.test(value) || /\s+[+\-*/^%]\s+/.test(value);
    }
    
    updateInputTypeIndicator(value) {
        if (value === '') {
            this.inputTypeIndicator.textContent = 'Auto-detect';
            return;
        }
        
        if (this.isMathematicalExpression(value)) {
            this.inputTypeIndicator.textContent = 'Expression';
        } else if (/^[0-9]+$/.test(value)) {
            this.inputTypeIndicator.textContent = 'Decimal';
        } else if (/^[0-9A-Fa-f]+$/.test(value)) {
            this.inputTypeIndicator.textContent = 'Hexadecimal';
        } else if (/^[01]+$/.test(value)) {
            this.inputTypeIndicator.textContent = 'Binary';
        } else {
            this.inputTypeIndicator.textContent = 'Mixed';
        }
    }
    
    convertNumber(value) {
        let decimal;
        
        try {
            if (/^[0-9]+$/.test(value)) {
                // Decimal
                decimal = parseInt(value, 10);
            } else if (/^[0-9A-Fa-f]+$/.test(value)) {
                // Hexadecimal
                decimal = parseInt(value, 16);
            } else if (/^[01]+$/.test(value)) {
                // Binary
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
    
    evaluateAndConvert(expression, saveToHistory = false) {
        try {
            // Replace hex and binary numbers in the expression
            let processedExpression = this.processExpression(expression);
            
            // Evaluate the mathematical expression
            const result = this.safeEval(processedExpression);
            
            if (isNaN(result) || !isFinite(result)) {
                this.showError();
                return;
            }
            
            // Convert to integer if it's a whole number
            const finalResult = Number.isInteger(result) ? Math.floor(result) : result;
            
            this.updateResults(finalResult);
            this.addChangeAnimation();
            
            // Add to history only if explicitly requested
            if (saveToHistory) {
                this.addToHistory(expression, finalResult);
            }
            
        } catch (error) {
            this.showError();
        }
    }
    
    processExpression(expression) {
        // Replace hex numbers (0x prefix or just hex digits)
        expression = expression.replace(/\b0x([0-9A-Fa-f]+)\b/g, (match, hex) => parseInt(hex, 16));
        expression = expression.replace(/\b([0-9A-Fa-f]+)\b/g, (match) => {
            // Check if it's a valid hex number (contains A-F)
            if (/[A-Fa-f]/.test(match)) {
                return parseInt(match, 16);
            }
            return match;
        });
        
        // Replace binary numbers
        expression = expression.replace(/\b([01]+)\b/g, (match) => {
            // Only replace if it's clearly binary (longer than 1 digit or contains multiple 1s)
            if (match.length > 1 || match === '1') {
                return parseInt(match, 2);
            }
            return match;
        });
        
        // Replace ^ with ** for exponentiation
        expression = expression.replace(/\^/g, '**');
        
        return expression;
    }
    
    safeEval(expression) {
        // Simple and safe evaluation for basic math operations
        // This is a basic implementation - in production, you'd want a more robust math parser
        try {
            // Remove any potentially dangerous characters
            const cleanExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
            return Function('"use strict"; return (' + cleanExpression + ')')();
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }
    
    updateResults(decimal) {
        this.isUpdating = true;
        
        this.decimalResult.textContent = decimal.toString();
        this.hexResult.textContent = decimal.toString(16).toUpperCase();
        this.binaryResult.textContent = decimal.toString(2);
        
        this.isUpdating = false;
    }
    
    clearResults() {
        this.decimalResult.textContent = '0';
        this.hexResult.textContent = '0';
        this.binaryResult.textContent = '0';
    }
    
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
            this.evaluateAndConvert(value, true); // Save to history when using = button or Enter
        }
    }
    
    showError() {
        this.decimalResult.textContent = 'Error';
        this.hexResult.textContent = 'Error';
        this.binaryResult.textContent = 'Error';
        
        // Add error styling
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
    
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only the last 50 items
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
        // Remove existing theme classes
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme
        if (themeName !== 'dark') {
            document.documentElement.setAttribute('data-theme', themeName);
        }
        
        // Save theme preference
        localStorage.setItem('selectedTheme', themeName);
        
        // Close theme menu
        this.closeThemeMenu();
        
        // Update active theme indicator
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
}

// Initialize the converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberConverterCalculator();
});

// Add global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('clearBtn').click();
    }
    
    // Ctrl/Cmd + L to clear history
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('clearHistoryBtn').click();
    }
});