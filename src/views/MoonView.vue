<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getCachedMoon, setCachedMoon } from '@/helpers/moonCaching';
import { infoCardParams } from '@/helpers/infoCardParams';
import '../style.css'

interface DataRow {
    property: string
    value: any
}

interface UpcomingPhase {
    phase: string
    time: string
}

interface ClientResponse {
    PhaseName: string
    PhaseAngle: number
    Age: number
    Distance: number
    Svg: string
    TraditionalName: string
    AppliesTo: string
    NextPhases: UpcomingPhase[]
}

interface CalendarEvent {
    title: string
    start: Date
    end: Date
    color?: string
    allDay?: boolean
}

const loading = ref(false)
const errr = ref("")
const svg = ref("")
const phaseName = ref("")
const rawMoonData = ref<ClientResponse | null>(null)
const moonData = ref<DataRow[]>([])

const mapMoonEvents = (data: ClientResponse | null): CalendarEvent[] => {
    if (!data) return []

    const colors: Record<string, string> = {
        'New Moon': 'red',
        'First Quarter': 'blue',
        'Full Moon': 'yellow',
        'Last Quarter': 'indigo'
    }
    return data.NextPhases.map(item => {
        const d = new Date(item.time)
        return {
            title: item.phase,
            start: d,
            end: d,
            color: colors[item.phase] ?? 'teal',
            allDay: true
        }
    })
}

const calendarEvents = computed(() => mapMoonEvents(rawMoonData.value))

const processMoonData = (data: ClientResponse) => {
    // Save phase name and svg data to separate ref
    rawMoonData.value = data
    phaseName.value = data.PhaseName || ""
    svg.value = data.Svg || ""

    //Exclude phase name and svg data from
    const { Svg: _i, PhaseName: _d, NextPhases: _s, ...metrics } = data

    moonData.value = Object.entries(metrics).map(([property, value]) => ({
        property,
        value
    }))
}

const fetchMoon = async (forceFetch = false) => {
    //Check the cache for moon data
    if (!forceFetch) {
        const cached = getCachedMoon<ClientResponse>()
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

            const data: ClientResponse = await res.json()
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
        <v-calendar :events="calendarEvents"" expanded></v-calendar>
    </main>
</template>

<style lang="css" scoped></style>