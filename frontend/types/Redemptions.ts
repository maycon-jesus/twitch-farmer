export type Redemption = {
    channel: {
        id: string,
        displayName: string,
        login: string,
        profileImageUrl: string
    },
    account: {
        id: string,
        displayName: string,
        login: string,
        profileImageUrl: string
    },
    item?: {
        id: string,
        name: string,
    },
}