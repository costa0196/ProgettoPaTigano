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


  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  }




);

seedDatabase();


export default sequelize;