<template>
    <v-app>
        <ui-loading />
        <templates-header />
        <v-main class="main">
            <slot></slot>
        </v-main>
        <v-footer>GGG</v-footer>
    </v-app>
</template>

<style scoped>
.main {
    min-height: 100vh;
}
</style>
