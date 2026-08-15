import type { User } from "@prisma/client";

export type UserRepository = {
  findUserByGoogleId: (googleId: string) => Promise<User | null>;
  createUser: (data: {
    googleId: string;
    email: string;
    displayName: string;
  }) => Promise<User>;
};

export function createAuthService(userRepository: UserRepository) {
  async function findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    displayName: string;
  }): Promise<User> {
    const existing = await userRepository.findUserByGoogleId(
      profile.googleId
    );
    if (existing) return existing;

    return userRepository.createUser(profile);
  }

  return { findOrCreateGoogleUser };
}
