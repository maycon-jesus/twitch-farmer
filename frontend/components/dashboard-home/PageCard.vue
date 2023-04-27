<template>
    <v-card
        class="page-card"
        variant="tonal"
        color="secondary"
        tag="NuxtLink"
        :to="$props.comingSoon ? undefined : $props.to"
    >
        <v-container fluid>
            <v-row>
                <v-col cols="auto">
                    <div class="icon-wrapper bg-secondary">
                        <v-icon :icon="$props.icon" size="24"></v-icon>
                    </div>
                </v-col>
                <v-col cols="">
                    <span class="text-h6" v-if="$props.comingSoon">{{ $props.title }} (EM BREVE)</span>
                    <span class="text-h6" v-else>{{ $props.title }}</span>
                    <p class="text-body-1">{{ $props.description }}</p>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
    icon: any;
    title: string;
    description: string;
    to: RouteLocationRaw;
    comingSoon?: boolean;
}>();
</script>

<style scoped lang="scss">
.page-card {
    // max-width: 250px;
}
.icon-wrapper {
    border-radius: 999rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    // background-color: rgba(0, 0, 0, 0.5);
}
</style>
