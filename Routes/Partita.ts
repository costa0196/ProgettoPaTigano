import  express from "express";
import auth from "../Middleware/auth"
import validate from "../Middleware/validate"
import controllerMossa from "../controllers/mossaController";
import controllerMatch from "../controllers/matchController"
import { Request,Response } from "express";


const router = express.Router()
const middlwareCreaPartita= [validate.validate_tokenResiduo,validate.validate_partite_in_corso,validate.validate_body_CreaPartita,validate.validate_livello];
const middlewareMossa= [validate.validateRecuperaPartita,validate.validate_body_Mossa,validate.validateOrigin,validate.validateDestination,validate.validateCaptures,validate.validateMossa]
router.use([auth.checkToken,auth.validateUtente])



router.post('/CreaPartita',middlwareCreaPartita,async (req:Request,res:Response)=>{
    const esito = await controllerMatch.creaPartita(req)
    res.statusCode=esito.statusCode
    res.json(esito)
  })


router.post('/:id_match/Mossa',middlewareMossa,async (req:Request,res:Response)=>{
const esito = await controllerMossa.avanzamentoGioco(req)
res.statusCode=esito.statusCode
res.json(esito)
});


router.post('/:id_match/Abbandona',validate.validate_tokenResiduo,async (req:Request,res:Response)=>{
    const esito = await controllerMatch.abbandona(req)
    res.statusCode=esito.statusCode
    res.json(esito)
  })



export default router;