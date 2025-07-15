<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-icon">
        🔍
      </div>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @input="handleSearch"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="handleEnter"
      />
      <button
        v-if="searchQuery"
        class="clear-button"
        @click="clearSearch"
        type="button"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  placeholder?: string;
  debounceTime?: number;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onEnter?: (query: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search for songs, artists, or albums...',
  debounceTime: 300
});

const searchQuery = ref('');
const isFocused = ref(false);
let debounceTimeout: number | null = null;

const handleSearch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  debounceTimeout = setTimeout(() => {
    props.onSearch?.(searchQuery.value);
  }, props.debounceTime);
};

const clearSearch = () => {
  searchQuery.value = '';
  props.onClear?.();
};

const handleEnter = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  props.onEnter?.(searchQuery.value);
};

// Watch for external changes to clear the search
watch(() => searchQuery.value, (newValue) => {
  if (newValue === '') {
    props.onClear?.();
  }
});

// Expose the search query for parent components
defineExpose({
  searchQuery,
  clearSearch
});
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-bar:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.search-bar:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.search-icon {
  font-size: 1.1rem;
  color: #6b7280;
  margin-right: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #374151;
  background: transparent;
  padding: 8px 0;
}

.search-input::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.clear-button {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.clear-button:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.1);
}

.clear-button:active {
  transform: scale(0.95);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .search-bar {
    background: #1f2937;
    border-color: #374151;
  }
  
  .search-bar:hover {
    border-color: #4b5563;
  }
  
  .search-bar:focus-within {
    border-color: #667eea;
  }
  
  .search-input {
    color: #f9fafb;
  }
  
  .search-input::placeholder {
    color: #6b7280;
  }
  
  .search-icon {
    color: #9ca3af;
  }
  
  .clear-button {
    background: #374151;
    color: #9ca3af;
  }
  
  .clear-button:hover {
    background: #4b5563;
    color: #f9fafb;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
    padding: 0 16px;
  }
  
  .search-bar {
    padding: 10px 16px;
  }
  
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Animation for focus state */
.search-bar {
  animation: none;
}

.search-bar:focus-within {
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
