<template>
    <div>
        <v-menu v-model="modalOpen" :close-on-content-click="false" :close-on-back="false" location="bottom">
            <template #activator="{props}">
                <div @click="$props.disabled? undefined:modalOpen=true">
                    <v-select
                        label="Conta(s)"
                        multiple
                        :items="$props.accounts"
                        item-value="id"
                        :model-value="accountsValue"
                        readonly
                        v-bind="props"
                        :disabled="$props.disabled"
                        :rules="[ruleSelectAccount]">
                        <template #chip="{props,item}">
                            <v-chip
                                :text="item.raw.displayName"
                                :prepend-avatar="item.raw.profileImageUrl"></v-chip>
                        </template>
                    </v-select>
                </div>
            </template>
            <v-card>
                <v-card-title>Selecionar conta para resgatar</v-card-title>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-switch label="Mostrar somente contas com pontos para resgatar"
                                      hide-details
                                      v-model="filterWithPoints"></v-switch>
                            <v-switch label="Mostrar somente contas fora do cooldown"
                                      hide-details
                                      v-model="filterWithNoCooldown"></v-switch>
                            <v-switch label="Mostrar contas que ja estão no bot"
                                      hide-details
                                      v-model="filterShowAccountsInBot"></v-switch>
                        </v-col>
                    </v-row>
                    <v-item-group :multiple="true" v-model="accountsValue">
                        <v-table>
                            <thead>
                            <tr>
                                <th></th>
                                <th>Conta</th>
                                <th>Pontuação</th>
                                <th>Cooldown</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="accountsComputed.length===0">
                                <td colspan="4">
                                    <v-alert variant="tonal">Nenhum conta encontrada!</v-alert>
                                </td>
                            </tr>
                            <v-item v-slot="{isSelected, toggle}" :value="account.id" v-for="account in accountsComputed" :key="account.id">
                                <tr @click="toggle" class="cursor-pointer">
                                    <td>
                                        <v-checkbox :false-icon="iconCheckBoxUnChecked"
                                                    :true-icon="iconCheckBoxChecked"
                                                    :model-value="isSelected"
                                                    @update:model-value="toggle"
                                                    hide-details
                                        >
                                        </v-checkbox>
                                    </td>
                                    <td>
                                        <v-chip :prepend-avatar="account.profileImageUrl" :text="account.displayName"></v-chip>
                                    </td>
                                    <td>{{ $props.accountsPoints[account.id]?.points }}</td>
                                    <td>{{ cooldownTime(account) }}</td>
                                </tr>
                            </v-item>
                            </tbody>
                        </v-table>
                        <!--                        <v-row>-->
                        <!--                            <v-col cols="12" sm="6" v-for="account in accountsComputed" :key="account.id">-->
                        <!--                                <v-item v-slot="{isSelected, toggle}" :value="account.id">-->
                        <!--                                    <v-card variant="outlined" @click="toggle" height="100%">-->
                        <!--                                        <v-container>-->
                        <!--                                            <v-row align="center" no-gutters>-->
                        <!--                                                <v-col cols="auto">-->
                        <!--                                                    <v-checkbox :false-icon="iconCheckBoxUnChecked"-->
                        <!--                                                                :true-icon="iconCheckBoxChecked"-->
                        <!--                                                                :model-value="isSelected"-->
                        <!--                                                                @update:model-value="toggle"-->
                        <!--                                                                hide-details></v-checkbox>-->
                        <!--                                                </v-col>-->
                        <!--                                                <v-col cols="auto">-->
                        <!--                                                    <v-avatar size="32">-->
                        <!--                                                        <v-img :src="account.profileImageUrl"></v-img>-->
                        <!--                                                    </v-avatar>-->
                        <!--                                                    <span class="ml-2">{{ account.displayName }}</span>-->
                        <!--                                                </v-col>-->
                        <!--                                            </v-row>-->
                        <!--                                            <v-row no-gutters>-->
                        <!--                                                <v-col cols="12">-->
                        <!--                                                    <v-list>-->
                        <!--                                                        <v-list-item :prepend-icon="iconCoin" title="Pontuação"-->
                        <!--                                                                     :subtitle="`${$props.accountsPoints[account.id]?.points}`"></v-list-item>-->
                        <!--                                                        <v-list-item :prepend-icon="iconTime">-->
                        <!--                                                            <v-list-item-title class="break">Tempo restante de cooldown</v-list-item-title>-->
                        <!--                                                            <v-list-item-subtitle class="break">{{cooldownTime(account)}}</v-list-item-subtitle>-->
                        <!--                                                        </v-list-item>-->
                        <!--                                                    </v-list>-->
                        <!--                                                </v-col>-->
                        <!--                                            </v-row>-->
                        <!--                                        </v-container>-->
                        <!--                                    </v-card>-->
                        <!--                                </v-item>-->
                        <!--                            </v-col>-->
                        <!--                        </v-row>-->
                    </v-item-group>
                </v-container>
                <v-card-actions @click="modalOpen=false" class="fixed-bottom">
                    <v-spacer></v-spacer>
                    <v-btn>Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script lang="ts" setup>
import type { AccountResume } from '~/types/Accounts'
import iconCheckBoxUnChecked from '~icons/fluent/checkbox-unchecked-24-regular'
import iconCheckBoxChecked from '~icons/fluent/checkbox-checked-24-filled'
import iconCoin from '~icons/pixelarticons/coin'
import iconTime from '~icons/ri/time-line'
import { DateTime } from 'luxon'

const props = defineProps<{
    accounts: AccountResume[],
    accountsPoints: Record<string, {
        rank: number,
        points: number
    }>
    accountsCooldown: Record<string, number>,
    accountsInRedemptionBot: {},
    item?: any,
    modelValue: string[] | null,
    disabled?: boolean
}>()
const emits = defineEmits<{
    (ev: 'update:modelValue', value: string[]): void
}>()
const modalOpen = ref(false)
const accountsValue = ref<string[]>([])
const filterWithPoints = ref(true)
const filterWithNoCooldown = ref(true)
const filterShowAccountsInBot = ref(false)

const accountsComputed = computed(() => {
    let accounts = props.accounts
    if (filterWithPoints.value) {
        accounts = accounts.filter(account => {
            if (!props.accountsPoints[account.id]?.points) return false
            if (!props.item) return true
            return props.accountsPoints[account.id].points > props.item.cost
        })
    }

    if (filterWithNoCooldown.value) {
        accounts = accounts.filter(account => {
            const lastRedemptionCooldown = props.accountsCooldown[account.id]
            if (!lastRedemptionCooldown) return true
            return lastRedemptionCooldown === 0
        })
    }

    if (!filterShowAccountsInBot.value) {
        accounts = accounts.filter(account => {
            const accountInRedemptionBot = props.accountsInRedemptionBot[account.id]
            return !accountInRedemptionBot
        })
    }
    return accounts
})

const ruleSelectAccount = (val) => {
    if (!val) return 'Selecione pelo menos uma conta!'
    if (val.length <= 0) return 'Selecione pelo menos uma conta!'
    return true
}

const transformSecondsInHumanTime = (time: number) => {
    const days = Math.floor(time / 86_400)
    time = time - days * 86_400
    const hours = Math.floor(time / 3_600)
    time = time - hours * 3_600
    const minutes = Math.floor(time / 60)
    time = time - minutes * 60
    const seconds = time

    const strArr = []
    if (days > 0) strArr.push(`${days} dias`)
    if (hours > 0) strArr.push(`${hours} horas`)
    if (minutes > 0) strArr.push(`${minutes} minutos`)
    if (seconds > 0) strArr.push(`${seconds.toFixed(0)} segundos`)
    return strArr[0]
}

const cooldownTime = (account: AccountResume) => {
    if (!props.accountsCooldown[account.id]) return 'Pronto'
    return `${transformSecondsInHumanTime(props.accountsCooldown[account.id] / 1000)} restantes`
}

watchEffect(() => {
    emits('update:modelValue', accountsValue.value)
})
watchEffect(() => {
    accountsValue.value = props.modelValue
})
</script>

<style lang="scss" scoped>
.break {
    -webkit-line-clamp: unset !important;
    white-space: unset;
}

.fixed-bottom {
    position: sticky;
    bottom: 0;
    width: 100%;
    background: rgb(var(--v-theme-surface));
}
</style>