<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import PersonCard from './components/cards/Person.vue';
import SongCard, { type Song } from './components/cards/Song.vue';
import HimImage from './assets/Him.png';
import HerImage from './assets/Her.png';

// Dummy song data
const songs: Song[] = [
  {
    name: "Bohemian Rhapsody",
    artist: "Queen",
    recomendedBy: "Jafet"
  },
  {
    name: "Imagine",
    artist: "John Lennon",
    recomendedBy: "Melissa"
  }
];

const handleSongPlay = (song: Song) => {
  console.log(`Playing song: ${song.name} by ${song.artist}`);
};
</script>

<template>
  <div>
    <div class="person-cards">
      <PersonCard
        name="Jafet"
        :onPress="id => console.log(`Button pressed with id: ${id}`)"
        :imageUrl="HimImage"
        imageAlt="Profile picture of Leonel Castillo"
      />
      <PersonCard
        name="Melissa"
        :onPress="id => console.log(`Button pressed with id: ${id}`)"
        :imageUrl="HerImage"
        imageAlt="Profile picture of Jane Doe"
      />
    </div>
    
    <div class="songs-section">
      <h2>Recommended Songs</h2>
      <div class="song-list">
        <SongCard
          v-for="song in songs" 
          :key="`${song.name}-${song.artist}`"
          :song="song"
          :onPlay="handleSongPlay"
        />
      </div>
    </div>
  </div>
  <HelloWorld msg="Sube una rola" />
</template>

<style scoped>
.person-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.songs-section {
  margin-bottom: 32px;
}

.songs-section h2 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 600px;
}

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
</style>
