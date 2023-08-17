<template>
    <v-dialog v-model="dialogOpen" max-width="500" persistent>
        <v-card>
            <v-card-title class="break">Datlhes do item a ser resgatado</v-card-title>
            <div v-if="$props.item">
                <v-tabs v-model="tab">
                    <v-tab value="general">Geral</v-tab>
                    <v-tab value="form" v-if="$props.item.inputs.length>0">Formulário</v-tab>
                </v-tabs>
            </div>
            <v-window v-model="tab" :style="{overflow: 'initial'}" v-if="$props.item">
                <v-window-item value="general">
                    <v-card-text>
                        <v-list>
                            <v-list-item title="Item">
                                <v-list-item-subtitle  class="break">{{$props.item.item.name}}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item title="Valor" :subtitle="$props.item.item.cost"></v-list-item>
                            <v-list-item title="Conta">
                                <v-chip :prepend-avatar="$props.item.account.profileImageUrl" :text="$props.item.account.displayName" :to="{
                                    name: 'dashboard-conta-accountId',
                                    params: {
                                        accountId: $props.item.accountId
                                    }
                                }"></v-chip>
                            </v-list-item>
                            <v-list-item title="Posição na fila">
                                <v-chip :prepend-icon="iconQueue" :text="`${$props.item.queuePosition}`"></v-chip>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-window-item>
                <v-window-item value="form">
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="(campo,index) in $props.item.inputs" :title="`Campo ${index+1}`" :key="index" :subtitle="campo"></v-list-item>
                        </v-list>
                    </v-card-text>
                </v-window-item>
            </v-window>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialogOpen = false"
                >Fechar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import iconQueue from '~icons/fluent/people-queue-20-filled'
import { ref } from 'vue'
import { ResgatadorItem } from '../../types/Resgatador'

const props = defineProps<{
    modelValue: boolean
    item?: ResgatadorItem
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
}>()

const $api = useApi()
const dialogOpen = ref(props.modelValue || false)
const tab = ref("general")

watchEffect(() => {
    emits('update:modelValue', dialogOpen.value)
})
watchEffect(() => {
    dialogOpen.value = props.modelValue
})
</script>

<style scoped>
.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}
</style>