<template>
    <v-text-field v-model="value" :label="$props.label" readonly>
        <template #append-inner>
            <v-tooltip>
                <template #activator="{ props }">
                    <v-icon
                        :color="copied ? 'success' : undefined"
                        :icon="copied ? iconSuccess : iconCopy"
                        v-bind="props"
                        @click="copyContent"
                    ></v-icon>
                </template>

                <span>{{ copied ? 'Copiado' : 'Copiar' }}</span>
            </v-tooltip>
        </template>
    </v-text-field>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconCopy from '~icons/material-symbols/content-copy-outline' // noinspection TypeScriptCheckImport
import iconSuccess from '~icons/mdi/success'

const props = defineProps<{
    label?: string
    modelValue?: string
}>()

const value = ref('')
const copied = ref(false)

const copyContent = () => {
    try {
        navigator.clipboard.writeText(value.value)
        copied.value = true

        setTimeout(() => {
            copied.value = false
        }, 3000)
    } catch {}
}

if (props.modelValue) {
    value.value = props.modelValue
}

watchEffect(() => {
    if (props.modelValue) {
        value.value = props.modelValue
    } else {
        value.value = ''
    }
})
</script>