interface IMsg {
    init: string;
    statusCode: number;
    message: string;
}

export default class Msg implements IMsg {
    constructor(
        public readonly init: string,
        public readonly statusCode: number,
        public readonly message: string
    ) {}
}
