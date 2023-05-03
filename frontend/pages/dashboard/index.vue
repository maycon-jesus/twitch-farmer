<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <DashboardTemplatePageTitle title="Dashboard"></DashboardTemplatePageTitle>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div :class="{ tablet: $vuetify.display.mdAndDown, mobile: $vuetify.display.xs }" class="cards-list">
                    <DashboardHomePageCard
                        :icon="iconTwitch"
                        :to="{ name: 'dashboard-contas' }"
                        description="Gerencie suas contas da twitch"
                        title="Contas"
                    />
                    <DashboardHomePageCard
                        :icon="iconLive"
                        :to="{ name: 'dashboard-canais' }"
                        description="Gerencie seus canais de farm"
                        title="Canais"
                    />
                    <DashboardHomePageCard
                        :icon="iconInvite"
                        :to="{ name: 'dashboard-convites' }"
                        description="Crie um link de convite para chamar seus amigos para farmar com você"
                        title="Convidar amigos"
                    />
                    <DashboardHomePageCard
                        :icon="iconGift"
                        :to="{ name: 'index' }"
                        coming-soon
                        description="Acompanhe de forma facilitada todos os seus resgates"
                        title="Resgates"
                    />
                    <DashboardHomePageCard
                        :icon="iconBot"
                        :to="{ name: 'index' }"
                        coming-soon
                        description="Configure seu bot de resgates automatizado"
                        title="Resgatador automático"
                    />
                    <DashboardHomePageCard
                        :icon="iconTutorial"
                        :to="{ name: 'index' }"
                        coming-soon
                        description="Aprenda como utilizar alguns recursos do site"
                        title="Tutoriais"
                    />
                    <DashboardHomePageCard
                        :icon="iconNotes"
                        :to="{ name: 'index' }"
                        coming-soon
                        description="Acompanhe todas as novidades que estão por vir"
                        title="Notas de lançamento"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconInvite from '~icons/mdi/invite'
// noinspection TypeScriptCheckImport
import iconTwitch from '~icons/mdi/twitch'
// noinspection TypeScriptCheckImport
import iconGift from '~icons/mdi/gift'
// noinspection TypeScriptCheckImport
import iconLive from '~icons/solar/play-stream-bold'
// noinspection TypeScriptCheckImport
import iconBot from '~icons/fluent/bot-20-filled'
// noinspection TypeScriptCheckImport
import iconNotes from '~icons/mdi/feature-highlight'
// noinspection TypeScriptCheckImport
import iconTutorial from '~icons/material-symbols/school'

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard-index',
})
</script>

<style lang="scss" scoped>
.cards-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    // margin: auto;

    &.tablet {
        grid-template-columns: repeat(2, 1fr);
    }

    &.mobile {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>