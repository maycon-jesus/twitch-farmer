<template>
    <v-fade-transition v-show='ui.loading'>
        <div class='wrapper'>
            <span class='loader'></span>
        </div>
    </v-fade-transition>
</template>

<script lang='ts' setup>
import { useUi } from '~/store/ui';

const ui = useUi();
</script>

<style lang='scss' scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(var(--v-theme-background));
  z-index: 2000;
  transition: all 0.3s;
}

.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 6rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation: pulsOut 1.8s ease-in-out infinite;
  filter: drop-shadow(0 0 1rem rgba(var(--v-theme-primary), 0.75));
}

.loader:before {
  width: 100%;
  padding-bottom: 100%;
  box-shadow: inset 0 0 0 1rem var(--v-theme-primary);
  animation-name: pulsIn;
}

.loader:after {
  width: calc(100% - 2rem);
  padding-bottom: calc(100% - 2rem);
  box-shadow: 0 0 0 0 rgb(var(--v-theme-primary));
}

@keyframes pulsIn {
  0% {
    box-shadow: inset 0 0 0 1rem rgb(var(--v-theme-primary));
    opacity: 1;
  }
  50%,
  100% {
    box-shadow: inset 0 0 0 0 rgb(var(--v-theme-primary));
    opacity: 0;
  }
}

@keyframes pulsOut {
  0%,
  50% {
    box-shadow: 0 0 0 0 rgb(var(--v-theme-primary));
    opacity: 0;
  }
  100% {
    box-shadow: 0 0 0 1rem rgb(var(--v-theme-primary));
    opacity: 1;
  }
}
</style>
