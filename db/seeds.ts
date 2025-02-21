import utente from './models/user';



const seedDatabase = async ():Promise<void> => {
    try {
        const usersCount = await utente.count(); // Conta i record nella tabella Users
        
        if (usersCount === 0) {
            // Se non ci sono utenti, aggiungi i dati di seed
            await utente.bulkCreate([
                {
                    e_mail: 'costa@gmail.com',
                    ruolo:'player',
                    punteggio: 0,
                    q_token: 0.2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    e_mail: 'alessiob@gmail.com',
                    ruolo:'player',
                    punteggio: 0,
                    q_token: 15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    e_mail: 'filippo@gmail.com',
                    ruolo:'player',
                    punteggio: 0,
                    q_token: 15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    e_mail: 'dama@gmail.com',
                    ruolo:'admin',
                    punteggio: null,
                    q_token: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);
            console.log("Dati di seed inseriti.");
        } else {
            console.log("I dati di seed sono già presenti.");
        }
    } catch (error) {
        console.error('Errore durante il seeding:', error);
    }
};

export default seedDatabase;