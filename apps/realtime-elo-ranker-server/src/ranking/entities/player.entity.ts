import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: 1200 })
  rank: number;
}
