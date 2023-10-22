<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Configurações" />
            </v-col>
        </v-row>
        <v-row>
<!--            <v-col cols="12">-->
<!--                <p class="text-h4">Notificações</p>-->
<!--            </v-col>-->
            <v-col cols="12">
                <dashboard-configuracoes-notifications />
            </v-col>
            <v-col cols="12">
                <v-divider />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})
useSeoMeta({
    title: 'Configurações'
})
</script>