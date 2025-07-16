<script setup lang="ts">
import { type Song } from "./components/cards/Song.vue";
import Search from "./components/bars/Search.vue";
import Users, { type User } from "./views/Users.vue";
import Songs from "./views/Songs.vue";
import HimImage from "./assets/Him.png";
import HerImage from "./assets/Her.png";

// Dummy user data
const users: User[] = [
  {
    name: "Jafet",
    imageUrl: HimImage,
    imageAlt: "Profile picture of Leonel Castillo"
  },
  {
    name: "Melissa",
    imageUrl: HerImage,
    imageAlt: "Profile picture of Jane Doe"
  }
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
</script>

<template>
  <div>
    <Search
      placeholder="Search for songs, artists, or albums..."
      :onSearch="(query: string) => console.log(`Searching for: ${query}`)"
      :onClear="() => console.log('Search cleared')"
      :onEnter="(query: string) => console.log(`Enter pressed with query: ${query}`)"
    />

    <Users 
      :users="users"
      :onUserPress="handleUserPress"
    />

    <Songs 
      :songs="songs"
      :onSongPlay="handleSongPlay"
    />
  </div>
</template>

<style scoped>
/* Main app container styles */
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

/* App-wide spacing */
div > * {
  margin-bottom: 24px;
}

div > *:last-child {
  margin-bottom: 0;
}
</style>
