<template>
  <button
    @click="handleLogin"
    :disabled="isLoading"
    :class="[
      'auth-button',
      'login-button',
      { loading: isLoading },
      buttonClass,
    ]"
  >
    <span v-if="isLoading" class="spinner"></span>
    <span v-else class="button-text">
      <slot>{{ loginText }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean;
  loginText?: string;
  buttonClass?: string;
  onLogin?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  loginText: "Login",
  buttonClass: "",
});

const emit = defineEmits<{
  login: [];
}>();

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin();
  }
  emit("login");
};
</script>

<style scoped>
.auth-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  min-width: 120px;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-text {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
