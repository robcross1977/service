import { UserInterface } from './user.interface';
import { PrimaryColumn, Entity, OneToMany } from 'typeorm';
import { Room } from '../room/room.entity';

@Entity("user")
export class User implements UserInterface {
    @PrimaryColumn()
    email: string;
    
    id: string;
    
    @OneToMany(type => Room, room => room.user)
    rooms: Room[];
}