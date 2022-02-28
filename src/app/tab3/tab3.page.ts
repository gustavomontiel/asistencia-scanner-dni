import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { PersonaService } from '../services/persona.service';
import { ArchivoLocalService } from '../services/archivo-local.service';
import { Email } from '../models/email.model';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  constructor(
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public personaService: PersonaService,
    public archivoLocalService: ArchivoLocalService,
    public emailService: EmailService
  ) {}

  eliminarDatos() {
    this.personaService.borrarPersonas().then(
      async (res) => {
        const toast = await this.toastController.create({
          message: 'Datos eliminados correctamente.',
          duration: 2000,
          color: 'success',
        });
        toast.present();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: 'Error al intentar borrar los datos.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }

  async limpiar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Eliminar datos',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.eliminarDatos();
            console.log('Delete clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async bajarArchivoCsv() {
    const rutaArchivo: string =
      await this.archivoLocalService.crearArchivoCsv();

    if (rutaArchivo && rutaArchivo.length > 0) {
      let email: Email = {
        to: 'gustavomontiel@gmail.com',
        attachments: [rutaArchivo],
        subject: 'Archivo ',
      };

      this.emailService.enviarMail(email);
    }
  }
}
