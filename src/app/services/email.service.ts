import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private emailComposer: EmailComposer
  ) { }

  enviarMail(email: Email){
    // Send a text message using default options
    this.emailComposer.open(email).then(
      res=>{
        console.log('email sin error', res);
        
      },
      err=>{
        console.log('email con error', err);
      }
    );

  }
}
