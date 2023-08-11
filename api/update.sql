ALTER TABLE `twitchfarmer`.`twitch_accounts`
ADD COLUMN `streamElementsUserId` VARCHAR(255) NULL DEFAULT NULL AFTER `tokenInvalid`;