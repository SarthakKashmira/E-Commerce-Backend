const express = require("express");
const cors=require('cors');
const mongoose = require("mongoose");
const productsRouter=require("./routes/Product")
const categoriesRouter = require('./routes/Category');
const brandsRouter = require('./routes/Brands');
const userRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const orderRouter = require('./routes/Order');
const crypto=require("crypto")
const session=require('express-session');
const passport=require('passport');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;                 //localStrategy is the name of the authentication strategy we will use
const { User } = require("./model/User");
const { filterUser, isAuth, extractor } = require("./services/common");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const PORT = 3333;
const app = express();



//middlewares applied
app.use(express.static('build'))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json());  //convert data from frontend to json
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));


//middleware for logging the request made on the url
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request made to:
  ${req.originalUrl}`);
  next(); // Move on to the next phase
  };

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');  // Allow credentials
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use('/products',isAuth(),productsRouter.router);
app.use('/categories', isAuth(),categoriesRouter.router);
app.use('/brands', isAuth(), brandsRouter.router);
app.use('/users', isAuth(),userRouter.router);
app.use('/auth', authRouter.router);
app.use('/cart', isAuth(), cartRouter.router);
app.use('/order', isAuth(), orderRouter.router);
app.use(logRequest);                                       //logs the data of the url requested and the time of request


//passport authentication strategy
passport.use('local',new LocalStrategy(
  {usernameField:'email'},
  async function (email, password, done) {
    try{
      console.log("Local")
      const user=await User.findOne({email:email}).exec();
      if(!user) 
        { done(null,false,{message:"no such user exists"}); }  
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (crypto.timingSafeEqual(user.password, hashedPassword)) {
          const token=jwt.sign(filterUser(user),SECRET_KEY);
          console.log("Inside local",filterUser(user))
          done(null,{id:user.id,role:user.role,token});
        }else{
          done(null,false,{message:"invalid credentials"});
      }
    });
  }catch(err)
  {
      done(err);
  }
  }
));


const SECRET_KEY='SECRET_KEY';
//options to set for the jwt from passportjs
const opts = {}
opts.jwtFromRequest = extractor;
opts.secretOrKey = SECRET_KEY;

passport.use('jwt',new JwtStrategy(opts, async function(jwt_payload, done) {
  try{
      console.log("Jwt code running",jwt_payload);
      const user=await User.findById(jwt_payload.id);
      if (user) {
          return done(null,{id:user.id,role:user.role});                                //this is again calling serializer
      } else {
          return done(null, false);
          // or you could create a new account
      }
    }catch(err)
    {
      return done(err, false);
    }
}));

//it creates a session variable req.user on being called from the callbacks and is come from local strategy
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    try{
      console.log("serialize",user)
      return cb(null, {id:user.id,role:user.role});
    }catch(err)
    {
      return cb(err);
    }
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    try{
      console.log("deserialize")
     return cb(null, {id:user.id,role:user.role});
    }catch(err)
    {
      // console.log("error")
      return cb(err);
    }
  });
});



//payment intent creation
const stripe = require("stripe")('sk_test_51PfHW4RxcI6bHj6KZial8wJaWZ4RiavExwTWqpTYTw6JMuU2vhq5mftt25vllmcevSMHILum0ytWkJjoCTlQKQu600GrlkisSq');

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

async function main() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/ecomm");
      console.log("MongoDB started");
    } catch (error) {
      console.log(error);
    }
  }
main();

app.get("/", (req, res) => {
  res.status(200).send("Hello to ecommerce backend");
});



app.listen(PORT, () => console.log(`listening on https://localhost/${PORT}`));
