<template>
    <dashboard-resgates-redemptions-table :accountId="$props.accountId" />
</template>
<script lang="ts" setup>
const props = defineProps<{
    accountId:string
}>()
</script>
