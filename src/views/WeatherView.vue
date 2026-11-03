<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCachedWeather, setCachedWeather } from '../helpers/weatherCaching'
import { infoCardParams } from '@/helpers/infoCardParams'
import '../style.css'

interface MetricRow {
    property: string
    value: any
}

const loading = ref(false)
const errr = ref('')
const iconLink = ref('')
const description = ref('')
const weatherData = ref<MetricRow[]>([])

const headers = [
    { title: 'Metric', key: 'property', align: 'start' as const },
    { title: 'Value', key: 'value', align: 'end' as const },
]

const processWeatherData = (data: Record<string, any>) => {
    // Extract icon and description to separate refs
    iconLink.value = 'https://openweathermap.org/payload/api/media/file/' + data.Icon + '.png' || ''
    description.value = data.Description || ''

    // Exclude icon and description from the data table rows
    const { Icon: _i, Description: _d, ...metrics } = data

    weatherData.value = Object.entries(metrics).map(([property, value]) => ({
        property,
        value,
    }))
}

const fetchWeather = async (forceRefresh = false) => {
    errr.value = ''

    // 1. Check cached data first unless forced
    if (!forceRefresh) {
        const cached = getCachedWeather<Record<string, any>>()
        if (cached) {
            processWeatherData(cached)
            return
        }
    }

    // 2. Fetch from backend if cache missed or forced
    loading.value = true
    try {
        let coords = localStorage.getItem("location")
        if (coords) {
            const parsedCoords = JSON.parse(coords)
            const url = new URL(import.meta.env.VITE_SERVER_URL + "/currentweather")
            url.searchParams.set("lat", parsedCoords.lat.toString())
            url.searchParams.set("lon", parsedCoords.lon.toString())
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

            const data: Record<string, any> = await res.json()
            processWeatherData(data)
            setCachedWeather(data)
        }
    } catch (error) {
        errr.value = 'Error fetching data: ' + error
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchWeather()
})
</script>

<template>
    <main>
        <h1>A look at your local radar</h1>
        <div v-if="errr" class="text-error mb-4">{{ errr }}</div>

        <!-- Weather Overview Card -->
        <v-card v-bind="infoCardParams">
            <v-card-item>
                <v-card-title>Current Weather</v-card-title>
                <v-card-subtitle v-if="description" class="text-capitalize">
                    {{ description }}
                </v-card-subtitle>
            </v-card-item>
            <v-card-text>
                <v-img v-if="iconLink" :src="iconLink" alt="Weather Condition Icon" width="100" height="100"
                    class="mx-auto" />
            </v-card-text>
        </v-card>

        <!-- Detailed Metrics Table -->
        <v-card v-bind="infoCardParams">
            <v-data-table :headers="headers" :items="weatherData" :loading="loading" hide-default-footer
                density="comfortable" disable-sort hide-default-header />
        </v-card>
        <v-btn :loading="loading" variant="text" size="small" @click="fetchWeather(true)">
            Refresh Now
        </v-btn>
    </main>
</template>

<style lang="css" scoped></style>