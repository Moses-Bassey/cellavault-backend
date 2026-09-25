import { Table, Column, Model, DataType, ForeignKey, BelongsTo,} from 'sequelize-typescript';
import { Categories } from 'src/modules/categories/entities/categories.entity';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Set to true so products can exist before an image is uploaded
  })
  declare productImage: string;

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => Categories)
  declare categories: Categories;
}