import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Persona } from '../models/persona.model';
import { ToastController } from '@ionic/angular';
import { PersonaService } from '../services/persona.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {

  conLinterna: boolean = true;
  personaLeida: Persona;

  constructor(
    private barcodeScanner: BarcodeScanner,
    public toastController: ToastController,
    public alertController: AlertController,
    public personaService: PersonaService
    ) {}

  scan() {
    this.barcodeScanner
      .scan({
        preferFrontCamera: false, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: this.conLinterna, // Android, launch with the torch switched on (if available)
        prompt: 'Coloque el código en el área de escaneo', // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
        // orientation: 'landscape', // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: false, // iOS and Android
      })
      .then((barcodeData) => {
        console.log(barcodeData);
        if (!barcodeData.cancelled) {
          this.getDatos(barcodeData.text);
        } else {
          console.log('ver', barcodeData);
          this.presentToastError();
        }
      })
      .catch((err) => {
        console.log('Error', err);
        this.presentToastError();
      });
  }

  getDatos(text: string) {
    const arrayDatos = text.split('@');
    let nombrecompleto: string = '';

    if (text.charAt(0) === '@') {
      nombrecompleto = arrayDatos[4] + ' ' + arrayDatos[5];
      this.personaLeida = {
        nombre: nombrecompleto,
        fechaNacimiento: arrayDatos[7],
        nroDocumento: Number(arrayDatos[1]),
        sexo: arrayDatos[8],
        fecha: new Date().toISOString().split('T')[0]
      };
    } else {
      nombrecompleto = arrayDatos[1] + ' ' + arrayDatos[2];
      this.personaLeida = {
        nombre: nombrecompleto,
        fechaNacimiento: arrayDatos[6],
        nroDocumento: Number(arrayDatos[4]),
        sexo: arrayDatos[3],
        fecha: new Date().toISOString().split('T')[0]
      };
    }

    this.guardarDatos();

  }

  guardarDatos(){
    console.log(this.personaLeida);
    this.personaService.guardarPersona(this.personaLeida).then(
      res => {
        this.presentAlertOk();
      },
      err => {
        console.log(err);
        this.presentToastError();
      });
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'No se guardaron los datos.',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async presentAlertOk() {
    const msg = 'Datos guardados.';
    const alert = await this.alertController.create({
      header: this.personaLeida.nombre,
      subHeader: this.personaLeida.nroDocumento.toString(),
      buttons: ['Aceptar']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }



}
