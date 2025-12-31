(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('button');
  let currentInput = '0';
  let lastInput = '';
  let resetNext = false;

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');

      // Clear all
      if (button.id === 'clear') {
        currentInput = '0';
        lastInput = '';
        resetNext = false;
        updateDisplay();
        return;
      }

      // Delete last char
      if (button.id === 'delete') {
        if (resetNext) {
          currentInput = '0';
          resetNext = false;
          updateDisplay();
          return;
        }
        if (currentInput.length === 1) {
          currentInput = '0';
        } else {
          currentInput = currentInput.slice(0, -1);
        }
        lastInput = currentInput.slice(-1);
        updateDisplay();
        return;
      }

      // Evaluate expression
      if (button.id === 'equals') {
        try {
          const result = eval(currentInput);
          currentInput = String(result);
          lastInput = '';
          resetNext = true;
          updateDisplay();
        } catch {
          currentInput = 'Error';
          lastInput = '';
          resetNext = true;
          updateDisplay();
        }
        return;
      }

      // Reset after showing result if new number or dot entered
      if (resetNext) {
        if (!isOperator(value)) {
          currentInput = '';
        }
        resetNext = false;
      }

      // Prevent multiple operators in a row
      if (isOperator(value)) {
        if (currentInput === '' && value !== '-') {
          return;
        }
        if (isOperator(lastInput)) {
          currentInput = currentInput.slice(0, -1) + value;
          lastInput = value;
          updateDisplay();
          return;
        }
      }

      // Prevent multiple decimals in one number
      if (value === '.') {
        const parts = currentInput.split(/[\+\-\*\/]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes('.')) return;
        if (lastNumber === '') currentInput += '0';
      }

      // Replace leading zero unless dot
      if (currentInput === '0' && value !== '.') {
        currentInput = value;
      } else {
        currentInput += value;
      }

      lastInput = value;
      updateDisplay();
    });
  });

  updateDisplay();
})();
