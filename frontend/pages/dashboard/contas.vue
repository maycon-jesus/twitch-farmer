<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Contas" />
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" lg="8" md="9" sm="10">
                <v-text-field v-model="search" hide-details label="Pesquisar"></v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto">
                <dashboard-twitch-accounts-btn-add-account />
            </v-col>
        </v-row>
        <v-row v-if="display.mdAndUp.value">
            <v-col cols="12">
                <v-table class="rounded">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Nick</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <lazy-dashboard-twitch-accounts-resume-row
                        v-for="(account,index) in accountsToShow"
                        :key="account.id"
                        :account="account"
                        :index="index+1"
                        @account-updated="getAccounts(false)"
                    />
                    <tr v-if="accountsToShow.length === 0">
                        <td colspan="4">
                            {{ search ? 'Nenhuma conta encontrada!' : 'Você não adicionou nenhuma conta ainda' }}
                        </td>
                    </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-row justify="center" v-else>
            <v-col cols="12">
                <div class="accounts-list">
                    <lazy-dashboard-twitch-accounts-resume-card
                        v-for="account in accountsToShow"
                        :key="account.id"
                        :account="account"
                        @account-updated="getAccounts(false)"
                    />
                </div>
            </v-col>
            <v-col v-if="accountsToShow.length === 0" cols="8">
                <v-alert variant="tonal">
                    {{ search ? 'Nenhuma conta encontrada!' : 'Você não adicionou nenhuma conta ainda' }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { AccountResume } from '~/types/Accounts'
import { useUi } from '~/store/ui'
import { useDisplay } from 'vuetify'

// Types
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})
useSeoMeta({
    title: 'Contas'
})

const api = useApi()
const ui = useUi()
const display = useDisplay()
const accounts = ref<AccountResume[]>([])
const search = ref('')
const accountsToShow = computed(() => {
    return accounts.value.filter((a) => {
        const searchLowerCase = search.value.toLowerCase()
        if (a.login.toLowerCase().includes(searchLowerCase)) return true
        return a.displayName.toLowerCase().includes(searchLowerCase)
    })
})

const getAccounts = (showLoading: boolean = true) => {
    if (showLoading) {
        ui.startLoading()
    }

    api('/twitch-accounts')
        .then((_accounts) => {
            accounts.value = _accounts as any
        })
        .finally(() => {
            if (showLoading) {
                ui.endLoading()
            }
        })
}

getAccounts()
</script>

<style lang="scss" scoped>
.accounts-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 15px;
}
</style>