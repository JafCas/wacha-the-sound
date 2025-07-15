<script setup lang="ts">
import { ref } from "vue";

type Person = {
  name: string;
  onPress: (id: number) => void;
  imageUrl: string;
  imageAlt: string;
};

const count = ref(0);

const { name, onPress, imageUrl, imageAlt } = defineProps<Person>();
const id = ref(0);

const handlePress = () => {
  onPress(id.value++);
  console.log(`Button pressed by ${name}`);
};
</script>

<template>
  <div class="card">
    <img :src="imageUrl" :alt="imageAlt" class="person-image" />
    <h2>{{ name }}</h2>
    <button type="button" @click="handlePress">Press me</button>
    <p>Pressed {{ count }} times</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.person-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}
</style>
