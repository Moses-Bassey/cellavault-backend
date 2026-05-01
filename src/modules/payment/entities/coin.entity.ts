// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   PrimaryKey,
//   Default,
//   CreatedAt,
//   UpdatedAt,
//   AllowNull,
//   Index,
// } from 'sequelize-typescript';

// @Table({
//   tableName: 'mck_coins',
//   timestamps: true,
// })
// export class Coin extends Model<Coin> {
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   declare id: string;

//   @AllowNull(false)
//   @Index('idx_coins_passenger_createdAt')
//   @Column(DataType.UUID)
//   declare passengerId: string;

//   /**
//    * Positive = credit
//    * Negative = debit
//    */
//   @AllowNull(false)
//   @Column(DataType.INTEGER)
//   declare delta: number;

//   @CreatedAt
//   declare createdAt: Date;

//   @UpdatedAt
//   declare updatedAt: Date;
// }
