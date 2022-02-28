import { Component } from '@angular/core';
import { Persona } from '../models/persona.model';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  personas: Persona[] = [];
  items: any[] = [];
  constructor(public personaService: PersonaService) {
    this.personaService.personasSubject.subscribe((res) => {
      this.personas = res;
    });
  }

  ionViewDidEnter() {
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
  }

  handleInput(event) {
    this.items = Array.from(document.querySelector('ion-list').children);
    const query = event.target.value.toLowerCase();
    console.log(query, this.items);

    requestAnimationFrame(() => {
      this.items.forEach((item) => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }
}
