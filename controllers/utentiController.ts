import utente from '../db/models/user'
import { Request,Response } from 'express';
import Msg from '../Utility/Msg/msg';
import Errore from '../Utility/Error/error';
import {Stato} from '../Utility/enum'
import Partita from '../db/models/match';
import {  EnglishDraughts as Draughts,  EnglishDraughtsComputerFactory as ComputerFactory,} from 'rapid-draughts/english';
import { Op, literal,fn } from "sequelize";



const visualizza_utenti = async (res:Response):Promise<Msg> => {
    try {
        const users = await utente.findAll({raw:true});  // SELECT * FROM Users
        const utenti:string= JSON.stringify(users);
        const msg:Msg= new Msg('Operazione effettuata',200,utenti);
          return msg
        }catch(error){
            if(error instanceof Errore){
                console.log(error.stack);
                console.log(error.message)
                const msg:Msg= new Msg('Errore',error.statusCode,error.message); 
                return msg 
                }else{
                return new Msg('Errore', 500, 'errore sconosciuto');
                }
        }
}



const visualizzaPartitaUtente = async (req:Request,res:Response) => {
    try{
        //console.log(typeof req.body.dataInizio);
        const inizioGiorno = new Date(`${req.body.dataInizio}T00:00:00.000Z`);
        const fineGiorno = new Date(`${req.body.dataFine}T23:59:59.999Z`);
        console.log(inizioGiorno)
        const partite = await Partita.findAll({
            attributes: ['id_match','stato','livello'],
            raw: true,
            where: {
              createdAt: {
                [Op.between]: [inizioGiorno, fineGiorno] // Cerca tra inizio e fine della giornata
              },
              id_giocatore: req.id_giocatore 
            }
          });
          const partita:string= JSON.stringify(partite);

          const msg:Msg= new Msg('Operazione effettuata',200,partita);
          return msg

    }catch(error){
        if(error instanceof Errore){
            console.log(error.stack);
            console.log(error.message)
            const msg:Msg= new Msg('Errore',error.statusCode,error.message);
            console.log(msg)   
            return msg 
            }else{
            return new Msg('Errore', 500, 'errore sconosciuto');
            }
    }

}


const ricarica = async(req:Request)=>{
    try{
        await utente.increment('q_token', {by:req.body.ricaricaToken, where: {e_mail: req.body.e_mail}});
        const msg:Msg= new Msg('Operazione effettuata',200,'Ricarica avvenuta con successo');
        return msg
    }catch(error:unknown){
        if(error instanceof Errore){
        console.log(error.stack);
        console.log(error.message)
        const msg:Msg= new Msg('Errore',error.statusCode,error.message);
        console.log(msg)   
        return msg 
        }else{
        return new Msg('Errore', 500, 'errore sconosciuto');
        }
    }

}

const statoPartita= async(req:Request)=>{
    try{
        if(req.params.id_match){
            const partita = await Partita.findOne({attributes:['stato','stato_partita'],where:{id_giocatore:req.id_giocatore,id_match:req.params.id_match}});
            if(partita){
                if(partita.stato===Stato.Interrotta || partita.stato ===Stato.Lose || partita.stato===Stato.Win){
                    const msg:Msg= new Msg('Operazione effettuata',200,`Stato partita recuperato con successo:  ${partita.stato}`);
                    return msg
                }else if(partita.stato===Stato.InCorso){
                    if(partita.stato_partita){
                        const dati = JSON.parse(partita.stato_partita)
                        let game = Draughts.setup(dati.engine,dati.history);

                        const stringArray:string[] = game.moves.map(obj => JSON.stringify(obj));


                        const asciboard = game.asciiBoard();
                        const l = asciboard.split("\n");
                        const lines=l.concat(stringArray)

                        const msg:Msg= new Msg('Operazione effettuata',200,lines);
                        return msg

                    }else{
                        const error:Errore = new Errore('Errore nel recupero della partita',415);
                        throw error
                    }
                }else{
                    const error:Errore = new Errore('Errore nella valutazione dello stato della partita',415);
                    throw error
                }
            }else{
                const err:Errore = new Errore('Partita non trovata, id_giocatore e id_match non corrispondono ad una partita nel db',404)
                throw err;
            }
        }else{
            const err:Errore = new Errore('Manca il riferimento alla partia, partita non trovata',404)
            throw err;
        }
    }catch(err:unknown){
        //const err:Errore = new Errore('Errore nella creazione della partita, utente non trovato',404)
        if(err instanceof Errore){
          const msg:Msg= new Msg('Errore',err.statusCode,err.message);   
          console.log(err.stack)
          return msg 
        }else{
          return new Msg('Errore', 500, 'Errore sconosciuto');
        }
    
    
      }
    

}


const classifica = async() =>{
    const classifica = await Partita.findAll({
      attributes: [
        'id_giocatore',
        [fn('COUNT', literal("CASE WHEN stato = 'Win' THEN 1 ELSE NULL END")), 'numero_vittorie']
      ],
      group: ['id_giocatore'],
      order: [[literal('numero_vittorie'), 'DESC']],
      raw: true
    });
    const classific = JSON.stringify(classifica)   
    const msg:Msg= new Msg('Operazione effettuata',200,`Ecco la classifica:  ${classific}`);
    return msg
}

const utenteController = {visualizza_utenti,ricarica,statoPartita,visualizzaPartitaUtente,classifica};
export default utenteController