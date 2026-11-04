<script setup lang="ts">
import { ref, watch } from 'vue'

const drawer = ref(true)
const group = ref(null)

watch(group, () => {
  drawer.value = true
})

if (!('geolocation' in navigator)) {
  console.error('Geolocation not supported by this browser')
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    let coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    }
    localStorage.setItem("location", JSON.stringify(coords))
    console.log("Location cached!")
  },
  (err) => {

    console.error("Error:", err)
  }, {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000
}
)

</script>

<template>
  <v-app>
    <v-app-bar title="Weather Front End">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item title="Nav drawer" />
        <v-list-item title="Home" to="/" prepend-icon="mdi-home-flood" />
        <v-list-item title="Weather" to="weather" prepend-icon="mdi-cloud-question" />
        <v-list-item title="Moon" to="moon" prepend-icon="mdi-moon-waning-crescent" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
