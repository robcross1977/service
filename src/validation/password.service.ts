import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PasswordService {
    private conditions = [{ 
        specMessage: "\t* Must be at least 8 characters",
        check: (password: string): Boolean => {
            return password.length >= 8;
        }
    }];

    validate(password: string) {
        this.conditions.forEach(condition => {
            if(!condition.check(password)) {
                throw new HttpException(this.printSpecs(), HttpStatus.BAD_REQUEST);
            }
        });
    }

    printSpecs() {
        let specMessage = 'The password must fit the following criteria:\n';

        this.conditions.forEach(condition => {
            specMessage += condition.specMessage;
        });

        return specMessage;
    }
}