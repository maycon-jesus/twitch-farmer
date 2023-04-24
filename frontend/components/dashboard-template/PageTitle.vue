<template>
    <h1 class="text-h2 text-center py-10">{{ $props.title }}</h1>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
