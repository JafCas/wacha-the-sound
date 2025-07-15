<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import PersonCard from './components/cards/Person.vue';
import HimImage from './assets/Him.png';
import HerImage from './assets/Her.png';
</script>

<template>
  <div>
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
  <HelloWorld msg="Sube una rola" />
</template>

<style scoped>
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
