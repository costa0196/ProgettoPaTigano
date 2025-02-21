import { Sequelize } from 'sequelize-typescript';
import seedDatabase from './seeds';


const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'mydb',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'passw',
    dialect: 'mysql',
    host: process.env.DB_HOST || 'db',
    models: [__dirname + '/models'],
  });


const initializeDatabase = async () => {
  try {
      // Autenticazione della connessione al database
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Sincronizzazione del database, sincronizza i modelli con le tabelle.
      await sequelize.sync({ alter: true });
      await seedDatabase();
      console.log('Database sincronizzato con successo!');
  } catch (error) {
      console.error('Errore durante la connessione o sincronizzazione del database:', error);
  }
};

// Esegui la funzione per inizializzare il database
initializeDatabase();





export default sequelize;