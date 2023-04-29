<template>
    <v-app>
        <ui-loading />
        <templates-header />
        <templates-dashboard-drawer />
        <v-main class="main">
            <slot></slot>
        </v-main>
        <v-footer app absolute>GGG</v-footer>
    </v-app>
</template>

<style scoped>
.main {
    min-height: 100vh;
}
</style>
