import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { User } from '../user/user.entity';
import { ConfigService } from '../config/config.service';

@Entity("room")
export class Room {
    @PrimaryColumn()
    roomName: string;

    @ApiModelProperty()
    @Column({
        nullable: false,
        default: ConfigService.get('XMPP_SERVICE')
    })
    service: string;

    @ApiModelProperty()
    @Column({
        nullable: false,
        default: ConfigService.get('XMPP_HOST')
    })
    host: string;
    
    @ApiModelProperty()
    @Column({
        nullable: false,
        default: moment().toISOString()
    })
    createdAt: Date;

    @ApiModelProperty()
    @Column({
        nullable: false,
        default: moment().toISOString()
    })
    updatedAt: Date;

    @ApiModelProperty()
    @Column({ 
        nullable:true
    })
    deletedAt: Date;

    @ManyToOne(type => User, user => user.rooms)
    user: User;
}