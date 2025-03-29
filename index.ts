import  express from "express";
import dotenv from "dotenv";
import seq from "./db/congfidb";
import errorHandler from "./Middleware/errorhandler";
import routerUtente from "./Routes/routesUtente";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
seq;


app.use('/Utenti',routerUtente)
app.use(errorHandler);
app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);