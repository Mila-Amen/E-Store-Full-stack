import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
config();
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { auth } from "./middlewares.js/authentication.js";
import { Stripe } from "stripe";
/* import cors from "cors"; */
import ImageModel from "./models/imageSchema.js";
import { Readable } from "stream";
import cookieParser from "cookie-parser";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const PORT = 5001;

//make a mongoose connection
try {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "e-store" });
  console.log("mongodb connected!");
} catch (err) {
  console.log(err.message);
}

//creating server
const app = express();

//cors middleware
/* app.use(cors({ origin: "http://localhost:5001", credentials:true })); */
/* app.use(cors({ origin: "http://localhost:5173", credentials: true })); */ //We replaced it with express.static

app.use(express.static("views"))
const endpointSecret = process.env.SIGNING_SECRET;
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    console.log("webhook is working!")
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(session)
            //ADD DATA TO DB...
            //converting string meta data to object form
            const products = session.metadata?.productIds
                .split(",")
                .map(id => new mongoose.Types.ObjectId(id));
            const userId = new mongoose.Types.ObjectId(session.metadata?.userId);
            const totalPrice = parseInt(session.amount_total.toFixed(2))
            const order = await OrderModel.create({
                userId,
                products,
                totalPrice
            })
            console.log(order)
            // Then define and call a function to handle the event checkout.session.completed
            session.break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
});
//json middleware
app.use(express.json()); // parse any incoming json data and store in req.body


//cookie parser middleware (it will parse your header and give cookies data in req.cookies)
app.use(cookieParser())

app.post("/create-checkout-session", auth, async (req, res) => {
  const { carts } = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items: carts.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image[0]],
          },
          unit_amount: parseInt(item.price * 100),
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `https://e-store-full-stack.onrender.com/?success=true`,
    cancel_url: `https://e-store-full-stack.onrender.com/?canceled=true`,
  });

  res.send({ id: session.id });
});

//middleware (its a function , it receives 3 parameters , req,res,next) ,can send back response to client or forward your request to next handler

//custom
/* function log(req, res, next) {
  console.log("received Request on ", req.url);
  next();
}
function checkMethods(req, res, next) {
  console.log("we received request with method ", req.method);
  next();
}

app.use([express.json(), checkMethods, log]); */

/* app.use((req, res, next) => {
  if (req.method === "DELETE") {
    next("You don't accept any delete request");
  } else {
    next();
  }
}); */

//Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", auth, orderRoutes);

app.get("/images/:filename", async (req, res, next) => {
  try {
    const image = await ImageModel.findOne({ filename: req.params.filename });
    if (image) {
      const readStream = Readable.from(image.data);
      readStream.pipe(res);
    } else {
      next("no such a file is found");
    }
  } catch (err) {
    next(err);
  }
});

//error handling middleware
//next(err)
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ success: false, message: err.message });
});

//page not found error handler
app.use((req, res, next) => {
  res
    .status(404)
    .send({ success: false, message: "no such route exist in our server!" });
});

app.listen(PORT, () => console.log("server is running 🚀 on port: ", PORT));

// hashing bcrypt
// bcrypt.hashSync(plain password, saltrounds) ..hashing password
// bcrypt.compareSync(plain password, hashed password) verifing password

// authentication Jsonwebtoken
// jwt.sign(payload, secret key) create token
// jwt.verify(token, secret key) verifying token
