import express,{ Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from 'cors'
import { categoryRouter } from "./app/module/category/category.route";
import { medicineRouter } from "./app/module/medicine/medicine.route";
import { adminRouter } from "./app/module/admin/admin.route";


const app:Application = express()

// app.use(express.urlencoded({ extended: true }));

app.use(cors({
// origin:process.env.APP_URL || "http://localhost:3000",
origin:process.env.APP_URL,
credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api/categories",categoryRouter)
app.use("/api/medicines",medicineRouter)
app.use("/api/users",adminRouter)


app.get('/', (req: Request, res: Response) => {
  res.send('Hello This is Assignment 05');
});

export default app