<template>
    <v-list-item>
        <v-list-item-title>{{ title }}</v-list-item-title>
        <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
        <template #append>
            <v-icon :icon="iconInfo" @click="showDescription = !showDescription"></v-icon>
        </template>
    </v-list-item>
    <v-expand-transition>
        <v-alert v-show="showDescription" :icon="false" class="my-2" type="info">{{ props.description }}</v-alert>
    </v-expand-transition>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconInfo from '~icons/material-symbols/info'

const showDescription = ref(false)

const props = defineProps<{
    title: string
    subtitle: string
    description: string
}>()
</script>