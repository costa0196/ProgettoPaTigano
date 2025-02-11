import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import Errore from "../Error/error";

dotenv.config();

// Estendi Request in types.d.ts
declare global {
    namespace Express {
        interface Request {
            payload: any; // Puoi definire un tipo più preciso per `user`
        }
    }
}



const verifyToken = (req: Request, res: Response, next: NextFunction): void => 
    {
        const tokenJwt = req.headers.authorization;
        try{
            if (tokenJwt){
                next()
            }
            else{
                const error:Errore = new Errore('Tokenjwt assente',401);
                next(error);
            }
        }catch {
            next(new Errore('Problema interno',501)) 
        }
    
    }


// const verifyUtente = (req: Request, res: Response, next: NextFunction): void => 
//     {
//         const tokenJwt = req.headers.authorization?.split(' ')[1];
//         try{
//             if (tokenJwt){
//                 const decoded = jwt.verify(tokenJwt, process.env.SECRET_KEY as string);
                
//                 }
//                 next()
//             }
//             else{
//                 const error:Errore = new Errore('booooo',401);
//                 next(error);
//             }
//         }catch {
//             next(new Errore('Problema interno',501)) 
//         }
    
//     }


    

const auth = {verifyToken};
export default auth;