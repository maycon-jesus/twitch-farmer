<template>
    <v-alert type="error" :icon="iconError">{{ $props.message }}</v-alert>
</template>

<script setup lang="ts">
import iconError from '~icons/material-symbols/error';

defineProps<{
    message: string;
}>();
</script>
