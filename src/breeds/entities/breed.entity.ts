import { Cat } from 'src/cats/entities/cat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Breed {
  @Column({ primary: true, generated: true })
  id: number;
  @Column({ length: 500 })
  name: String;

  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: User;

  @Column()
  userEmail: string;

  @DeleteDateColumn()
  deleteAt: Date;
}
