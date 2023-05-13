export type ChannelStoreItem = {
    id: string
    streamElementsUserId: string
    cooldownUser: number
    cooldownGlobal: number
    cooldownCategory: number
    cost: number
    name: string
    description: string
    category: string
    thumbnailUrl: string
    enabled: 0 | 1
    subscriberOnly: 0 | 1
    quantityTotal: number
    quantityCurrent: number
    inputs: string[]
    createdAt: string
    updatedAt: string
    deleted: 0 | 1
}
