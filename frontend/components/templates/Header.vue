<template>
    <v-app-bar>
        <v-app-bar-title>Twitch Farmer BOT</v-app-bar-title>

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
import { useUserDataStore } from '~/store/userData';

defineProps<{
    basic?: boolean;
}>();

const userData = useUserDataStore();
</script>

<style lang="scss">
.cursor-pointer {
    cursor: pointer;
}
</style>
