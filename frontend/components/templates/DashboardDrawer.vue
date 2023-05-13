<template>
    <v-navigation-drawer
        :model-value="ui.drawerOpen"
        :permanent="isDesktop as any"
        app
        @update:model-value="ui.setDrawerOpen"
    >
        <v-list nav>
            <v-list-subheader>Geral</v-list-subheader>
            <v-list-item :to="{ name: 'dashboard-contas' }">
                <template #prepend>
                    <v-icon :icon="iconTwitch"></v-icon>
                </template>
                <v-list-item-title>Contas</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'dashboard-canais' }">
                <template #prepend>
                    <v-icon :icon="iconLive"></v-icon>
                </template>
                <v-list-item-title>Canais</v-list-item-title>
            </v-list-item>

            <v-list-subheader>Resgates</v-list-subheader>
            <v-list-item :to="{ name: 'index' }" disabled>
                <template #prepend>
                    <v-icon :icon="iconGift"></v-icon>
                </template>
                <v-list-item-title>Resgates</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'index' }" disabled>
                <template #prepend>
                    <v-icon :icon="iconBot"></v-icon>
                </template>
                <v-list-item-title class="break">Resgatador automático</v-list-item-title>
            </v-list-item>

            <v-list-subheader>Outros</v-list-subheader>
            <v-list-item :to="{ name: 'dashboard-convites' }">
                <template #prepend>
                    <v-icon :icon="iconInvite"></v-icon>
                </template>
                <v-list-item-title>Convidar amigos</v-list-item-title>
            </v-list-item>
            <v-list-item href="https://docs.mayconjesus.dev/twitch-farmer/features/notas-de-lancamento" target="_blank">
                <template #prepend>
                    <v-icon :icon="iconNotes"></v-icon>
                </template>
                <v-list-item-title>Notas de lançamento</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'index' }" disabled>
                <template #prepend>
                    <v-icon :icon="iconTutorial"></v-icon>
                </template>
                <v-list-item-title>Tutoriais</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconInvite from '~icons/mdi/invite' // noinspection TypeScriptCheckImport
import iconTwitch from '~icons/mdi/twitch' // noinspection TypeScriptCheckImport
import iconGift from '~icons/mdi/gift' // noinspection TypeScriptCheckImport
import iconLive from '~icons/solar/play-stream-bold' // noinspection TypeScriptCheckImport
import iconBot from '~icons/fluent/bot-20-filled' // noinspection TypeScriptCheckImport
import iconNotes from '~icons/mdi/feature-highlight' // noinspection TypeScriptCheckImport
import iconTutorial from '~icons/material-symbols/school'
import { useUi } from '~/store/ui'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const ui = useUi()
const display = useDisplay()
const isDesktop = ref(false)

watchEffect(() => {
    if (display.mdAndUp.value) {
        ui.setDrawerOpen(true)
        isDesktop.value = true
    } else {
        ui.setDrawerOpen(false)
        isDesktop.value = false
    }
})
</script>

<style lang="scss" scoped>
.break {
    white-space: normal;
}
</style>