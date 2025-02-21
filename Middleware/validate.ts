import utente from '../db/models/user';
import Errore from "../Utility/Error/error";
import Partita from '../db/models/match'
import {  EnglishDraughts as Draughts,  EnglishDraughtsComputerFactory as ComputerFactory,} from 'rapid-draughts/english';
import { Request,Response,NextFunction } from "express";
import {Livello,Ruolo,Stato} from '../Utility/enum';
import { MossaI } from '../Utility/interface';

// Valida per tutte le rotte eccetto la rotta Mossa
// Middleware di verifica del token residuo, si applica su tutte le richieste eccetto per quella delle mosse della partita    
const validate_tokenResiduo =  async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const user = await utente.findOne({
            attributes: ['q_token','ruolo'],
            where:{id_giocatore:req.id_giocatore},
            raw: true 
        })
        const init:number=0.15;
        if (user === null){
            let error:Errore = new Errore('Utente non trovato',404);
            next(error)
        }else if(user.ruolo===Ruolo.Admin || req.ruolo===Ruolo.Admin){
            let error:Errore = new Errore('L admin non e un player. Non puo creare partite',404);
            next(error)
        }else{
            if(user.q_token>init){
                req.q_token=user.q_token
                next()
            }else{
                let error:Errore = new Errore('Quantita token insufficente,Unauthorized',401);
                next(error)
            } 
        }
                       
         
    }catch{
        next(new Errore('Errore sui token dell utente',404))
    }
}






// Valida per CreaPartita
// Funzione di middleware per verificare che l'utente non abbia già una partita in corso

const validate_partite_in_corso =  async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        // Usando sequelize-typescript non c'è bisogno di tipizzare la variabile stato
        //  perchè il tipo si inferisce dalla definizione del modello
        const stato = await Partita.findOne({
                attributes: ['stato'],
                where:{
                    id_giocatore:req.id_giocatore,
                    stato:'In corso'
                },
                raw: true 
            })
        if(stato){
            const error:Errore = new Errore('Sei impegnato già in un altra partita',404);
            next(error);
        }else{
            next()
        }
                    
    }catch{
        next(new Errore('Errore nella verifica di piu partite per l utente',404))
    }
}

// Valida per CreaPartita
// Funzione di middleware per verificare il livello della partita
const validate_livello=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {livello}:any = req.body;
        if (!livello || !Object.values(Livello).includes(livello)) {
            const error:Errore = new Errore('Livello non consentito',404);
            next(error);
        }else{
            next()
        }
    }catch{
        next(new Errore('Errore nel body della richiesta',404))
    }

}




// Valida per Mossa
//Funzione di Middleware per il recupero nel db della partita, veifica che l'id del match della richiesta sia associato alla partita
const validateRecuperaPartita= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const body=req.body;
        const partita =await Partita.findOne({
            attributes: ['stato_partita','livello','id_giocatore','stato'],
            where:{id_match:body.id_match},
            raw: true 
        })
        
        if (partita !== null && req.id_giocatore===partita.id_giocatore && partita.stato ===Stato.InCorso&& req.ruolo!==Ruolo.Admin){
            req.stato_partita=partita.stato_partita;
            req.livello=partita.livello
            next()
    
        }else{
            let error:Errore = new Errore('Partita non trovata per il giocatore che vuole effettuare la mossa',404);
            next(error)
        }
    }catch{
        let error:Errore = new Errore('Errore nel recupero della partita',404);
        next(error)
    }

}



// Funzione di middleware per convalidare l'origine della mossa. Altrimenti rimane possibile iniziare la mossa da una valore al di fuori dal range
// Stesse considerazioni per la destinazione e le catture.
const validateOrigin = (req:Request,res:Response,next:NextFunction)=>{
    try{
        const origin:number=req.body.origin;
        if(typeof origin==='number'){
            if(origin >=0 && origin <32){
                next()
            }else{
                let error:Errore = new Errore('Origine della mossa non valido',422);
                next(error)
            }
        }else{
            let error:Errore = new Errore('Formato dell origine della mossa sbagliato',400);
            next(error)
        }

    }catch{
        let error:Errore = new Errore('Errore nella definizione dell origine della mossa',400);
        next(error)
    }
}


const validateDestination = (req:Request,res:Response,next:NextFunction)=>{
    try{
        const destination:number=req.body.destination;
        if(typeof destination==='number'){
            if(destination >=0 && destination <32){
                next()
            }else{
                let error:Errore = new Errore('destinazione della mossa non valido',422);
                next(error)
            }
        }else{
            let error:Errore = new Errore('Formato della destinazione della mossa sbagliato',400);
            next(error)
        }

    }catch{
        let error:Errore = new Errore('Errore nella definizione della destinazione della mossa',400);
        next(error)
    }
}


const validateCaptures= (req:Request,res:Response,next:NextFunction)=>{
    try{
        const captures:number[]=req.body.captures;
        if(captures){
            if(captures.filter(num=>num<=0 || num>31).length ==0){
                next()
            }else{
                let error:Errore = new Errore(' catture nella mossa non valido',422);
                next(error)
            }
        }else{
            let error:Errore = new Errore('Formato delle catture della mossa sbagliato',400);
            next(error)
        }

    }catch{
        let error:Errore = new Errore('Errore nella definizione delle catture della mossa',400);
        next(error)
    }
}


// Funzione di middlware che costruisce la mossa e controlla se la mossa risulta valida per lo stato attuale della partita preso dal db
const validateMossa= (req:Request,res:Response,next:NextFunction)=>{
    try{
        const body=req.body;
        const mossa:MossaI = {
            origin: body.origin,         
            destination: body.destination,
            captures: body.captures
        }
        req.mossa=mossa;
        const stato_partita=req.stato_partita;
        if(stato_partita !== undefined){
            const dati = JSON.parse(stato_partita);
            const game = Draughts.setup(dati.engine,dati.history);
            if(game.isValidMove(mossa)){
                next()
            }else{
                let error:Errore = new Errore('Mossa non valida',411);
                next(error)
            }
        }else{
            let error:Errore = new Errore('Errore nella lettura dello stato',411);
            next(error)
        }



    }catch{
        let error:Errore = new Errore('Problema nella convalida della mossa',101);
        next(error)
    }
}

// Valida per la rotta "Ricarica"
const validateAdmin= async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const user = await utente.findOne({
            attributes: ['id_giocatore','ruolo'],
            where:{id_giocatore:req.id_giocatore},
            raw: true 
        })
        if(user){
            if (req.ruolo===Ruolo.Admin && user.ruolo===Ruolo.Admin){
                next()
            }else{
                let error:Errore = new Errore('Utente non valido',410);
                next(error)
            }
        }else{
            let error:Errore = new Errore('Utente non trovato',404);
            next(error)
        }
    }catch{
        let error:Errore = new Errore('Problema nella convalida dell admin',101);
        next(error)
    }

}

//Valida per rotta Ricarica
//Verifica la compatibilità della mail del giocatore
const validate_mailUtente= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const body=req.body;
        const giocatore =await utente.findOne({attributes:['ruolo'], where:{e_mail:body.e_mail},raw: true })
        
        if (giocatore && giocatore.ruolo===Ruolo.Player){
            next()
    
        }else{
            let error:Errore = new Errore('E_mail non valida',403);
            next(error)
        }
    }catch{
        let error:Errore = new Errore('Errore nella mail dell utente da ricaricare',404);
        next(error)
    }

}

//Valida per Ricarica
//Convalida il formato di token
const validate_tokenRicarica= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        if(req.body.ricaricaToken>0){
            next()  
        }else{
            let error:Errore = new Errore('Token di ricarica non valido',404);
            next(error)
        }
    }catch{
        let error:Errore = new Errore('Errore nella mail dell utente da ricaricare',404);
        next(error)
    }

}





const validate = {validate_partite_in_corso,validate_tokenResiduo,validateRecuperaPartita,validateMossa,validate_livello,validateOrigin,validateDestination,validateCaptures,validate_mailUtente,validate_tokenRicarica,validateAdmin}
export default validate