<template>
    <v-dialog v-model="dialogOpen" max-width="550" persistent>
        <v-card>
            <v-card-title>Confirmar</v-card-title>
            <v-card-text>
                <p class="text-body-1">
                    Você tem certeza que deseja remover o item <strong class="text-primary">{{ $props.itemName }}</strong> da fila?
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="loading" color="text-surface" variant="text" @click="dialogOpen = false"
                >Cancelar
                </v-btn>
                <v-btn :loading="loading" variant="elevated" @click="deleteChannel()">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
    modelValue: boolean
    itemName: string
    itemId: string
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'item-removed'): void
}>()

const $api = useApi()
const { $toast } = useNuxtApp()

const dialogOpen = ref(props.modelValue || false)
const loading = ref(false)
const error = ref<null | string>(null)

const deleteChannel = () => {
    loading.value = true
    $api(`/redemptions-bot/items/${props.itemId}`, {
        method: 'delete',
    })
        .then(() => {
            dialogOpen.value = false
            emits('item-removed')
            $toast.success('Item removido com sucesso!')
        })
        .catch((err) => {
            error.value = err.errors[0].message
        })
        .finally(() => {
            loading.value = false
        })
}

watchEffect(() => {
    emits('update:modelValue', dialogOpen.value)
})
watchEffect(() => {
    dialogOpen.value = props.modelValue
})
</script>