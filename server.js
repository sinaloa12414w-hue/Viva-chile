require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');

const app = express();

// ESTO ES CLAVE PARA RENDER: Usar el puerto que ellos asignen
const PORT = process.env.PORT || 3000; 

// IDs de Roles Autorizados de tu servidor
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

// Rutas de inicio de sesión con Discord
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => res.redirect('/dashboard'));

// Middleware para verificar si es Staff
function isStaff(req, res, next) {
    if (req.isAuthenticated()) {
        // Aquí puedes agregar la lógica para leer los roles específicos más adelante
        return next();
    }
    res.status(403).send("Acceso restringido – Solo personal autorizado.");
}

// Ruta protegida (Solo entras si iniciaste sesión)
app.get('/dashboard', isStaff, (req, res) => {
    res.send("¡Bienvenido al panel de Staff de Viva Chile RP! Aquí irá la calculadora.");
});

// Para cargar tu index.html y diseño
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));
