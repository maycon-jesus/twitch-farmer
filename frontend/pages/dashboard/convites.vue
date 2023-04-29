<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <dashboard-template-page-title title="Convites" />
            </v-col>
        </v-row>
        <v-row justify="end">
            <v-col cols="auto">
                <dashboard-invites-button-create-invite @created:invite="getInvites(undefined, false)" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Usado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in invites.data" :key="item.code">
                            <td>{{ item.code }}</td>
                            <td>{{ item.used ? '✅' : '❌' }}</td>
                        </tr>
                        <tr v-if="invites.total === 0">
                            <td colspan="2">Você não possui nenhum convite gerado!</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-pagination
                    :length="invites.totalPages"
                    :model-value="invites.actualPage"
                    @update:model-value="getInvites"
                ></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useUi } from '~/store/ui';

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});

const api = useApi();
const ui = useUi();
const invites = ref<{
    data: {
        code: string;
        createdAt: string;
        ownerId: string;
        updateAt: string;
        used: 0 | 1;
        usedBy: null | string;
    }[];
    total: number;
    actualPage: number;
    totalPages: number;
}>({ data: [], actualPage: 1, total: 0, totalPages: 0 });

const getInvites = (page: number = 1, showLoading: boolean = true) => {
    if (showLoading) {
        ui.startLoading();
    }

    api<{
        data: any[];
        total: number;
        actualPage: number;
        totalPages: number;
    }>('/invite-codes', {
        query: {
            page,
        },
    })
        .then((data) => {
            invites.value = data;
        })
        .finally(() => {
            if (showLoading) {
                ui.endLoading();
            }
        });
};

getInvites(1);
</script>
