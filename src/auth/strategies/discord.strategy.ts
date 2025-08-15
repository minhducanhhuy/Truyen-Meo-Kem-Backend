import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptions } from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_REDIRECT_URL!,
      scope: ['identify', 'email'],
    } as StrategyOptions); // 👈 ép kiểu rõ ràng để TS hiểu
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const { id, username, email, avatar } = profile;

    const user = {
      discordId: id,
      username,
      email,
      avatar,
      accessToken,
    };

    done(null, user);
  }
}
