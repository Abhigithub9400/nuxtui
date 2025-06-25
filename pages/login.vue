<script setup lang="ts">
const layout = "default";

import { ref, computed, onMounted, onUnmounted } from "vue";
import { validateLoginEmail, validatePassword } from "~/utils/validators";
import { login } from "~/services/loginService";
import EmailVerification from "@/components/login/EmailVerification.vue";
import ForgetPassword from "~/components/modals/ForgetPassword.vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const passwordVisible = ref(false);
const isPasswordInputActive = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const showForgotPasswordModal = ref(false);
const isLoading = ref(false);
const isReadyToVerify = ref(false);

// Error tracking
const errors = ref<{ email: string; password: string }>({
  email: "",
  password: "",
});
const interacted = ref<{ email: boolean; password: boolean }>({
  email: false,
  password: false,
});

// Field interaction
const interactWithField = (field: "email" | "password") => {
  interacted.value[field] = true;
};

// Handle mount/unmount
onMounted(() => {
  successMessage.value = sessionStorage.getItem("successMessage") || "";
  sessionStorage.removeItem("successMessage");

  errorMessage.value = sessionStorage.getItem("errorMessage") || "";
  sessionStorage.removeItem("errorMessage");

  document.addEventListener("click", clearMessage);
});

onUnmounted(() => {
  document.removeEventListener("click", clearMessage);
});

// Clear temporary messages
const clearMessage = () => {
  successMessage.value = "";
  sessionStorage.removeItem("successMessage");
  errorMessage.value = "";
};

// Input helpers
const trimEmail = () => {
  email.value = email.value.trim();
};

const handlePaste = () => {
  setTimeout(() => {
    email.value = email.value.trim();
  }, 0);
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const checkPasswordInput = () => {
  isPasswordInputActive.value = password.value.trim().length > 0;
};

// Validation
const validateField = (field: "email" | "password") => {
  if (!interacted.value[field]) return;

  if (field === "email") {
    errors.value.email = validateLoginEmail(email.value);
  }

  if (field === "password") {
    errors.value.password = validatePassword(password.value);
  }
};

const isFormValid = computed(() => {
  return (
    email.value.trim() !== "" &&
    password.value !== "" &&
    errors.value.email === "" &&
    errors.value.password === ""
  );
});

const handleLogin = async () => {
  validateField("email");
  validateField("password");

  if (errors.value.email || errors.value.password) return;

  isLoading.value = true;
  try {
    const data = await login(email.value, password.value);

    if (data.success) {
      isReadyToVerify.value = true;
    } else {
      errorMessage.value = data.message || "Login failed";
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || "An error occurred. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <NuxtLayout :name="layout">
    <EmailVerification
      :email="email"
      :remember="rememberMe"
      v-if="isReadyToVerify"
    />
    <div class="form-content" v-else>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <h2 class="form-heading">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="text"
            id="email"
            @input="trimEmail"
            @paste="handlePaste"
            @focus="interactWithField('email')"
            @blur="validateField('email')"
            required
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              @focus="interactWithField('password')"
              @blur="validateField('password')"
              @input="checkPasswordInput"
              required
            />
            <button
              v-if="isPasswordInputActive"
              type="button"
              @click="togglePasswordVisibility"
            >
              <i :class="passwordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error">{{
            errors.password
          }}</span>
        </div>

        <div class="options">
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              v-model="rememberMe"
              @keydown.enter.prevent="rememberMe = !rememberMe"
            />
            <label for="rememberMe">Remember me</label>
          </div>

          <a
            href="#"
            class="forgot-password"
            @click.prevent="showForgotPasswordModal = true"
            >Forgot Password?</a
          >
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading">
            <i class="pi pi-spinner pi-spin"></i> Loading...
          </span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </NuxtLayout>
  <ForgetPassword
    :is-visible="showForgotPasswordModal"
    title="Forgot Password"
    description="Enter your registered email address to receive a password reset link"
    submitButtonText="Submit"
    modal-type="forgot-password"
    @close="showForgotPasswordModal = false"
  />
</template>

<style scoped>
@import "~/assets/css/pages/login.css";
</style>
