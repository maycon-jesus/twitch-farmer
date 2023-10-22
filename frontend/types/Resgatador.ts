export type ResgatadorItem = {
    accountId: string,
    channelId: string,
    completed: 0 | 1,
    createdAt: string,
    id: string,
    inputs: string[],
    suspended: 0|1,
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

export type ResgatadorCompletedItem = {
    accountId: string,
    channelId: string,
    completed: 0 | 1,
    error: 0 | 1,
    errorReason?: string,
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
    updatedAt: string
}