<template>
    <v-app-bar>
        <template #prepend>
            <v-app-bar-nav-icon class="mr-2" :icon="menuIcon" @click="ui.toggleDrawerOpen()" />
            <v-app-bar-title class="mr-2">Twitch Farmer BOT</v-app-bar-title>
        </template>

        <v-menu>
            <template #activator="{ props }">
                <div class="pa-2 mr-2 rounded cursor-pointer" v-bind="props" v-ripple>
                    <span>{{ userData.userData?.firstName }}</span>
                </div>
            </template>

            <v-list> aa </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script setup lang="ts">
import menuIcon from '~icons/material-symbols/menu';
import { useUi } from '~/store/ui';
import { useUserDataStore } from '~/store/userData';

defineProps<{
    basic?: boolean;
}>();

const userData = useUserDataStore();
const ui = useUi();
</script>

<style lang="scss">
.cursor-pointer {
    cursor: pointer;
}
</style>
