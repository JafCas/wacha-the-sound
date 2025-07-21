<script setup lang="ts">
import type { User } from "../../types/auth";
import LoginButton from "../buttons/LoginButton.vue";
import LogoutButton from "../buttons/LogoutButton.vue";

interface Props {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onRetry?: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  login: [];
  logout: [];
  retry: [];
}>();

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin();
  }
  emit("login");
};

const handleLogout = () => {
  if (props.onLogout) {
    props.onLogout();
  }
  emit("logout");
};

const retry = () => {
  if (props.onRetry) {
    props.onRetry();
  }
  emit("retry");
};
</script>

<template>
  <div class="auth-status">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner" />
      <span>Checking authentication...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3>Authentication Error</h3>
        <p>{{ error }}</p>
        <button @click="retry" class="retry-button">Try Again</button>
      </div>
    </div>

    <div v-else-if="isAuthenticated" class="authenticated-state">
      <div class="user-info">
        <div class="user-avatar">
          <span v-if="user?.name">{{ user.name.charAt(0).toUpperCase() }}</span>
          <span v-else>U</span>
        </div>
        <div class="user-details">
          <h3 v-if="user?.name">{{ user.name }}</h3>
          <p v-if="user?.email" class="user-email">{{ user.email }}</p>
          <p v-else class="user-status">Authenticated</p>
        </div>
      </div>
      <slot name="authenticated" :user="user">
        <LogoutButton :isLoading="isLoading" @logout="handleLogout" />
      </slot>
    </div>

    <div v-else class="unauthenticated-state">
      <div class="welcome-content">
        <h3>Welcome!</h3>
        <p>Please sign in to continue</p>
      </div>
      <slot name="unauthenticated">
        <LoginButton :isLoading="isLoading" @login="handleLogin" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.auth-status {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: #666;
}

.error-state {
  text-align: center;
  color: #d32f2f;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.error-content p {
  margin: 0 0 16px 0;
  color: #666;
}

.retry-button {
  padding: 8px 16px;
  border: 1px solid #d32f2f;
  background: white;
  color: #d32f2f;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #d32f2f;
  color: white;
}

.authenticated-state {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.user-email,
.user-status {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.unauthenticated-state {
  text-align: center;
}

.welcome-content {
  margin-bottom: 24px;
}

.welcome-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
}

.welcome-content p {
  margin: 0;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
