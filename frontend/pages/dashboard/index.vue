<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <DashboardTemplatePageTitle title="Dashboard"></DashboardTemplatePageTitle>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class="cards-list" :class="{ tablet: $vuetify.display.mdAndDown, mobile: $vuetify.display.xs }">
                    <DashboardHomePageCard
                        title="Contas"
                        description="Gerencie suas contas da twitch"
                        :to="{ name: 'index' }"
                        :icon="iconTwitch"
                        coming-soon
                    />
                    <DashboardHomePageCard
                        title="Canais"
                        description="Gerencie seus canais de farm"
                        :to="{ name: 'index' }"
                        :icon="iconLive"
                        coming-soon
                    />
                    <DashboardHomePageCard
                        title="Convidar amigos"
                        description="Crie um link de convite para chamar seus amigos para farmar com você"
                        :to="{ name: 'dashboard-convites' }"
                        :icon="iconInvite"
                    />
                    <DashboardHomePageCard
                        title="Resgates"
                        description="Acompanhe de forma facilitada todos os seus resgates"
                        :to="{ name: 'index' }"
                        :icon="iconGift"
                        coming-soon
                    />
                    <DashboardHomePageCard
                        title="Resgatador automático"
                        description="Configure seu bot de resgates automatizado"
                        :to="{ name: 'index' }"
                        :icon="iconBot"
                        coming-soon
                    />
                    <DashboardHomePageCard
                        title="Tutoriais"
                        description="Aprenda como utilizar alguns recursos do site"
                        :to="{ name: 'index' }"
                        :icon="iconTutorial"
                        coming-soon
                    />
                    <DashboardHomePageCard
                        title="Notas de lançamento"
                        description="Acompanhe todas as novidades que estão por vir"
                        :to="{ name: 'index' }"
                        :icon="iconNotes"
                        coming-soon
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import iconInvite from '~icons/mdi/invite';
import iconTwitch from '~icons/mdi/twitch';
import iconGift from '~icons/mdi/gift';
import iconLive from '~icons/solar/play-stream-bold';
import iconBot from '~icons/fluent/bot-20-filled';
import iconNotes from '~icons/mdi/feature-highlight';
import iconTutorial from '~icons/material-symbols/school';

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard-index',
});
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
