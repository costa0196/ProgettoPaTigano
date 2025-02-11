import  express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import user_controller from "./controllers/userController";
import auth from "./Middleware/auth"
import syncDatabase from "./db/sincr";
import errorHandler from "./Middleware/errorhandler";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
syncDatabase();


/* const autorizzaPlayer= (req:Request,res:Response,next:NextFunction):any =>{
  console.log('ciao')
} */

app.post('/creaPartita',auth.verifyToken,(req, res)=>{
  res.send('partita  ok')
});


app.get('/',(req:any, res:any) => {
    res.send('hello y53y')
})



app.use(errorHandler);

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);