import { Model, Column, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, DataType, AllowNull, Default } from "sequelize-typescript";
import Users from './user'; 
import Moves from "./move";

@Table
export default class MATCH extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_match!: number;

    @Column
    stato!: string;  // Stato della partita (es: "in corso", "finita")

    @Column
    livello!: string;  // Difficoltà (se contro CPU)

    @Default(0.15)
    @Column(DataType.FLOAT)
    costo_init!: number;

    @Default(0)
    @Column(DataType.FLOAT)
    costo_totale!: number;

    @Default(0)
    @Column(DataType.INTEGER)
    totmosse_tPlayer1!: number;  // Numero mosse totali del giocatore umano

    @Default(0)
    @Column(DataType.INTEGER)
    totmosse_tPlayer2!: number;

    @Column
    art_intel!: boolean;  // Se la partita è contro l'IA

    @Default(1)
    @Column(DataType.INTEGER)
    win!: number;  // Valore per la vittoria

    @Default(-0.5)
    @Column(DataType.INTEGER)
    lose!: number;  // Valore per la sconfitta

    @Column
    esito!: string;  // Esito della partita

    // Relazioni con Users (giocatore 1 e 2)
    @ForeignKey(() => Users)
    @Column(DataType.BIGINT)
    id_giocatore1!: number;

    @ForeignKey(() => Users)
    @Column(DataType.BIGINT)
    id_giocatore2!: number;

    @BelongsTo(() => Users, { foreignKey: "id_giocatore1", as: "giocatore1" })
    giocatore1!: Users;

    @BelongsTo(() => Users, { foreignKey: "id_giocatore2", as: "giocatore2" })
    giocatore2!: Users;

    // Relazione con Moves
    @HasMany(() => Moves, { foreignKey: "matchId" })
    mosse!: Moves[];
}
