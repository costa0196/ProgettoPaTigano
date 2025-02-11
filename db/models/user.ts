import { Model, Column, Table, PrimaryKey, AutoIncrement, HasMany, DataType, Unique } from "sequelize-typescript";
import MATCH from "./match";
import Moves from "./move";

@Table
export default class Users extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;

    @Column
    nome!: string;

    @Column
    cognome!: string;

    @Unique
    @Column
    e_mail!: string;  // Aggiunto Unique per evitare duplicati di email

    @Column
    password!: string;  // Sicuramente sarà criptata con bcrypt

    @Column({ type: DataType.INTEGER, defaultValue: 0 })  // Impostato valore di default 0
    punteggio!: number;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })  // Impostato valore di default 0
    q_token!: number;

    // Relazione con le partite (Match)
    @HasMany(() => MATCH, { foreignKey: "id_giocatore1", as: "partiteComeGiocatore1" })
    partiteComeGiocatore1!: MATCH[];

    @HasMany(() => MATCH, { foreignKey: "id_giocatore2", as: "partiteComeGiocatore2" })
    partiteComeGiocatore2!: MATCH[];

    // Relazione con le mosse (Moves)
    @HasMany(() => Moves, { foreignKey: "playerId" })
    mosse!: Moves[];
}
