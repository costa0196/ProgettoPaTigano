interface IMsg {
    init: string;
    sc: number;
    mess: string;
}

export default class Msg implements IMsg {
    init: string = "Errore";
    sc: number;
    mess: string;

    constructor(sc: number, mess: string) {
        this.sc = sc;      
        this.mess = mess;  
    }
}
