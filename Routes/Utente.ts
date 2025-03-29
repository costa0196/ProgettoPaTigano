import  express from "express";
import { Request,Response } from "express";
import validate from "../Middleware/validate";
import auth from "../Middleware/auth";
import controllerUtente from '../controllers/utentiController';
import controllerMatch from '../controllers/matchController';
import routerPartite from './Partita';

const router = express.Router()
router.use('/Partita',routerPartite)
const middlewareRicarica = [auth.checkToken,auth.validateUtente,validate.validate_body_Ricarica,validate.validateAdmin,validate.validate_mailUtente,validate.validate_tokenRicarica]
const middlewareVisualizzaStorico = [auth.checkToken,auth.validateUtente,validate.validate_tokenResiduo]
const middlewareVisualizzaStatoPartita = [auth.checkToken,auth.validateUtente,validate.validate_tokenResiduo]
const middlwarePartitaData = [auth.checkToken,auth.validateUtente,validate.validate_tokenResiduo,validate.validate_body_RicercaPartite,validate.checkbodyDate,validate.typeDate,validate.validDate,validate.checkInizioFine,validate.checkdataFutura]



router.post('/Ricarica',middlewareRicarica,async (req:Request,res:Response)=>{
    const esito = await controllerUtente.ricarica(req)
    res.statusCode=esito.statusCode
    res.json(esito)
  })



router.get('/:id_match/visualizzaStorico/', middlewareVisualizzaStorico, async (req:Request, res:Response)=>{
  const esito = await controllerMatch.visualizza_storico(req)
  res.statusCode=esito.statusCode
  res.json(esito)
})


router.get('/:id_match/VisualizzaStatoPartita/',middlewareVisualizzaStatoPartita,async (req:Request, res:Response)=>{
  const esito = await controllerUtente.statoPartita(req)
  res.statusCode=esito.statusCode
  res.json(esito);
})


router.get('/visualizzaPartiteUtente/',middlwarePartitaData, async (req:Request,res:Response) => {
  const esito = await controllerUtente.visualizzaPartitaUtente(req,res)
  res.statusCode=esito.statusCode
  res.json(esito);
})


router.get('/visualizzaClassifica/',async (req:Request, res:Response) => {
  const esito = await controllerUtente.classifica();
  res.statusCode=esito.statusCode
  res.json(esito);
})



router.get('/visualizzaUtenti/',async(req:Request, res:Response) => {
  const esito = await controllerUtente.visualizza_utenti(res);
  res.statusCode=esito.statusCode
  res.json(esito);
  //res.send('Visualizza sul terminale gli utenti')
})



router.get('/visualizzaPartite/',async(req:Request, res:Response) => {
  const esito = await controllerMatch.visualizza_partite(res);
  res.statusCode=esito.statusCode
  res.json(esito);
})

export default router