<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Resgates" />
            </v-col>
        </v-row>
        <dashboard-resgates-redemptions-table/>
    </v-container>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useSeoMeta({
    title: 'Resgates'
})

</script>