import { prisma } from "../config/prisma.js";

export function findUserByGoogleId(googleId: string) {
  return prisma.user.findUnique({ where: { googleId } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data: {
  googleId: string;
  email: string;
  displayName: string;
}) {
  return prisma.user.create({ data });
}
