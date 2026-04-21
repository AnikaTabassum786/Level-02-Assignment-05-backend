import express,{ Application, Request, Response } from "express";



const app:Application = express()


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());



// Basic route
// app.get('/', async (req: Request, res: Response) => {
//   const specialty = await prisma.specialty.create({
//     data:{
//       title:'Cardiology'
//     }
//   })

//   res.status(201).json({
//     success:true,
//     message:'API is working',
//     data: specialty
//   })
// });

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app