import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Layer } from './layers.entities.js';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description?: string;

  @Column({ nullable: true })
  public icon?: string;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  public updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt: Date;

  @OneToMany(() => Layer, (layer) => layer.project)
  public layers: Relation<Layer>[];
}
