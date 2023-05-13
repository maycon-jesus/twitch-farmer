<template>
    <v-row>
        <v-col cols="12">
            <p>Carregando...</p>
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

router.push({
    name: 'dashboard-canal-channelId-loja',
    params: {
        channelId: route.params.channelId,
    },
})
</script>