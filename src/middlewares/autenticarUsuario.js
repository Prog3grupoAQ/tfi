import passport from "passport";

export const autenticarUsuario = passport.authenticate("jwt", {
  session: false,
});
