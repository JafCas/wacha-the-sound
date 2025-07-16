<template>
  <div class="users-section">
    <h2 class="section-title">Users</h2>
    <div class="person-cards">
      <PersonCard
        v-for="user in users"
        :key="user.name"
        :name="user.name"
        :onPress="onUserPress || (() => {})"
        :imageUrl="user.imageUrl"
        :imageAlt="user.imageAlt"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonCard from '../components/cards/Person.vue';

export interface User {
  name: string;
  imageUrl: string;
  imageAlt: string;
}

interface Props {
  users: User[];
  onUserPress?: (id: number) => void;
}

defineProps<Props>();
</script>

<style scoped>
.users-section {
  margin-bottom: 32px;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
}

.person-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .person-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
