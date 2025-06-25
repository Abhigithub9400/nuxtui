<script setup type="ts">
import { ref, computed, nextTick, defineProps } from "vue";
import emailIcon from "@/assets/icons/email-icon.svg";
import circleTick from "@/assets/icons/circle-tick.svg";
import { verifyLoginOtp, clearOtp, resendOtp } from '~/services/loginService';
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  remember: {
    type: Boolean,
    required: true,
  },
});
const isReadyToVerify = ref(false);
const isVerified = ref(false);
const showToast = ref(false);
const isDisabled = ref(false);
const codeInputs = ref(["", "", "", ""]);
const isLoading = ref(false);
const fullCode = computed(() => codeInputs.value.join(""));
const userData = ref();
const handleInput = async (e) => {
  const input = e.target;
  const idx = parseInt(input.dataset.idx);
  const numeric = input.value.replace(/\D/g, ""); // Allow only digits

  codeInputs.value[idx] = numeric;

  // Move to next input only if a digit was entered and not at last index
  if (numeric && idx < codeInputs.value.length - 1) {
    nextTick(() => {
      const nextInput = document.querySelector(`input[data-idx="${idx + 1}"]`);
      if (nextInput && typeof nextInput.focus === "function") {
        nextInput.focus();
      }
    });
  }
};

const verifyMail = async () => {
  if (isVerified.value) {
    isLoading.value = true;
    localStorage.setItem("authToken", userData.value.authToken);
    sessionStorage.removeItem("logoutState");
    window.onpopstate = null;

    const expirationDate = new Date(userData.value.expirationTime).toUTCString();
    document.cookie = `userId=${userData.value.userId}; path=/; Secure; SameSite=Strict; expires=${expirationDate}`;
    document.cookie = `firstName=${userData.value.firstName}; path=/; Secure; SameSite=Strict; expires=${expirationDate}`;
    document.cookie = `specialization=${userData.value.specialization}; path=/; Secure; SameSite=Strict; expires=${expirationDate}`;
    document.cookie = `title=${userData.value.title}; path=/; Secure; SameSite=Strict; expires=${expirationDate}`;
    document.cookie = `email=${props.email}; path=/; Secure; SameSite=Strict; expires=${expirationDate}`;
    localStorage.setItem("image", userData.value.image);

    await router.push(userData.value.redirectUrl);

    if (!userData.value.isSettingsUpdated) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("update-settings", {
            detail: {
              success: true,
              message: "Complete your settings page to access all features and benefits",
            },
          })
        );
      }, 100);
    }

    isLoading.value = false;
    return;
  }

  if (isReadyToVerify.value) {
    try {
      isLoading.value = true;

      const data = await verifyLoginOtp(props.email, fullCode.value, props.remember);

      if (data.success) {
        userData.value = data;
        isVerified.value = true;
      } else {
        showToast.value = true;
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
      }
    } catch {
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } finally {
      isLoading.value = false;
    }

    return;
  }

  isReadyToVerify.value = true;
};

const goBack = async () => {
  try {
    await clearOtp();
  } catch {
    console.log('OTP clear failed');
  }
  window.location.reload();
};

const resendMail = async () => {
  if (isDisabled.value) return;

  try {
    isDisabled.value = true;
    await resendOtp(props.email);
    setTimeout(() => {
      isDisabled.value = false;
    }, 30000);
  } catch {
    isDisabled.value = false;
  }
};

const reset = () => {
  isLoading.value = false;
  showToast.value = false;
};
</script>

<template>
  <div v-if="true" class="verify-card">
    <img
      :src="isVerified ? circleTick : emailIcon"
      :alt="isVerified ? 'Success Icon' : 'Email Icon'"
      class="email-icon"
    />

    <h2>{{ isVerified ? "Login successful" : "Check your Email" }}</h2>
    <p v-if="isVerified" class="subtext">
      Please click the button below to continue to the interface
    </p>
    <p v-else class="subtext">
      We sent verification code to
      <span class="email">{{ props.email }}</span>
    </p>

    <div v-if="isReadyToVerify && !isVerified" class="code-inputs">
      <input
        v-for="(val, idx) in codeInputs"
        :key="idx"
        v-model="codeInputs[idx]"
        :data-idx="idx"
        maxlength="1"
        inputmode="numeric"
        pattern="\d*"
        @input="handleInput"
        type="text"
      />
    </div>

    <button
      :disabled="isLoading || (isReadyToVerify && fullCode.length < 4)"
      class="verify-btn"
      @click="verifyMail"
    >
      <span v-if="isLoading">
        <i class="pi pi-spinner pi-spin"></i> Loading...
      </span>
      <span v-else>{{
        isVerified
          ? "Continue"
          : isReadyToVerify
          ? "Verify OTP"
          : "Enter code manually"
      }}</span>
    </button>

    <p v-if="!isVerified" class="resend-text">
      Didn’t receive the email?
      <a
        @click="resendMail"
        :class="{ disabled: isDisabled }"
        :title="isDisabled ? 'Please wait 30 seconds before resending' : ''"
        >Click to resend</a
      >
    </p>

    <div v-if="!isVerified" class="back-login" @click="goBack">
      <span class="arrow">&#8592;</span>
      <span>Back to Login</span>
    </div>

    <!-- Toast inside -->
    <div class="toast" v-if="showToast">
      <div class="profile-update errorUpdate">
        <img
          class="bold-essentional-ui-error"
          alt="error icon"
          src="../assets/icons/close-circle.svg"
        />
        <div class="profile-updated-successfully">
          Oops! The code you entered is incorrect or expired. Please check your
          email and try again.
        </div>
        <button class="image-delete-icon" @click="reset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
          >
            <path
              d="M1 9.75L10 1.25M1 1.25L10 9.75"
              stroke="#7C7C7C"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/components/login/email-verification.css";
</style>
