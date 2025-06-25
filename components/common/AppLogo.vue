<script setup type="ts">
import { useRouter, useRoute } from 'vue-router';
import {defineProps, onMounted} from 'vue';

const props = defineProps({
  fromDashboard : {
    type: Boolean,
    default: false,
  }
})

const router = useRouter();
const route = useRoute();

let branding;

onMounted(() => {
  branding = document.querySelector("#branding");
  if (route.path === '/dashboard' && branding) {
    branding.style.color = 'white';
  }
});

const goHome = () => {
  if (props.fromDashboard ) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div class="website logo" @click="goHome">
    <img
      src="@/assets/logos/medi-assist-logo.svg"
      alt="MediAssist"
      class="icon"
    />
    <h4 class="h4-bold" id="branding">MediNotex</h4>
  </div>
</template>

<style scoped>
@import "~/assets/css/components/common/applogo.css";
</style>
