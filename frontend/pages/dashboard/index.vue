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
                    />
                    <DashboardHomePageCard
                        title="Canais"
                        description="Gerencie seus canais de farm"
                        :to="{ name: 'index' }"
                        :icon="iconLive"
                    />
                    <DashboardHomePageCard
                        title="Resgates"
                        description="Acompanhe de forma facilitada todos os seus resgates"
                        :to="{ name: 'index' }"
                        :icon="iconGift"
                    />
                    <DashboardHomePageCard
                        title="Resgatador automático"
                        description="Configure seu bot de resgates automatizado"
                        :to="{ name: 'index' }"
                        :icon="iconBot"
                    />
                    <DashboardHomePageCard
                        title="Convidar amigos"
                        description="Crie um link de convite para chamar seus amigos para farmar com você"
                        :to="{ name: 'index' }"
                        :icon="iconInvite"
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
