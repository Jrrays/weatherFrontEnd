<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCachedMoon, setCachedMoon } from '@/helpers/moonCaching';

interface DataRow {
    property: string
    value: any
}

const loading = ref(false)
const errr = ref("")
const svg = ref("")
const moonData = ref<DataRow[]>([])

const processMoonData = (data: Record<string, any>) => {
    // Save svg data to separate ref
    svg.value = data.Svg || ""

    //Exclude svg data
    const { Svg: _i, ...metrics } = data

    moonData.value = Object.entries(metrics).map(([property, value]) => ({
        property,
        value
    }))
}

const fetchMoon = async (forceFetch = false) => {
    //Check the cache for moon data
    if (!forceFetch) {
        const cached = getCachedMoon<Record<string, any>>()
        if (cached) {
            processMoonData(cached)
            return
        }
    }

    //Fetch the data if cache is empty
    loading.value = true
    try {
        let coords = localStorage.getItem("location")
        if (coords) {
            const parsedCoords = JSON.parse(coords)
            const url = new URL(import.meta.env.VITE_SERVER_URL + "/moonphase")
            url.searchParams.set("lat", parsedCoords.lat.toString())
            url.searchParams.set("lon", parsedCoords.lon.toString())
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)

            const data: Record<string, any> = await res.json()
            processMoonData(data)
            setCachedMoon(data)
        }
    } catch (error) {
        errr.value = 'Error fetching moon data: ' + error
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMoon()
})

</script>

<template>
    <h1>Moon view</h1>
</template>

<style lang="css" scoped></style>