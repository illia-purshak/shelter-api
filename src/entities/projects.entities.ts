import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column({ nullable: true })
  public icon?: string;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt: Date;
}
