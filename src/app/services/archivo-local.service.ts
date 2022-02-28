import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Persona } from '../models/persona.model';
import { PersonaService } from './persona.service';

@Injectable({
  providedIn: 'root',
})
export class ArchivoLocalService {
  guardados: Persona[] = [];
  rutaArchivo: string;
  archivoCreado: boolean = false;

  constructor(
    private personaService: PersonaService,
    private file: File
  ) {
    this.rutaArchivo = `${this.file.dataDirectory}registros.csv`;
  }

  async crearArchivoCsv() {
    this.archivoCreado = false;
    await this.ArmarLineasArchivo();
    let retorno = this.archivoCreado ? this.rutaArchivo : undefined;
    retorno = this.rutaArchivo;
    return retorno;
  }

  async ArmarLineasArchivo() {
    this.guardados = this.personaService.personas || [];

    const arrTemp = [];
    const titulos = 'Fecha, Nombre, NroDocumento, Sexo\n';

    arrTemp.push(titulos);

    this.guardados.forEach((registro) => {
      const linea = `${registro.fecha}, ${registro.nombre}, ${registro.nroDocumento}, ${registro.sexo}\n`;

      arrTemp.push(linea);
    });

    await this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {
    this.file
      .checkFile(this.file.dataDirectory, 'registros.csv')
      .then(async (existe) => {
        console.log('Existe archivo?', existe);
        return await this.escribirEnArchivo(text);
      })
      .catch((err) => {
        return this.file
          .createFile(this.file.dataDirectory, 'registros.csv', false)
          .then(async (creado) => await this.escribirEnArchivo(text))
          .catch((err2) => console.log('No se pudo crear el archivo', err2));
      });
  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text)
    console.log('fin escribirEnArchivo', this.rutaArchivo);
  }
}
