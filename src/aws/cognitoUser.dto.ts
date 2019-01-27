import { UserInterface } from "../user/user.interface";

export class CognitoUser implements UserInterface {
    id: string;
    email: string;
}