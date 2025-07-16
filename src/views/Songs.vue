<template>
  <div class="songs-section">
    <h2 class="section-title">Recommended Songs</h2>
    <div class="song-list">
      <SongCard
        v-for="song in songs"
        :key="`${song.name}-${song.artist}`"
        :song="song"
        :onPlay="onSongPlay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SongCard, { type Song } from '../components/cards/Song.vue';

interface Props {
  songs: Song[];
  onSongPlay?: (song: Song) => void;
}

defineProps<Props>();
</script>

<style scoped>
.songs-section {
  margin-bottom: 32px;
}

.section-title {
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

@media (max-width: 768px) {
  .song-list {
    max-width: 100%;
  }
}
</style>
