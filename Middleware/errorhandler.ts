import { Request, Response, NextFunction } from 'express';
import Msg from '../Msg/msg';
import Errore from '../Error/error';

// Middleware per gestire gli errori
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const msg:Msg= new Msg(err.statusCode,err.message)
    res.json(msg)

};

export default errorHandler;
