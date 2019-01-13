import { Entity, Column, PrimaryColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { UserInterface } from './user.interface';

@Entity("users")
export class User implements UserInterface {
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password
    }

    @ApiModelProperty()
    @PrimaryColumn()
    email: string;

    @ApiModelProperty()
    @Column({
        nullable: false
    })
    password: string;

    @ApiModelProperty()
    @Column({
        nullable: false,
        default: 'NOW()'
    })
    createdAt: Date;

    @ApiModelProperty()
    @Column({
        nullable: false,
        default: 'NOW()'
    })
    updatedAt: Date;

    @ApiModelProperty()
    @Column({
        nullable: true
    })
    deletedAt: Date;
}