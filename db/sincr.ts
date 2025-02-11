import sequelize from './congfidb';

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database sincronizzato con successo!');
    }catch (error) {
        console.error('Errore durante la sincronizzazione del database:', error);
    }
};

export default syncDatabase;