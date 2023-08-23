import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import 'dotenv/config';
import AuthRoute from "./Routers/AuthRoute.js";
import UserRoute from "./Routers/UserRoute.js";
import PostRoute from "./Routers/PostRoute.js";
import configureProxy from "./setupProxy.js";
const app = express();
configureProxy(app)
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors())

dotenv.config();

// console.log(process.env.PORT);

mongoose.connect(process.env.MONGO_BDS
)
    .then(() => app.listen(process.env.PORT, () => console.log("Listening")))
    .catch((err) => { console.log(err) })
    ;

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);