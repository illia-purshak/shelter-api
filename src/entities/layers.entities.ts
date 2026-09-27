import {
  Column,
  CreateDateColumn,
  Entity,
  ForeignKey,
  JoinColumn,
  ManyToOne,
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
  public projectId: number;

  @Column()
  public position: number;

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

  @ManyToOne(() => Project, (project) => project.layers)
  @JoinColumn({ name: 'projectId' })
  project: Relation<Project>;
}
