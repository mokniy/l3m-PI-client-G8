import { MapService } from './../map.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Defi } from '../AllDefinitions';
import { AssistantService } from '../assistant.service';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {

  constructor(private assistantService : AssistantService,private mapService : MapService) { }

  public chercher:boolean = false;

  ngOnInit() {
  }

  get obsCherche(): Observable<Defi[]> {
    return this.assistantService.obsAllChall;
  }

  get obsDefiAffiche(): Observable<Defi> {
    return this.mapService.obsDefiAffiche;
  }


  async rechercheDefi(id:boolean,titre:boolean,mc:boolean,contenu: string, type:string){
    this.chercher=true;
    if(id) {
      await this.assistantService.getRechercheDefiId(contenu.toUpperCase(),type);
    } else if(titre) {
      await this.assistantService.getRechercheDefiTitre(contenu,type);
    } else if (mc) {
      await this.assistantService.getRechercheDefiMc(contenu,type);
    }
  }

  closeDefi() {
    this.chercher=false;
    this.assistantService.close();
  }

afficherUnDefi(defi:Defi){
  this.mapService.newDefiAffiche(defi)
}
}
