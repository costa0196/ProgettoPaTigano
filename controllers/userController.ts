import utente from '../db/models/user'


const visualizza_utenti = async ():Promise<void> => {
    try {
        const users = await utente.findAll();  // SELECT * FROM Users
        console.log(users);  // Mostra tutti gli utenti
        console.log('eseguio getUsers() DA CONTROLLER')
    } catch (error) {
        console.error('Errore durante la query:', error);
    }
}


const controller = {visualizza_utenti}
export default controller 