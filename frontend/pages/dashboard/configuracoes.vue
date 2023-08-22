<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Configurações" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <p class="text-h6">Notificações de resgates</p>
            </v-col>
            <v-col cols="12">
                <v-col cols="12">
                    <p class="text-body-1">
                        Configure as notificações para receber alertas quando o bot resgatar algo
                    </p>
                    <p>
                        <a
                            class="text-primary"
                            href="https://docs.mayconjesus.dev/twitch-farmer/como-configurar-as-notificacoes"
                            target="_blank"
                        ><strong>Clique aqui</strong></a
                        >
                        para ver o tutorial.
                    </p>
                </v-col>
                <v-col cols="12">
                    <dashboard-configuracoes-set-ntfy-room-id/>
                </v-col>
            </v-col>
            <v-col cols="12">
                <v-divider />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
})
useSeoMeta({
    title: 'Configurações',
})
</script>