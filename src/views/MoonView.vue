<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCachedMoon, setCachedMoon } from '@/helpers/moonCaching';
import { infoCardParams } from '@/helpers/infoCardParams';
import '../style.css'

interface DataRow {
    property: string
    value: any
}

const loading = ref(false)
const errr = ref("")
const svg = ref("")
const phaseName = ref("")
const moonData = ref<DataRow[]>([])

const processMoonData = (data: Record<string, any>) => {
    // Save phase name and svg data to separate ref
    phaseName.value = data.PhaseName
    svg.value = data.Svg || ""

    //Exclude phase name and svg data from
    const { Svg: _i, PhaseName: _d, ...metrics } = data

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
    <main>
        <h1 class="card-title">Moon phase today</h1>
        <div v-if="errr" class="text-error mb-4">{{ errr }}</div>

        <!--Moon overview card-->
        <v-card v-bind="infoCardParams">
            <v-card-item>
                <v-card-title>Current moon phase</v-card-title>
                <v-card-subtitle v-if="phaseName">{{ phaseName }}</v-card-subtitle>
                <v-card-text>
                    <span v-html="svg"></span>
                </v-card-text>
            </v-card-item>
        </v-card>

        <!--Table card-->
        <v-card v-bind="infoCardParams">
            <v-data-table :items="moonData" :loading="loading" density="comfortable" disable-sort hide-default-header
                hide-default-footer />
        </v-card>
    </main>
</template>

<style lang="css" scoped></style>