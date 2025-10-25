import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Unique,
} from 'sequelize-typescript';
import { TokenSubject, TokenType } from 'src/enums/token.enum';

@Table({
  tableName: 'tokens',
  timestamps: true,
  paranoid: true, // Enable soft delete
})
export class Token extends Model<Token> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING(100))
  subject: TokenSubject;

  @Column({
    type: DataType.TEXT,
  })
  token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  phoneNo: string;

  @Column({
    type: DataType.ENUM(Object.values(TokenType).toString()),
  })
  tokenType: TokenType;

  @Column(DataType.DATE)
  expiry: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date | null;
}