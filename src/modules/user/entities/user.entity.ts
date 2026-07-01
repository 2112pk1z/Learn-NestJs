import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ default: true })
  isActive: boolean;

  // @Column()
  // created_At: Date;

  // @Column()
  // updated_At: Date;
}
