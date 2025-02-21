import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Errore from "../Utility/Error/error";
import { PayloadJWTcreaPartita } from '../Utility/interface';
import { Request,Response,NextFunction } from "express";
import { Ruolo } from "../Utility/enum";

dotenv.config();

// Funzione middleware per verificare se nella richiesta è presente l'header di autorizzazione
const checkToken = (req:Request , res: Response, next: NextFunction): void => 
    {
        try{
            if (req.headers.authorization)
            {
                const tokenJwt:string = req.headers.authorization.split(' ')[1];
                req.tokenjwt= tokenJwt;
                next()
            }else{
                const error:Errore = new Errore('Tokenjwt assente',403);
                next(error);
            }
        }catch {
            next(new Errore('Problema di autorizzazione',403)) 
        }
    
    }

// Funzione di middleware per la decodifica del TokenJwt
const validateUtente = (req: Request, res: Response, next: NextFunction): void => 
    { 
        const tokenjwt:string= req.tokenjwt
        try{
            const decoded =jwt.verify(tokenjwt,process.env.SECRET_KEY as string) as PayloadJWTcreaPartita;
            if(decoded.ruolo===Ruolo.Admin || decoded.ruolo===Ruolo.Player){
                req.ruolo=decoded.ruolo
                req.id_giocatore=decoded.id_giocatore;
                next()
            }else{
                const error:Errore = new Errore('Ruolo utente non valido',403);
                next(error);  
            }
            
        }catch{
            next(new Errore('TokenJwt non valido',403))
        }

    }



    

const auth = {checkToken,validateUtente};
export default auth;