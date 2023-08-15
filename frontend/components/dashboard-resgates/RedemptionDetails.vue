<template>
    <v-card>
        <v-card-title>Detalhes do resgate</v-card-title>
        <div>
            <v-tabs v-model="tab" v-if="item.inputs.length > 0" :next-icon="rightIcon" :prev-icon="leftIcon" show-arrows>
                <v-tab value="general">Geral</v-tab>
                <v-tab value="form">Formulário</v-tab>
            </v-tabs>
        </div>
        <v-window v-model="tab" :style="{overflow: 'initial'}">
            <v-window-item value="general">
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>Item</v-list-item-title>
                            <v-list-item-subtitle class="break">{{ item.item?.name || 'Item não identificado' }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item v-if="item.item">
                            <v-list-item-title>Canal</v-list-item-title>
                            <v-list-item-subtitle class="break">
                                <v-chip :prepend-avatar="item.channel.profileImageUrl" :to="{
                                name: 'dashboard-canal-channelId-resgates',
                                params: {
                                    channelId: item.channel.id
                                }
                            }">{{item.channel.displayName}}</v-chip>
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item v-if="item.item">
                            <v-list-item-title>Conta</v-list-item-title>
                            <v-list-item-subtitle class="break">
                                <v-chip :prepend-avatar="item.account.profileImageUrl" :to="{
                                name: 'dashboard-conta-accountId-resgates',
                                params: {
                                    accountId: item.account.id
                                }
                            }">{{item.account.displayName}}</v-chip>
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>
                        <v-list-item>
                            <v-list-item-title>Status</v-list-item-title>
                            <v-list-item-subtitle>
                                <v-chip :color="status.color">{{status.text}}</v-chip>
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2" v-if="item.accessCode"></v-divider>

                        <v-list-item v-if="item.accessCode">
                            <v-list-item-title>Código</v-list-item-title>
                            <v-list-item-subtitle>{{ item.accessCode }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item>
                            <v-list-item-title>Criado em</v-list-item-title>
                            <v-list-item-subtitle>{{ createdAt }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>Atualizado em</v-list-item-title>
                            <v-list-item-subtitle>{{ updatedAt }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-window-item>
            <v-window-item value="form">
                <v-card-text>
                    <v-list>
                        <v-list-item v-for="(field, i) in item.inputs" :key="i">
                            <v-list-item-title>Campo {{ i + 1 }}</v-list-item-title>
                            <v-list-item-subtitle class="break">{{ field }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-window-item>
        </v-window>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="on-surface" @click="onClose">Fechar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import leftIcon from '~icons/material-symbols/arrow-back'
// noinspection TypeScriptCheckImport
import rightIcon from '~icons/material-symbols/arrow-forward'
import { Redemption } from '../../types/Redemptions'
import { computed } from 'vue'
import { DateTime } from 'luxon'

const props = defineProps<{
    item: Redemption
}>()
const emits = defineEmits<{
    (ev: 'on-close'): void
}>()
const tab = ref("general")

const createdAt = computed(() => {
    return DateTime.fromISO(props.item.createdAt).toFormat(`dd/LL/yyyy HH:mm`)
})
const updatedAt = computed(() => {
    return DateTime.fromISO(props.item.updatedAt).toFormat(`dd/LL/yyyy HH:mm`)
})
const status = computed(()=>{
    if(props.item.rejected) return {
        color: 'error',
        text: 'Rejeitado'
    }
    if(props.item.completed) return {
        color: 'success',
        text: 'Concluído'
    }
    return {
        color: 'warning',
        text: 'Em andamento'
    }
})

const onClose = ()=>{
    emits('on-close')
}
</script>

<style lang="scss" scoped>
.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}
</style>