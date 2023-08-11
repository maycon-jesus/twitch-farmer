<template>
    <dashboard-resgates-redemptions-table :channelId="$props.channelId" />
</template>
<script lang="ts" setup>
const props = defineProps<{
    channelId:string
}>()
</script>
