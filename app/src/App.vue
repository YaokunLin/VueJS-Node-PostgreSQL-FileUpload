<script setup>
  import TheUpload from './components/TheUpload.vue'
  import Reports from './components/Reports.vue'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
    <Reports :data-updated="dataUpdated"/>
  </header>

  <main>
    
    <TheUpload @upload-success="dataUpdated = true"/>
  </main>
</template>

<script>
export default {
  data() {
    return {
      dataUpdated: false
    };
  }
};
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
