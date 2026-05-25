import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum TaskStatus {
  PENDING = "pendente",
  IN_PROGRESS = "em andamento",
  COMPLETED = "concluída",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: "text",
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
