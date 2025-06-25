export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; message?: string }> => {
  return await $fetch("https://localhost:7292/api/manage/login", {
    method: "POST",
    credentials: "include",
    body: {
      Email: email,
      Password: password,
    },
  });
};

export const verifyLoginOtp = async (
  email: string,
  verificationCode: string,
  remember: boolean
): Promise<any> => {
  return await $fetch("https://localhost:7292/api/manage/login/verify", {
    method: "POST",
    credentials: "include",
    body: {
      Email: email,
      VerificationCode: verificationCode,
      RememberMe: remember,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const clearOtp = async (): Promise<void> => {
  await $fetch("https://localhost:7292/api/manage/login/clear-otp", {
    method: "POST",
  });
};

export const resendOtp = async (email: string): Promise<void> => {
  await $fetch("https://localhost:7292/api/manage/login/verify/resend", {
    method: "POST",
    body: { Email: email },
  });
};

export const forgetPassword = async (
  email: string
): Promise<{ success: boolean; message?: string }> => {
  return await $fetch("https://localhost:7292/api/manage/forgetpassword", {
    method: "POST",
    body: {
      email,
    },
  });
};

export const resetPassword = async (
  newPassword: string,
  confirmPassword: string,
  userEmailId: string,
  token: string
): Promise<{ success: boolean; message?: string }> => {
  return await $fetch("https://localhost:7292/api/manage/reset-password", {
    method: "POST",
    body: {
      Password: newPassword,
      ConfirmPassword: confirmPassword,
      Email: userEmailId,
      Token: token,
    },
  });
};

export const validateResetPasswordToken = async (
  token: string
): Promise<{ success: boolean; message?: string }> => {
  return await $fetch(
    "https://localhost:7292/api/manage/validate-reset-token",
    {
      method: "GET",
      query: {
        token,
      },
    }
  );
};
