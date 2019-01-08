import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
// ... extends BaseEntity - allow use something like User.create({})
export class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 }) email: string;

  @Column("text") password: string;
}
