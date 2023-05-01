<template>
    <v-dialog v-model='dialogOpen' max-width='500' persistent>
        <v-card>
            <v-card-title>Confirmar</v-card-title>
            <v-card-text>
                <p class='text-body-1'>Você tem certeza que deseja excluir a conta <strong
                    class='text-primary'>{{ $props.accountName }}</strong>?</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled='loading' color='text-surface' variant='text' @click='dialogOpen=false'>Cancelar
                </v-btn>
                <v-btn :loading='loading' variant='elevated' @click='deleteAccount()'>Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang='ts' setup>
import { ref } from 'vue';

const props = defineProps<{
    modelValue: boolean,
    accountName: string,
    accountId: string
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'account-deleted'): void
}>();

const $api = useApi();
const dialogOpen = ref(props.modelValue || false);
const loading = ref(false);
const error = ref<null | string>(null);

const deleteAccount = () => {
    loading.value = true;
    $api(`/twitch-accounts/${props.accountId}`, {
        method: 'delete'
    })
        .then(() => {
            dialogOpen.value = false;
            emits('account-deleted');
        })
        .catch(err => {
            error.value = err.errors[0].message;
        })
        .finally(() => {
            loading.value = false;
        });
};

watchEffect(() => {
    emits('update:modelValue', dialogOpen.value);
});
watchEffect(() => {
    dialogOpen.value = props.modelValue;
});
</script>