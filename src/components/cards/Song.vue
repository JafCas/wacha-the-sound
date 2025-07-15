<template>
  <div class="song-card">
    <div class="song-info">
      <h3 class="song-name">{{ song.name }}</h3>
      <p class="song-artist">{{ song.artist }}</p>
      <p class="recommended-by">Recommended by: {{ song.recomendedBy }}</p>
    </div>
    <div class="song-actions">
      <button class="play-button" @click="onPlay?.(song)">
        ▶️ Play
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Song {
  name: string;
  artist: string;
  recomendedBy: string;
}

interface Props {
  song: Song;
  onPlay?: (song: Song) => void;
}

defineProps<Props>();
</script>

<style scoped>
.song-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 8px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 80px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.song-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.song-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.3;
}

.song-artist {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 400;
}

.recommended-by {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-style: italic;
}

.song-actions {
  display: flex;
  align-items: center;
}

.play-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.play-button:active {
  transform: scale(0.98);
}
</style>
