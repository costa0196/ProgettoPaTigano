import { Model, Column, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt,DataType } from "sequelize-typescript";
import Users from "./user";
import MATCH from "./match";

@Table
export default class Moves extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    mossa_id!: number;

    @ForeignKey(() => MATCH)
    @Column(DataType.BIGINT)
    matchId!: number;

    @ForeignKey(() => Users)
    @Column(DataType.BIGINT)
    playerId!: number;

    @Column
    posizioneIniziale!: string;  // Es: "E2"

    @Column
    posizioneFinale!: string;  // Es: "E4"

    @CreatedAt
    @Column
    createdAt!: Date;

    // Relazioni con MATCH
    @BelongsTo(() => MATCH)
    match!: MATCH;

    // Relazioni con Users
    @BelongsTo(() => Users)
    player!: Users;
}
