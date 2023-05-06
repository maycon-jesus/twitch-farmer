<template>
    <v-alert :icon="iconError" type="error">{{ $props.message }}</v-alert>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconError from '~icons/material-symbols/error'

defineProps<{
    message: string
}>()
</script>