<template>
    <v-row>
        <v-col cols="12">
            <v-text-field v-model="filters.search" hide-details label="Pesquisar"></v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" md="6" lg="6">
            <v-select v-model="filters.category" :items="categories" hide-details label="Categorias"></v-select>
        </v-col>

        <v-col cols="12" md="6" lg="6">
            <v-select
                v-model="filters.orderBy"
                :items="orderTypes"
                hide-details
                item-title="text"
                item-value="value"
                label="Ordernar por"
            ></v-select>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-title>Filtros avançados</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col cols="12">
                                <v-switch
                                    v-model="filters.showEnabled"
                                    hide-details
                                    label="Mostrar items habilitados"
                                ></v-switch>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-switch
                                    v-model="filters.showHidden"
                                    hide-details
                                    label="Mostrar items ocultos"
                                ></v-switch>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-switch
                                    v-model="filters.showDeleted"
                                    hide-details
                                    label="Mostrar items excluídos"
                                ></v-switch>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { ChannelStoreItem } from '~/types/ChannelStore'
import { DateTime } from 'luxon'

const props = defineProps<{
    items: ChannelStoreItem[]
    modelValue: ChannelStoreItem[]
}>()
const emits = defineEmits<{
    (ev: 'update:modelValue', v: ChannelStoreItem[]): void
}>()
const orderTypes = [
    {
        text: 'Data de criação',
        value: 'created',
    },
    {
        text: 'Data de atualização',
        value: 'updated',
    },
    {
        text: 'Valor',
        value: 'cost',
    },
    {
        text: 'Quantidade',
        value: 'quantity',
    },
]
const filters = ref({
    search: '',
    showEnabled: true,
    showHidden: false,
    showDeleted: false,
    category: 'Todas',
    orderBy: 'created',
})

const itemsFiltered = computed(() => {
    return (
        props.items
            // Search
            .filter((item) => {
                if (!filters.value.search) return true
                return item.name.toLowerCase().includes(filters.value.search.toLowerCase())
            })
            // show hidden
            .filter((item) => {
                if (filters.value.showHidden && !item.enabled) return true
                return !(!filters.value.showHidden && !item.enabled)
            })
            // show deleted
            .filter((item) => {
                if (filters.value.showDeleted && item.deleted) return true
                return !(!filters.value.showDeleted && item.deleted)
            })
            // show enabled
            .filter((item) => {
                if (filters.value.showEnabled && item.enabled) return true
                return !(!filters.value.showEnabled && item.enabled)
            })
            // Category
            .filter((item) => {
                if (filters.value.category === 'Todas') return true
                if (filters.value.category === 'sem categoria') return item.category == null
                return filters.value.category === item.category
            })
            // Ordenação
            .sort((itemA, itemB) => {
                switch (filters.value.orderBy) {
                    case 'created':
                        return (
                            DateTime.fromISO(itemB.createdAt).toMillis() - DateTime.fromISO(itemA.createdAt).toMillis()
                        )
                    case 'updated':
                        return (
                            DateTime.fromISO(itemB.updatedAt).toMillis() - DateTime.fromISO(itemA.updatedAt).toMillis()
                        )
                    case 'cost':
                        const nItemACost = itemA.cost >= 0 ? itemA.cost : Infinity
                        const nItemBCost = itemB.cost >= 0 ? itemB.cost : Infinity
                        return nItemACost - nItemBCost
                    case 'quantity':
                        return itemB.quantityCurrent - itemA.quantityCurrent
                    default:
                        return 0
                }
            })
    )
})

const categories = computed(() => {
    return props.items.reduce<string[]>(
        (p, v) => {
            if (p.includes(v.category || 'sem categoria')) return p
            p.push(v.category || 'sem categoria')
            return p
        },
        ['Todas']
    )
})

watch(
    () => itemsFiltered.value,
    () => {
        console.log(itemsFiltered.value)
        emits('update:modelValue', itemsFiltered.value)
    }
)
</script>