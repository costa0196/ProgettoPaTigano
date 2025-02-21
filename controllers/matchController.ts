import Partita from '../db/models/match'
import Utente from '../db/models/user'
import Errore from '../Utility/Error/error';
import {  EnglishDraughts as Draughts,  EnglishDraughtsComputerFactory as ComputerFactory,} from 'rapid-draughts/english';
import Msg from '../Utility/Msg/msg';
import { Request,Response } from 'express';
import { MossaI } from '../Utility/interface';




const creaPartita = async(req:Request):Promise<Msg>=>{
  try{
      // Crea un nuouvo gioco
      const game = Draughts.setup();
      if(req.body.livello !== undefined){
        //Si costruisce la mossa dell'Ia in base al livello specificato nella richista: "facile","medlio","difficile"
        const IaMove=await getMoveForAI(game,req.body.livello)
        // L'Ia effettua la prima mossa
        game.move(IaMove)
        // Variabili valorizzate dalla storia del gioco e di riferimenti al turno attuale di gioco
        const engine= game.engine.data;
        const moves = game.history.moves;
        const boards= game.history.boards;
        const history ={moves,boards};
        const data = {engine,history};
        const dati = JSON.stringify(data)
        // Mostra sul terminale la tabella della partita con le pedine e le mosse valida che l'utente può effettuare
        console.table(game.asciiBoard());
        console.log(game.moves);
        // Scrive sul db la nuova partita con lo stato della partita dopo la prima mossa dell'Ia
        await Partita.create({ stato: 'In corso', livello: req.body.livello,totmosse_tPlayer:0,win:null,interr:null,esito:null,id_giocatore:req.id_giocatore,stato_partita:dati});
        const init:number=0.15;
        const token_aggiornato:number = req.q_token-init;
        await Utente.update({ q_token: token_aggiornato },{where: {id_giocatore:req.id_giocatore,},},);
      }
      else{
        const err:Errore = new Errore('Errore nella selezione del livello,body invalido',403)
        throw err;
      }     
      const msg:Msg= new Msg('Operazione effettuata',201,'Partita creata con successo. L asciboard e le mosse disponibili sono visibili sul terminale');
      return msg
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





export const getMoveForAI = async (game: any, level: string): Promise<MossaI> => {
    // Crea un giocatore IA a seconda del livello
    let aiPlayer;
    if(level==='difficile')  {
      aiPlayer = ComputerFactory.alphaBeta({ maxDepth: 7 }); // Livello forte
    }
    else if (level === 'medio') {
      aiPlayer = ComputerFactory.alphaBeta({ maxDepth: 3 }); // Livello medio
    }
    else{
      aiPlayer = ComputerFactory.random(); //livello facile
    }  

      const move = await aiPlayer(game);
      return move;
 


  };  


const visualizza_partite = async (res:Response):Promise<void> => {
    try {
        const partite = await Partita.findAll({raw:true});  // SELECT * FROM Users
        const response={init:"Operazione effettuata",statusCode:201,message:JSON.parse(JSON.stringify(partite))};
        res.json(response)
    } catch (error) {
        console.error('Errore durante la query:', error);
    }
}


const abbandona = async(req:any)=>{
  try{
    const partita=await Partita.findOne({where:{id_match:req.body.id_match,stato:'In corso',id_giocatore:req.id_giocatore}});
    if(partita!==null){
      // Se trova una partita in corso che corrisponda al match e al giocatore allora cambia lo stato in interrotta e aggiungi la penalità all'utente
      await partita.update({stato: 'Interrotta'},{where:{id_match:req.id_match}});
      await Utente.decrement('punteggio', {by: 0.5, where: {id_giocatore: req.id_giocatore}});
      const msg:Msg= new Msg('Operazione effettuata',201,'Partita interrotta con successo');
      return msg
    }
    else{
      const err:Errore = new Errore('Errore nell interruzione, probabilmente la partita non e in corso oppure l id_giocatore non è quello relativo al match',404);
      console.log(err.stack)
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



const visualizza_storico= async (req:Request)=>{
  try{
    const partita = await Partita.findOne({attributes:['stato_partita'], where:{id_match:req.params.id_match,id_giocatore:req.id_giocatore},raw:true});
    if (partita){
      const data = JSON.parse(partita.stato_partita);
      const dati = JSON.stringify(data.history.moves);
      let storico:string = dati.replace(/\\"/g, '"');
      const msg:Msg= new Msg('Operazione effettuata',201,storico);
      return msg
    }else{
      const error:Errore = new Errore('Partita non trovata',404);
      throw error
    }
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








const controllerPartita = {creaPartita,visualizza_partite,abbandona,visualizza_storico}
export default controllerPartita 