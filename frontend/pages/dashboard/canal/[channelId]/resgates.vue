<template>
    <dashboard-resgates-redemptions-table :channelId="$props.channelId" />
</template>
<script lang="ts" setup>
import { useTwitchChannel } from '../../../../store/twitch-channel'

const props = defineProps<{
    channelId:string
}>()
</script>
