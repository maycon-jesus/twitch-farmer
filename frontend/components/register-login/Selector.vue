<template>
    <v-row>
        <v-col cols="12">
            <div
                class="tabs"
                :class="{
                    'tabs-mobile': $vuetify.display.smAndDown,
                }"
            >
                <NuxtLink to="/" active-class="active-tab" class="tab text-subtitle-1">Entrar</NuxtLink>
                <NuxtLink to="/registrar" active-class="active-tab" class="tab text-subtitle-1">Registrar</NuxtLink>
            </div>
        </v-col>
    </v-row>
</template>

<style lang="scss" scoped>
.tabs {
    display: flex;
    flex-flow: row nowrap;
    background-color: rgb(var(--v-theme-background));
    border-radius: 17px;
    padding: 5px;
    gap: 5px;
    margin-bottom: 1.5rem;

    &.tabs-mobile {
        flex-flow: row wrap;
        .tab {
            width: 100%;
        }
    }

    .tab {
        border-radius: 999rem;
        padding: 3px 5px;
        width: 50%;
        text-align: center;
    }
}
</style>

<style>
.active-tab {
    background-color: rgb(var(--v-theme-secondary));
    color: rgb(var(--v-theme-on-secondary));
}
</style>
