<template>
    <v-row>
        <v-col cols="12">
            <p class="text-h6">Stream Elements</p>
        </v-col>
        <v-col cols="12">
            <v-col cols="12">
                <p class="text-body-1">
                    Configure o token do Stream Elements para que você possa resgatar no bot com sua conta.
                </p>
                <p>
                    <a
                        class="text-primary"
                        href="https://docs.mayconjesus.dev/twitch-farmer/tutoriais/como-setar-o-token-do-streamelements"
                        target="_blank"
                        ><strong>Clique aqui</strong></a
                    >
                    para ver o tutorial.
                </p>
            </v-col>
            <v-col cols="12">
                <twitch-account-settings-set-stream-elements-token />
            </v-col>
        </v-col>
        <v-col cols="12">
            <v-divider />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <p class="text-h6">Zona de perigo</p>
        </v-col>
        <v-col cols="12">
            <v-col cols="12">
                <v-btn color="error" @click="modalDeleteOpen = true">Excluir conta</v-btn>
            </v-col>
        </v-col>
        <v-col cols="12">
            <v-divider />
        </v-col>
        <dashboard-twitch-accounts-dialog-account-delete
            v-if="account.account"
            v-model="modalDeleteOpen"
            :account-id="account.account.id"
            :account-name="account.account.displayName"
            @account-deleted="onDeleteAccount"
        />
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTwitchAccount } from '~/store/twitch-account'
import vue from 'vue'

const router = useRouter()
const modalDeleteOpen = ref(false)
const account = useTwitchAccount()

const onDeleteAccount = () => {
    router.push({ name: 'dashboard-contas', params: { accountId: '123' } })
}
</script>