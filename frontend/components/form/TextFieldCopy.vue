<template>
    <v-text-field :label="$props.label" v-model="value" readonly>
        <template #append-inner>
            <v-tooltip>
                <template #activator="{ props }">
                    <v-icon
                        :color="copied ? 'success' : undefined"
                        :icon="copied ? iconSuccess : iconCopy"
                        v-bind="props"
                        @click="copyContent"
                    ></v-icon
                ></template>

                <span>{{ copied ? 'Copiado' : 'Copiar' }}</span>
            </v-tooltip>
        </template>
    </v-text-field>
</template>

<script setup lang="ts">
import iconCopy from '~icons/material-symbols/content-copy-outline';
import iconSuccess from '~icons/mdi/success';

const props = defineProps<{
    label?: string;
    modelValue?: string;
}>();

const value = ref('');
const copied = ref(false);

const copyContent = () => {
    try {
        navigator.clipboard.writeText(value.value);
        copied.value = true;

        setTimeout(() => {
            copied.value = false;
        }, 3000);
    } catch {}
};

if (props.modelValue) {
    value.value = props.modelValue;
}

watchEffect(() => {
    if (props.modelValue) {
        value.value = props.modelValue;
    } else {
        value.value = '';
    }
});
</script>
