<template>
    <v-footer absolute app class="d-flex flex-column">
        <div class="d-flex w-100 align-center px-4">
            <span>
                <strong>Ajude o projeto e deixe sua estrelinha no GitHub! </strong>
                <a
                    class="text-primary text-uppercase"
                    href="https://github.com/maycon-jesus/twitch-farmer"
                    target="_blank"
                    >Abrir repositório</a
                >
            </span>
        </div>

        <div class="px-4 py-2 text-center w-100">
            {{ new Date().getFullYear() }} — <a href="https://mayconjesus.dev"><strong>Maycon Jesus</strong></a>
        </div>
    </v-footer>
</template>

<script lang="ts" setup></script>
