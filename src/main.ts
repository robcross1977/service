import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication, INestExpressApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module';
import { xmppService } from './xmpp/xmpp.service';

(async () => {
    xmppService.client.subject('session:started').subscribe({
        next: async (): Promise<void> => {
            Logger.log('XMPP session:started, starting express app');

            const app = await NestFactory.create(AppModule);
            app.useGlobalPipes(new ValidationPipe());
        
            swaggerSetup(app);
        
            await app.listen(3000);
        }
    });
    
    xmppService.connect();
})();

const swaggerSetup = (app: INestApplication & INestExpressApplication): void => {
    const options = new DocumentBuilder()
        .setTitle('Murderbeard Chat')
        .setDescription('Here are the docs!')
        .setVersion('v0.1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);
}