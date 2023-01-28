export const TwitchAccountCreatedEventName = 'twitch-accounts.created';
export class TwitchAccountCreatedEvent {
  accountId: number;

  constructor(accountData: { accountId: number }) {
    this.accountId = accountData.accountId;
  }
}
