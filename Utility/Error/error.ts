
export default class Errore extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number
    ) {
        super(message);
        Object.setPrototypeOf(this, Errore.prototype);
    }
}
