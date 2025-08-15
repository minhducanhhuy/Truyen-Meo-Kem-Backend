import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

function generateRandomName() {
  const numbers = Math.floor(Math.random() * 10000); // 0-999
  return `kem_${numbers}`; // Ví dụ: kem_xinh_123
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: { email: string }) {
    const email = googleUser.email;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          full_name: generateRandomName(),
        },
      });
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async discordLogin(discordUser: any) {
    const { discordId, username, avatar } = discordUser;

    let user = await this.prisma.user.findUnique({
      where: { discord_id: discordId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          discord_id: discordId,
          full_name: username || `discord_user_${discordId}`,
          avatar_url: avatar
            ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`
            : null,
        },
      });
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user,
    };
  }
}
