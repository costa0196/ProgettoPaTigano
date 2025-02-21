import { Model, Column, Table, PrimaryKey, AutoIncrement, HasMany, DataType, Unique, AllowNull } from "sequelize-typescript";
import MATCH from "./match";


@Table
export default class Users extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_giocatore!: number;


    @Unique
    @Column
    e_mail!: string;  

    @Column
    ruolo!: string;

    @AllowNull
    @Column({ type: DataType.FLOAT, defaultValue: 0 })  
    punteggio!: number;

    @AllowNull
    @Column({ type: DataType.FLOAT})  
    q_token!: number;


    @HasMany(() => MATCH, { foreignKey: "id_giocatore", as: "partiteComeGiocatore" })
    partiteComeGiocatore!: MATCH[];


}
