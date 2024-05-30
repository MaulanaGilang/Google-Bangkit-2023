// Import required modules
import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken'; // Import jwt module
import bcrypt from 'bcrypt';

// Create an instance of PrismaClient
const prisma = new PrismaClient();
const PORT = process.env.PORT;

// Set up passport JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_secret_key', // Replace with your own secret key
};

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);


// Create Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Endpoint for user registration
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, telp } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        telp,
      },
    });

    // Return the registered user details
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
});

// Endpoint for user login
app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (error:any, user:any, info:any) => {
      try {
        if (error || !user) {
          return res.status(401).json({ error:  'Invalid credentials' });
        }
  
        const token = jwt.sign({ id: user.id }, jwtOptions.secretOrKey);
        return res.json({ token });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
