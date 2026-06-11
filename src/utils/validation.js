// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 number, 1 special char)
export const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain number' };
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return { valid: false, message: 'Password must contain special character (!@#$%^&*)' };
    }
    return { valid: true };
};

// Name validation
export const validateName = (name) => {
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.trim().length > 50) {
        return { valid: false, message: 'Name cannot exceed 50 characters' };
    }
    return { valid: true };
};

// Company name validation
export const validateCompanyName = (name) => {
    if (name.trim().length < 3) {
        return { valid: false, message: 'Company name must be at least 3 characters' };
    }
    if (name.trim().length > 100) {
        return { valid: false, message: 'Company name cannot exceed 100 characters' };
    }
    return { valid: true };
};