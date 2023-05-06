export type AccountResume = {
    id: string
    login: string
    displayName: string
    profileImageUrl: string
    banned: boolean
    tokenInvalid: boolean
    bot: {
        channelsConnected: number
        totalChannels: number
        state: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'
    }
}
