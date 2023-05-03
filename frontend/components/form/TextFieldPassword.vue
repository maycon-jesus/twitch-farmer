<template>
    <v-text-field
        v-model="value"
        :autocomplete="$props.autocomplete"
        :label="$props.label"
        :type="showPassword ? 'text' : 'password'"
    >
        <template #append-inner>
            <v-icon :icon="showPassword ? iconEye : iconEyeOff" @click="toggleShowPassword"></v-icon>
        </template>
    </v-text-field>
</template>

<script lang="ts" setup>
// noinspection TypeScriptCheckImport
import iconEye from '~icons/ion/eye' // noinspection TypeScriptCheckImport
import iconEyeOff from '~icons/ion/eye-off'

const props = defineProps<{
    label: string
    autocomplete: string
    modelValue?: string
}>()
const emits = defineEmits<{
    (e: 'update:modelValue', data: string): void
}>()

const value = ref('')
const showPassword = ref(false)

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

watchEffect(() => {
    emits('update:modelValue', value.value)
})
watchEffect(() => {
    if (!props.modelValue) return (value.value = '')
    value.value = props.modelValue
})
</script>