import { Request, Response, NextFunction } from 'express';
import Msg from '../Utility/Msg/msg';
import Errore from '../Utility/Error/error';

// Middleware per gestire gli errori
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof Errore){
        const msg:Msg= new Msg('Errore',err.statusCode,err.message);
        console.log(err.stack)
        res.json(msg)
    }else{
        const statusCode = 501;
        const msg:Msg=new Msg('Errore',statusCode,'Errore interno al serves');
        res.json(msg)
    }

};

export default errorHandler;
