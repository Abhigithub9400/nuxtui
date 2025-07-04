<script setup type="ts">
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import { validateEmailFormat } from "~/utils/validators";
import { forgetPassword } from "~/services/loginService";

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  submitButtonText: { type: String, default: 'Submit Now' }
})

const emit = defineEmits(['close'])

const email = ref('')
const invalidEmail = ref(false)
const emailErrorMessage = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isValid = computed(() => email.value.trim() && !invalidEmail.value)

watch(() => props.isVisible, () => {
  document.querySelector('html').style.overflow = props.isVisible ? 'hidden' : ''
})

watch(email, (newVal) => {
  if (newVal.trim()) invalidEmail.value = false
})

const validateEmail = () => {
  const error = validateEmailFormat(email.value);
  emailErrorMessage.value = error;
  invalidEmail.value = !!error;
};


const handleClose = () => {
  email.value = ''
  invalidEmail.value = false
  emailErrorMessage.value = ''
  isLoading.value = false
  isSuccess.value = false
  isError.value = false
  emit('close')
}

const submitForm = async () => {
  validateEmail();
  if (!isValid.value) return;

  isLoading.value = true;
  isError.value = false;
  isSuccess.value = false;

  try {
    const response = await forgetPassword(email.value);

    if (response.success) {
      isSuccess.value = true;
      successMessage.value = 'Password reset link sent successfully.';
      email.value = '';
    } else {
      isError.value = true;
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } catch (error) {
      isError.value = true;
      errorMessage.value = 'Error processing request';
  } finally {
      isLoading.value = false;
  }
};
</script>

<template>
  <div class="modal" v-if="isVisible">
    <div
      class="modal-content"
      :style="isSuccess || isError ? { height: '280px', top: '175px' } : {}"
    >
      <span
        class="close"
        role="button"
        tabindex="0"
        @click="handleClose"
        @keydown.enter.prevent="handleClose"
        @keydown.space.prevent="handleClose"
        :class="{ disabled: isLoading }"
        :style="{ pointerEvents: isLoading ? 'none' : 'auto' }"
      >
        &times;
      </span>

      <div v-if="!isSuccess && !isError">
        <h2 class="heading">{{ title }}</h2>
        <form @submit.prevent="submitForm">
          <p class="content">{{ description }}</p>

          <!-- Email Input -->
          <div class="input-group mb-8">
            <div>
              <label for="email" class="input-group label"
                >Email<span class="required">*</span></label
              >
            </div>
            <input
              v-model="email"
              type="text"
              id="email"
              class="input-group input"
              :class="{ error: invalidEmail }"
              @blur="validateEmail"
              required
            />
            <div class="error-message">
              {{ invalidEmail ? emailErrorMessage : "" }}
            </div>
          </div>

          <button
            type="submit"
            class="submit-button"
            :disabled="!isValid || isLoading"
          >
            <span v-if="isLoading">
              <i class="pi pi-spinner pi-spin"></i> Loading...
            </span>
            <span v-else>{{ submitButtonText }}</span>
          </button>
        </form>
      </div>

      <div v-if="isSuccess">
        <div class="mail-sussess">
          <img
            class="mail-sent"
            src="@/assets/icons/email-icon.svg"
            alt="Mail Sent"
          />
          <p class="success-message">{{ successMessage }}</p>
        </div>
      </div>

      <div v-if="isError">
        <div class="mail-sussess">
          <img
            class="mail-sent"
            src="@/assets/icons/error-icon.svg"
            alt="Error"
          />
          <p class="success-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/components/modals/forgetpassword.css";
</style>
