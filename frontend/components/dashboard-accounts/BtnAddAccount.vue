<template>
    <v-btn :loading='loading' @click='createLink()'>Adicionar conta</v-btn>
</template>

<script lang='ts' setup>
import { ref } from 'vue';

const $api = useApi();
const loading = ref(false);

const createLink = () => {
    loading.value = true;
    $api<{
        url: string
    }>('/twitch-accounts/add-account-link')
        .then(r => {
            window.open(r.url, '_blank');
        })
        .catch(err => {
            window.alert(err.errors[0].message);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>