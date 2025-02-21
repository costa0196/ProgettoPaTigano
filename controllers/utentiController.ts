import utente from '../db/models/user'
import { Request,Response } from 'express';
import Msg from '../Utility/Msg/msg';
import Errore from '../Utility/Error/error';
import {Stato} from '../Utility/enum'
import Partita from '../db/models/match';
import {  EnglishDraughts as Draughts,  EnglishDraughtsComputerFactory as ComputerFactory,} from 'rapid-draughts/english';


const visualizza_utenti = async (res:Response) => {
    try {
        const users = await utente.findAll({raw:true});  // SELECT * FROM Users
        const response={init:"Operazione effettuata",statusCode:201,message:JSON.parse(JSON.stringify(users))};
        res.json(response)
        console.log(users);  // Mostra tutti gli utenti
    } catch (error) {
        console.error('Errore durante la query:', error);
    }
}

const ricarica = async(req:Request)=>{
    try{
        await utente.increment('q_token', {by:req.body.ricaricaToken, where: {e_mail: req.body.e_mail}});
        const msg:Msg= new Msg('Operazione effettuata',201,'Ricarica avvenuta con successo');
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
                    const msg:Msg= new Msg('Operazione effettuata',201,`Stato partita recuperato con successo:  ${partita.stato}`);
                    return msg
                }else if(partita.stato===Stato.InCorso){
                    if(partita.stato_partita){
                        const dati = JSON.parse(partita.stato_partita)
                        let game = Draughts.setup(dati.engine,dati.history);
                        console.log('La partita e in corso, ecco le mosse valide');
                        console.log(game.moves);
                        console.table(game.asciiBoard());
                        const msg:Msg= new Msg('Operazione effettuata',201,`Stato partita : ${partita.stato}. Puoi verificare lo stato da terminale`);
                        return  msg
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

const utenteController = {visualizza_utenti,ricarica,statoPartita};
export default utenteController