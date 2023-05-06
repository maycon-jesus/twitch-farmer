<template>
    <v-app>
        <ui-loading />
        <templates-header />
        <templates-dashboard-drawer />
        <v-main class="main">
            <slot></slot>
        </v-main>
        <templates-footer />
    </v-app>
</template>

<style scoped>
.main {
    min-height: 100vh;
}
</style>
<script lang="ts" setup></script>
