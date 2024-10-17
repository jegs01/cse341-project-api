const express = require('express');
const cors = require('cors');
const animalRoutes = require('./routes/animalRoutes');
const zooRoutes = require('./routes/zooRoutes');
const viewRouter = require('./routes/githubUserRoutes');
const swaggerRouter = require('./routes/swaggerRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const GithubUser = require('./models/githubUserModel');

dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json());

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let githubUser = await GithubUser.findOne({ githubId: profile.id });

        if (!githubUser) {
          githubUser = await GithubUser.create({
            githubId: profile.id,
            username: profile.username
          });
        }

        return done(null, githubUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await GithubUser.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use('/', viewRouter);
app.use('/api/animal', animalRoutes);
app.use('/api/zoo', zooRoutes);
app.use('/', swaggerRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
