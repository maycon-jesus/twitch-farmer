<template>
    <div class="chip-group">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.chip-group{
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
}
</style>