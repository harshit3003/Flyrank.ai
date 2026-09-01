document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settingsForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('form-success');

  const inputs = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password')
  };

  const errors = {
    username: document.getElementById('username-error'),
    email: document.getElementById('email-error'),
    password: document.getElementById('password-error')
  };

  // Attach real-time validation to inputs
  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
      validateField(key);
      updateSubmitButtonState();
    });
    
    inputs[key].addEventListener('blur', () => {
      validateField(key);
      updateSubmitButtonState();
    });
  });

  function validateField(key) {
    const value = inputs[key].value;
    let errorMsg = '';

    switch(key) {
      case 'username':
        errorMsg = window.validateUsername(value);
        break;
      case 'email':
        errorMsg = window.validateEmail(value);
        break;
      case 'password':
        errorMsg = window.validatePassword(value);
        break;
    }

    const hasError = errorMsg !== '';
    
    // Update ARIA roles and styling
    inputs[key].setAttribute('aria-invalid', hasError.toString());
    errors[key].textContent = errorMsg;
    
    return !hasError;
  }

  function validateAll() {
    let isValid = true;
    Object.keys(inputs).forEach(key => {
      if (!validateField(key)) {
        isValid = false;
      }
    });
    return isValid;
  }

  function updateSubmitButtonState() {
    // We only disable if there's a visible error
    const hasVisibleErrors = Object.keys(inputs).some(key => {
      return inputs[key].getAttribute('aria-invalid') === 'true';
    });
    
    if (hasVisibleErrors) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-disabled', 'true');
    } else {
      submitBtn.disabled = false;
      submitBtn.setAttribute('aria-disabled', 'false');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    if (!validateAll()) {
      updateSubmitButtonState();
      return;
    }

    // Prevent double submission
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.setAttribute('aria-disabled', 'true');
    successMsg.classList.add('hidden');

    // Simulate network request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success
      successMsg.classList.remove('hidden');
      
      // Clear password field
      inputs.password.value = '';
      
    } catch (error) {
      console.error('Submission failed', error);
      // Handle error state if needed
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.setAttribute('aria-disabled', 'false');
    }
  });
});
