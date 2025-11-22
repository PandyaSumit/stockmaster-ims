// Password validation
export const validatePassword = (password: string): { valid: boolean; message: string } => {
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

// Login ID validation
export const validateLoginId = (loginId: string): { valid: boolean; message: string } => {
  if (loginId.length < 6 || loginId.length > 12) {
    return { valid: false, message: 'Login ID must be between 6-12 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(loginId)) {
    return { valid: false, message: 'Login ID can only contain letters, numbers, and underscores' };
  }
  return { valid: true, message: 'Login ID is valid' };
};

// Email validation
export const validateEmail = (email: string): { valid: boolean; message: string } => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please provide a valid email address' };
  }
  return { valid: true, message: 'Email is valid' };
};

// OTP validation
export const validateOTP = (otp: string): { valid: boolean; message: string } => {
  if (!/^\d{6}$/.test(otp)) {
    return { valid: false, message: 'OTP must be a 6-digit number' };
  }
  return { valid: true, message: 'OTP is valid' };
};
