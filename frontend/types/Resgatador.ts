export type ResgatadorItem = {
    accountId: string,
    channelId: string,
    completed: 0 | 1,
    createdAt: string,
    id: string,
    inputs: string[],
    item: {
        name: string,
        cost: number,
        subscriberOnly: 0 | 1
    },
    channel: {
        id: string
        login: string,
        displayName: string,
        profileImageUrl: string
    },
    account: {
        id: string
        login: string,
        displayName: string,
        profileImageUrl: string
    }
    itemId: string,
    priority: number,
    updatedAt: string,
    queuePosition: number
}