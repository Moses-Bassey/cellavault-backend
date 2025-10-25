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
  public declare id: string;

  @Column(DataType.STRING(100))
  public subject: TokenSubject;

  @Column({
    type: DataType.TEXT,
  })
  public token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  })
  public email: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  public phoneNo: string;

  @Column({
    type: DataType.ENUM(Object.values(TokenType).toString()),
  })
  public tokenType: TokenType;

  @Column(DataType.DATE)
  public expiry: Date;

  @CreatedAt
  public declare createdAt: Date;

  @UpdatedAt
  public declare updatedAt: Date;

  @DeletedAt
  public declare deletedAt: Date | null;
}