<template>
    <v-card
        :to='$props.comingSoon ? undefined : $props.to'
        class='page-card'
        color='primary'
        tag='NuxtLink'
        variant='tonal'
    >
        <v-container fluid>
            <v-row>
                <v-col cols='auto'>
                    <div class='icon-wrapper bg-primary'>
                        <v-icon :icon='$props.icon' size='24'></v-icon>
                    </div>
                </v-col>
                <v-col cols=''>
                    <span v-if='$props.comingSoon' class='text-h6'>{{ $props.title }} (EM BREVE)</span>
                    <span v-else class='text-h6'>{{ $props.title }}</span>
                    <p class='text-body-1'>{{ $props.description }}</p>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang='ts' setup>
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
    icon: any;
    title: string;
    description: string;
    to: RouteLocationRaw;
    comingSoon?: boolean;
}>();
</script>

<style lang='scss' scoped>
.page-card {
  // max-width: 250px;
}

.icon-wrapper {
  border-radius: 999rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 48px;
  // background-color: rgba(0, 0, 0, 0.5);
}
</style>
