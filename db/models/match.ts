import { Model, Column, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, DataType, AllowNull, Default } from "sequelize-typescript";
import Users from './user'; 


@Table
export default class MATCH extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_match!: number;

    @Column
    stato!: string;  

    @Column
    livello!: string;  




    @Column({ type: DataType.TEXT('medium'), allowNull: false })  
    stato_partita!: string;


    @ForeignKey(() => Users)
    @Column(DataType.BIGINT)
    id_giocatore!: number;


    @BelongsTo(() => Users, { foreignKey: "id_giocatore", as: "giocatore" })
    giocatore!: Users;



}
