import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Esportiamo l'interfaccia
export interface PayloadJWTcreaPartita extends JwtPayload {
  ruolo:string
  id_giocatore:number
}

export interface MossaI{
  origin:number
  destination:number
  captures:number[]
}




declare module "express-serve-static-core" {
  interface Request {
    token:string
    tokenjwt:string
    e_mail:string
    id_giocatore:number
    mossa?:MossaI
    stato_partita?:string
    livello?:string
    ricaricaToken?:number
    ruolo:string;
    q_token:number
  }
}


