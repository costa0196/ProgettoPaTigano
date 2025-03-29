import  express from "express";
import dotenv from "dotenv";
import auth from "./Middleware/auth"
import validate from "./Middleware/validate"
import seq from "./db/congfidb";
import errorHandler from "./Middleware/errorhandler";
import controllerMatch from "./controllers/matchController";
import controllerUtente from './controllers/utentiController';
import controllerMossa from "./controllers/mossaController";
import { Request,Response } from "express";
//import routerPartita from "./Partita";
import routerUtente from "./Routes/Utente";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
seq;









//app.use('/Partita',routerPartita)
app.use('/Utenti',routerUtente)

/* app.post('/Partita/creaPartita',validate.validate_tokenResiduo,validate.validate_partite_in_corso,validate.validate_livello,async (req:Request,res:Response)=>{
  const esito = await controllerMatch.creaPartita(req);
  res.statusCode=esito.statusCode
  res.json(esito)
}); */


/* const val = [validate.validateRecuperaPartita,validate.validateOrigin,validate.validateDestination,validate.validateCaptures,validate.validateMossa]
app.post('/Partita/:id_match',val,async (req:Request,res:Response)=>{
  const esito = await controllerMossa.avanzamentoGioco(req)
  res.statusCode=esito.statusCode
  res.json(esito)
});
 */


/* app.post('/Partita/Abbandona/:id_match',validate.validate_tokenResiduo,async (req:Request,res:Response)=>{
  const esito = await controllerMatch.abbandona(req)
  res.statusCode=esito.statusCode
  res.json(esito)
}) */

/* 
app.post('/Ricarica',validate.validateAdmin,validate.validate_mailUtente,validate.validate_tokenRicarica,async (req:Request,res:Response)=>{
  const esito = await controllerUtente.ricarica(req)
  res.statusCode=esito.statusCode
  res.json(esito)
}) */


/* app.get('/visualizzaStorico/:id_match',validate.validate_tokenResiduo, async (req:Request, res:Response)=>{

  const esito = await controllerMatch.visualizza_storico(req)
  res.statusCode=esito.statusCode
  res.json(esito)
}) */


/* app.get('/VisualizzaStatoPartita/:id_match',validate.validate_tokenResiduo,async (req:Request, res:Response)=>{
  const esito = await controllerUtente.statoPartita(req)
  res.statusCode=esito.statusCode
  res.json(esito);
})
 */






/* app.get('/visualizzaUtenti',(req:Request, res:Response) => {
    controllerUtente.visualizza_utenti(res);
    //res.send('Visualizza sul terminale gli utenti')
}) */

/* 
app.get('/visualizzaPartite',(req:Request, res:Response) => {
  controllerMatch.visualizza_partite(res);
}) */


app.use(errorHandler);

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);