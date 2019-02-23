import { Module, HttpModule } from '@nestjs/common';
import { EjabberdHttpService } from './ejabberd-http.service';

@Module({
    imports: [HttpModule],
    providers: [EjabberdHttpService],
    exports: [EjabberdHttpService]
})
export class EjabberdHttpModule {}