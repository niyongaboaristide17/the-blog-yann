import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import { use } from "passport";

const LocalStrategy = passportLocal.Strategy;

export default function initialize(passport, getUserByEmail, getUserById) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async function (
            email,
            password,
            done
        ) {
            const user = await getUserByEmail(email);
            if (user == null) {
                return done(null, false, { message: "No user with that email" });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Password incorrect" });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}
