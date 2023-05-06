<template>
    <v-app-bar>
        <template #prepend>
            <v-app-bar-nav-icon v-if="!hideMenu" :icon="menuIcon" class="mr-2" @click="ui.toggleDrawerOpen()" />
            <v-app-bar-title class="mr-2">Twitch Farmer BOT</v-app-bar-title>
        </template>

        <v-menu>
            <template #activator="{ props }">
                <div v-ripple class="pa-2 mr-2 rounded cursor-pointer" v-bind="props">
                    <span>{{ userData.userData?.firstName }}</span>
                </div>
            </template>

            <v-list>
                <v-list-item>
                    <v-btn block variant="outlined" @click="logoff">Sair</v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import menuIcon from '~icons/material-symbols/menu'
import { useUi } from '~/store/ui'
import { useUserDataStore } from '~/store/userData'

defineProps<{
    basic?: boolean
    hideMenu?: boolean
}>()

const userData = useUserDataStore()
const ui = useUi()
const router = useRouter()

const logoff = () => {
    userData.reset()
    router.push({ name: 'index' })
}
</script>

<style lang="scss">
.cursor-pointer {
    cursor: pointer;
}
</style>