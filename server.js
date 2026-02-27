require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');

const app = express();

// IDs de Roles Autorizados
const AUTHORIZED_ROLES = ["1468782653275639961", "1475176759744790658"];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'guilds', 'guilds.members.read']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use(session({ secret: 'viva-chile-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Ruta de Login
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => res.redirect('/dashboard'));

// Middleware para verificar Staff
function isStaff(req, res, next) {
    if (req.isAuthenticated()) {
        const userRoles = req.user.guilds; // Lógica simplificada: requiere chequear el miembro en el servidor
        // Aquí se validaría contra los Role IDs proporcionados
        return next();
    }
    res.status(403).send("Acceso restringido – Solo personal autorizado.");
}

app.use(express.static('public'));

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));