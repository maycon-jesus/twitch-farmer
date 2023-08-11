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
    name: 'dashboard-conta-accountId-pontuacao',
    params: {
        accountId: route.params.accountId,
    },
})
</script>