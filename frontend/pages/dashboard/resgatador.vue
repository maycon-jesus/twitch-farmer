<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Resgatador Automático" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Aguardando resgate</v-card-title>
                    <v-card-text><v-btn block @click="openModal=true">Adicionar item</v-btn></v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Últimos resgates</v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog max-width="550" v-model="openModal">
            <dashboard-resgatador-modal-add-item @on-close="openModal=false"/>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { useResgatador } from '../../store/resgatador'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useSeoMeta({
    title: 'Resgatador Automático'
})

const resgatador = useResgatador()
const openModal = ref(false)

resgatador.loadChannels()
resgatador.loadAccounts()
</script>