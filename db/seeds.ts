import utente from './models/user';



const seedDatabase = async ():Promise<void> => {
    try {
        const usersCount = await utente.count(); // Conta i record nella tabella Users
        
        if (usersCount === 0) {
            // Se non ci sono utenti, aggiungi i dati di seed
            await utente.bulkCreate([
                {
                    nome: 'Costantino',
                    cognome: 'Tigano',
                    e_mail: 'costa@gmail.com',
                    password: 'hashedpassword1',  // Cripta la password se necessario
                    punteggio: 0,
                    q_token: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nome: 'Alessio',
                    cognome: 'Brugiavini',
                    e_mail: 'alessiob@gmail.com',
                    password: 'hashedpassword2',
                    punteggio: 0,
                    q_token: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nome: 'Massimo',
                    cognome: 'Dama',
                    e_mail: 'dama@gmail.com',
                    password: 'hashedpassword3',
                    punteggio: 0,
                    q_token: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
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
