import { Entity, Column, PrimaryColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { UserInterface } from './user.interface';

export class User implements UserInterface {
    email: string;
    id: string;
}