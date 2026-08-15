import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createAuthService } from "../services/auth.service.js";
import {
  createUser,
  findUserByGoogleId,
  findUserById,
} from "../repositories/user.repository.js";

const authService = createAuthService({
  findUserByGoogleId,
  createUser,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          done(new Error("Google profile did not include an email"));
          return;
        }

        const user = await authService.findOrCreateGoogleUser({
          googleId: profile.id,
          email,
        });
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user ?? false);
  } catch (err) {
    done(err as Error);
  }
});

export { passport };
