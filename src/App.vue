<script setup lang="ts">

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
  <v-responsive class="border rounded" max-height="100dvh">
    <v-app>
      <v-app-bar title="Weather Front End" />

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Nav drawer" />
          <v-list-item title="Home" to="/" prepend-icon="mdi-home-flood" />
          <v-list-item title="Weather" to="weather" prepend-icon="mdi-cloud-question" />
          <v-list-item title="Moon" to="moon" prepend-icon="mdi-moon-waning-crescent" />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped></style>
