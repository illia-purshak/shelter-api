import {
  Column,
  CreateDateColumn,
  Entity,
  ForeignKey,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './projects.entities.js';
@Entity()
export class Layer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public position: number;

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

  @ManyToOne(() => Project, (project) => project.layers)
  project: Relation<Project>;
}
