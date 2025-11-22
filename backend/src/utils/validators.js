// Password validation: must contain uppercase, lowercase, special character, and be 8+ chars
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true, message: 'Password is valid' };
};

// Login ID validation: 6-12 characters
const validateLoginId = (loginId) => {
  if (loginId.length < 6 || loginId.length > 12) {
    return { valid: false, message: 'Login ID must be between 6-12 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(loginId)) {
    return { valid: false, message: 'Login ID can only contain letters, numbers, and underscores' };
  }
  return { valid: true, message: 'Login ID is valid' };
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please provide a valid email address' };
  }
  return { valid: true, message: 'Email is valid' };
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  validatePassword,
  validateLoginId,
  validateEmail,
  generateOTP
};
