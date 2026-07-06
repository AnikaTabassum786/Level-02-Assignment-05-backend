import express,{ Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from 'cors'
import { categoryRouter } from "./app/module/category/category.route";
import { medicineRouter } from "./app/module/medicine/medicine.route";
import { adminRouter } from "./app/module/admin/admin.route";
import { cartRouter } from "./app/module/cart/cart.route";
import { paymentRoutes } from "./app/module/payment/payment.route";



const app:Application = express()

// app.use(express.urlencoded({ extended: true }));

// app.post("/webhook",express.raw({type:"application/json"}),async(req:Request,res:Response)=>{
//   console.log("Webhook received:",req.body);
//   res.status(200).json({received:true})
// })

app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);



app.use(cors({
// origin:process.env.APP_URL || "http://localhost:3000",
origin:process.env.APP_URL,
credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/all-categories",categoryRouter)
app.use("/api/medicines",medicineRouter)
app.use("/api/users",adminRouter)
app.use("/api/cart",cartRouter)
app.use("/api/payment", paymentRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello This is Assignment 05');
});

export default app