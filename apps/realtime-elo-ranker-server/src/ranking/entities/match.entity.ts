import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  winnerId: string;

  @Column()
  loserId: string;

  @Column({ default: false })
  isDraw: boolean;

  @CreateDateColumn()
  date: Date;
}
