import Partita from '../db/models/match'
import Utente from '../db/models/user'
import {  EnglishDraughts as Draughts,  EnglishDraughtsComputerFactory as ComputerFactory,} from 'rapid-draughts/english';
import { Request } from 'express'
import Msg from '../Utility/Msg/msg';
import Errore from '../Utility/Error/error';
import {getMoveForAI} from './matchController';


// Funzione che gestisce l'intero gioco. Valuta volta per volta lo stato della partita
const avanzamentoGioco = async (req:Request) => {
  try{
    const mossa = req.mossa;
    // body=req.body;
    const stato_partita=req.stato_partita;
    const livello=req.livello
    if(mossa!== undefined && stato_partita!== undefined &&  typeof livello==='string'){
        const dati = JSON.parse(stato_partita)
        //Recupera i dati di gioco, turno e storico. Così è in grado di ricostruire il game      
        let game = Draughts.setup(dati.engine,dati.history);
        // l'utente effettua la mossa e aggiorna la quantità dei token disponibili
        game.move(mossa);
        const token=await Utente.findOne({ attributes: ['q_token'],where:{id_giocatore:req.id_giocatore}});
        if (token){
          const t = token.q_token;
          const costo_mossa:number=0.125;
          const token_aggiornato:number=t-costo_mossa
          await Utente.update({ q_token: token_aggiornato },{ where: {id_giocatore: req.id_giocatore,},},);
        }else{
          const err:Errore = new Errore('Errore nell aggiornamento dei token',400);
          console.log(err.stack)
          throw err;
        }

            // Controlla il caso in cui l'utente vince
        if(game.engine.data.board.dark==0){
            //console.log(game.status);
            //console.log('Hai vinto');
            // Se ha vinto, allora si salva la partita
            const stato_partita = convertPartita(game.engine.data,game.history.moves,game.history.boards)
            await Partita.update({ stato_partita:stato_partita,stato:'Win'},{ where: { id_match: req.params.id_match } })      
            await Utente.increment('punteggio', {by: 1, where: {id_giocatore: req.id_giocatore}});
            const msg:Msg= new Msg('Operazione effettuata',200,'Hai vinto!');
            return msg
        }else{
            const mossa_ia = await getMoveForAI(game,livello);
            game.move(mossa_ia);
            //Analogo al coso in cui vince il player
            if(game.engine.data.board.light==0){
                console.log(game.status);
                const stato_partita = convertPartita(game.engine.data,game.history.moves,game.history.boards)
                await Partita.update({ stato_partita:stato_partita,stato:'Lose'},{ where:{ id_match: req.params.id_match } }) 
                const msg:Msg= new Msg('Operazione effettuata',200,'Hai perso!');
                return msg  
            }else{
              //  Caso in cui nessuno dei due ha vinto, si continua con l'avanzamento del gioco, con un'altra mossa del player
                const stato_partita = convertPartita(game.engine.data,game.history.moves,game.history.boards)
                await Partita.update({ stato_partita:stato_partita},{ where:{ id_match: req.params.id_match } });
                //console.table(game.asciiBoard());
                //console.log(game.moves)
          }
        }    

      const stringArray:string[] = game.moves.map(obj => JSON.stringify(obj));


      const asciboard = game.asciiBoard();
      const l = asciboard.split("\n");
      const lines=l.concat(stringArray)

      const msg:Msg= new Msg('Operazione effettuata',200,lines);
      return msg
    }else{
        const err:Errore = new Errore('Errore nella mossa',403);
        console.log(err.stack)
        throw err;
    }
    
  }catch(err:unknown){
      if(err instanceof Errore){
        const msg:Msg= new Msg('Errore',err.statusCode,err.message);   
        console.log(err.stack)
        return msg 
      }else{
        return new Msg('Errore', 500, 'Errore sconosciuto');
      }
    }

}
    

const convertPartita=(engine:any,moves:any,boards:any):string=>{
  const history={moves,boards};
  const dati = {engine,history};
  return JSON.stringify(dati)
}

const controllerMossa = {avanzamentoGioco}
export default controllerMossa 