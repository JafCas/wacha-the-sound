<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Props {
  onCallback?: (url?: string) => Promise<void>;
  onRetry?: () => void;
  onGoHome?: () => void;
  redirectUrl?: string;
  redirectDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  redirectDelay: 2000,
});

const emit = defineEmits<{
  callback: [url?: string];
  retry: [];
  goHome: [];
  success: [];
  error: [error: string];
}>();

const isLoading = ref(true);
const error = ref<string | null>(null);
const success = ref(false);

const handleCallback = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Get current URL for callback processing
    const currentUrl = window.location.href;
    
    if (props.onCallback) {
      await props.onCallback(currentUrl);
    }
    
    emit('callback', currentUrl);
    
    // Show success state
    success.value = true;
    emit('success');
    
    // Redirect after delay
    if (props.redirectUrl) {
      setTimeout(() => {
        window.location.href = props.redirectUrl!;
      }, props.redirectDelay);
    }
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
    error.value = errorMessage;
    emit('error', errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const retry = () => {
  if (props.onRetry) {
    props.onRetry();
  }
  emit('retry');
  handleCallback();
};

const goHome = () => {
  if (props.onGoHome) {
    props.onGoHome();
  } else {
    window.location.href = '/';
  }
  emit('goHome');
};

// Process callback on mount
onMounted(() => {
  handleCallback();
});
</script>

<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <h2>Processing authentication...</h2>
        <p>Please wait while we complete your login.</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h2>Authentication Failed</h2>
        <p class="error-message">{{ error }}</p>
        <div class="error-actions">
          <button @click="retry" class="retry-button">
            Try Again
          </button>
          <button @click="goHome" class="home-button">
            Go to Home
          </button>
        </div>
      </div>

      <div v-else-if="success" class="success-state">
        <div class="success-icon">✅</div>
        <h2>Login Successful!</h2>
        <p>You have been successfully authenticated.</p>
        <p class="redirect-message">Redirecting you to the application...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-container {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.loading-state,
.error-state,
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon,
.success-icon {
  font-size: 64px;
  margin-bottom: 8px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.error-message {
  color: #d32f2f;
  font-weight: 500;
}

.redirect-message {
  font-size: 14px;
  color: #888;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.retry-button,
.home-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.retry-button {
  background: #667eea;
  color: white;
}

.retry-button:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.home-button {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.home-button:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .callback-container {
    padding: 32px 24px;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .retry-button,
  .home-button {
    width: 100%;
  }
}
</style>
