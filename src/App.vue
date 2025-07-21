<script setup lang="ts">
import { type Song } from "./components/cards/Song.vue";
import Search from "./components/bars/Search.vue";
import Users, { type User } from "./views/Users.vue";
import Songs from "./views/Songs.vue";
import AuthStatus from "./components/auth/AuthStatus.vue";
import AuthCallback from "./components/auth/AuthCallback.vue";
import { useAuth } from "./composables/useAuth";
import { authConfig } from "./services/auth";
import HimImage from "./assets/Him.png";
import HerImage from "./assets/Her.png";

// Initialize authentication
const {
  isAuthenticated,
  isLoading,
  error,
  user,
  login,
  logout,
  handleCallback,
  initializeAuth,
} = useAuth(authConfig);

// Check if this is a callback URL
const isCallbackUrl =
  window.location.pathname.includes("/auth/callback") ||
  window.location.search.includes("code=");

// Dummy user data
const users: User[] = [
  {
    name: "Jafet",
    imageUrl: HimImage,
    imageAlt: "Profile picture of Leonel Castillo",
  },
  {
    name: "Melissa",
    imageUrl: HerImage,
    imageAlt: "Profile picture of Jane Doe",
  },
];

// Dummy song data
const songs: Song[] = [
  {
    name: "Bohemian Rhapsody",
    artist: "Queen",
    recomendedBy: "Jafet",
  },
  {
    name: "Imagine",
    artist: "John Lennon",
    recomendedBy: "Melissa",
  },
];

const handleUserPress = (id: number) => {
  console.log(`Button pressed with id: ${id}`);
};

const handleSongPlay = (song: Song) => {
  console.log(`Playing song: ${song.name} by ${song.artist}`);
};

const handleAuthCallback = async () => {
  try {
    await handleCallback();
    // TODO: Redirect to main app after successful authentication
    window.location.href = "/";
  } catch (err) {
    console.error("Authentication callback failed:", err);
  }
};

const handleRetry = () => {
  initializeAuth();
};

const handleGoHome = () => {
  window.location.href = "/";
};
</script>

<template>
  <div class="app">
    <!-- Show callback component if this is a callback URL -->
    <AuthCallback
      v-if="isCallbackUrl"
      :onCallback="handleAuthCallback"
      :onRetry="handleRetry"
      :onGoHome="handleGoHome"
      redirectUrl="/"
    /> 

    <!-- Main app content -->
    <div v-else class="main-content">
      <!-- Authentication Status -->
      <div class="auth-section">
        <AuthStatus
          :isAuthenticated="isAuthenticated"
          :isLoading="isLoading"
          :error="error"
          :user="user"
          :onLogin="login"
          :onLogout="logout"
          :onRetry="handleRetry"
        />
      </div>

      <!-- App content (only shown when authenticated) -->
      <div v-if="isAuthenticated" class="app-content">
        <Search
          placeholder="Search for songs, artists, or albums..."
          :onSearch="(query: string) => console.log(`Searching for: ${query}`)"
          :onClear="() => console.log('Search cleared')"
          :onEnter="(query: string) => console.log(`Enter pressed with query: ${query}`)"
        />

        <Users :users="users" :onUserPress="handleUserPress" />

        <Songs :songs="songs" :onSongPlay="handleSongPlay" />
      </div>

      <!-- Unauthenticated message -->
      <div v-else-if="!isLoading" class="unauthenticated-content">
        <div class="welcome-message">
          <h2>Welcome to Wacha This Sound</h2>
          <p>Discover and share your favorite music with friends.</p>
          <p>Please sign in to start exploring!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- TODO: Refactor styles into separate file -->
<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  min-height: 100vh;
  padding: 20px;
}

.auth-section {
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.app-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.unauthenticated-content {
  max-width: 600px;
  margin: 60px auto;
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  margin: 0 0 16px 0;
  font-size: 28px;
  color: #333;
}

.welcome-message p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.6;
}

/* App content spacing */
.app-content > * {
  margin-bottom: 24px;
}

.app-content > *:last-child {
  margin-bottom: 0;
}

/* Legacy styles */
.logo {
  height: 16em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .app-content {
    padding: 24px 16px;
  }

  .unauthenticated-content {
    margin: 40px auto;
    padding: 32px 24px;
  }

  .welcome-message h2 {
    font-size: 24px;
  }
}
</style>
