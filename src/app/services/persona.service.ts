import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Persona } from '../models/persona.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personas: Persona[] = [];
  personasSubject: BehaviorSubject<Persona[]>;

  constructor(
    private storageService: StorageService
  ) {

    this.personasSubject = new BehaviorSubject( [] );

    setTimeout(() => {
      this.storageService.get('personas').then(
        res => {
          
          const personas = typeof res === 'string' ? JSON.parse(res) : res ;

          if( Array.isArray(personas)  && personas.length > 0 ) {
            this.personas = personas;
            this.personasSubject.next(this.personas);
          }
        },
        err => { 
          console.log(err);
        }
        );
      }, 100);
   }

  guardarPersona(personaGuardar: Persona): Promise<any>{
    let personaExiste: Persona;
    personaExiste = this.personas.find(
        persona => {
          return persona.fecha === personaGuardar.fecha && 
                  persona.nroDocumento === personaGuardar.nroDocumento
        })
    if(personaExiste){
      personaExiste.fecha = personaGuardar.fecha;
    } else {
      this.personas.push(personaGuardar)
    }

    return this.storageService.set('personas', this.personas).then(
      res=>{ 
        this.personasSubject.next(this.personas) 
      }
    );
  
  }

  borrarPersona(personaGuardar: Persona){

    let indicePersona: number;
    let mensaje: string = 'Se eliminó correctamente';

    indicePersona = this.personas.findIndex(
        persona => {
          return persona.fecha === personaGuardar.fecha && 
                  persona.nroDocumento === personaGuardar.nroDocumento
        })
    if(indicePersona >= 0 ){
      this.personas.splice(indicePersona, 1)
      this.storageService.set('personas', this.personas);
      this.personasSubject.next(this.personas);
    } else {
      mensaje = 'No se encontró el registro'
    }

    return mensaje;

  }


  async borrarPersonas() {
    this.personas = []
    await this.storageService.remove('personas') ;
    this.personasSubject.next(this.personas);
  }

}
