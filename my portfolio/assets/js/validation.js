export const validateField = (inputElement) => {
    let isValid = true;
    let errorMessage = '';

    if (inputElement.validity.valueMissing) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (inputElement.type === 'email' && inputElement.validity.typeMismatch) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    }

    return { isValid, errorMessage };
};