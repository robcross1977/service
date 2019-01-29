import { Test, TestingModule } from '@nestjs/testing';
import { xmppService } from './xmpp.service';

describe('XmppService', () => {    
    it('should be defined', () => {
        expect(xmppService).toBeDefined();
    });
});