import express,{ Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";


const app:Application = express()

// app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Hello This is Assignment 05');
});

export default app