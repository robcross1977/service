
import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import * as shortid from 'shortid';

@Injectable()
export class EndpointLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
        const { url, method, user, body, headers } = context.switchToHttp().getRequest();
        const id = shortid.generate();

        Logger.log({id: id, message: "endpoint - start", url: url, method: method, user: user, body: body, headers: headers});

        const then = moment().milliseconds();

        return call$.pipe(tap(() => {
            Logger.log({
                id: id,
                message: `endpoint - end: ${moment().milliseconds() - then}ms`,
                url: url,
                method: method,
                user: user
            });
        }));
    }
}