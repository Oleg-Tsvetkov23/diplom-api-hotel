import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  // Write to the session
  serializeUser(user: any, done: (err: null, user: any) => void): void {
    done(null, user); //{ id: user.id }
  }

  // From the session to the request
  deserializeUser(payload: any, done: (err: Error , payload: string) => void): void {
    done(null, payload);
  }
}
