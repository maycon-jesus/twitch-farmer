<template>
    <v-dialog v-model="dialogOpen" max-width="500" persistent>
        <v-card>
            <v-card-title class="break">Datlhes do resgate</v-card-title>
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
                            <v-divider></v-divider>
                            <v-list-item title="Status">
                                <v-list-item-subtitle  class="break"><v-chip :text="getStatus().text" :color="getStatus().color"></v-chip></v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item title="Mensagem do erro">
                                <v-list-item-subtitle  class="break">{{$props.item.errorReason||'Motivo do erro não informado'}}</v-list-item-subtitle>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item title="Data">
                                <v-list-item-subtitle  class="break">{{getData()}}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-window-item>
                <v-window-item value="form">
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="(campo,index) in $props.item.inputs" :title="`Campo ${index+1}`" :key="index">
                                <v-list-item-subtitle class="break">{{campo}}</v-list-item-subtitle>
                            </v-list-item>
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
import { ResgatadorCompletedItem, ResgatadorItem } from '../../types/Resgatador'
import { DateTime } from 'luxon'

const props = defineProps<{
    modelValue: boolean
    item?: ResgatadorCompletedItem
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
}>()

const $api = useApi()
const dialogOpen = ref(props.modelValue || false)
const tab = ref("general")

const getStatus = ()=>{
    if(props.item.error) return {
        text: 'Erro',
        color: 'error'
    }
    return {
        text: 'Concluído',
        color: 'success'
    }
}

const getData = ()=>{
    if(!props.item)return '...'
    return DateTime.fromISO(props.item.updatedAt).toFormat('dd/LL/yyyy HH:mm')
}

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