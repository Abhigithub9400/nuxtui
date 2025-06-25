export const validateLoginEmail = (email: string): string => {
  const trimmed = email.trim();
  const pattern =
    /^[a-zA-Z0-9][\w.-]*[a-zA-Z0-9]@[a-zA-Z0-9]+[\w.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  if (!trimmed) return "Email is required.";
  if (!pattern.test(trimmed)) return "Enter a valid email address.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required.";
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  return "";
};

export const validateEmailFormat = (emailToValidate: string): string => {
  const email = emailToValidate.trim();
  const emailPattern =
    /^[a-zA-Z0-9][\w.-]*[a-zA-Z0-9]@[a-zA-Z0-9]+[\w.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  const disposableProviders = [
    "yopmail.com",
    "mailinator.com",
    "guerrillamail.com",
    "10minutemail.com",
    "aol.com",
    "example.com",
    "a.com",
    "test.com",
  ];

  if (!email) {
    return "Email field cannot be left blank. Please enter your email.";
  }

  const [localPart, domain] = email.split("@");

  if (!domain || !localPart) {
    return "Please enter a valid email address.";
  }

  if (localPart.length < 6 || localPart.length > 30) {
    return "The username must be between 6 and 30 characters long.";
  }

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  if (disposableProviders.includes(domain.toLowerCase())) {
    return "The email domain is not allowed. Please use a valid provider.";
  }

  return "";
};

export const validateNewPassword = (password: string): string => {
  if (!password) {
    return "Password is required.";
  } else if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  } else if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  } else if (!/\d/.test(password)) {
    return "Password must include at least one digit.";
  } else if (!/[!@#$%^&*(),.?":{}|<>_+\-=\\`~[\]'/;]/.test(password)) {
    return "Password must include at least one special character.";
  }
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) {
    return "Please confirm your password.";
  } else if (confirmPassword !== password) {
    return "Passwords do not match. Please try again.";
  }
  return "";
};
