import { MapService } from './../map.service';
import { DefiService } from './../defi.service';
import { Component, Input, OnInit } from '@angular/core';
import { AffichageDefi, Defi, MotClef, Arret } from '../AllDefinitions';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-fiche-defi',
  templateUrl: './fiche-defi.component.html',
  styleUrls: ['./fiche-defi.component.scss']
})
export class FicheDefiComponent implements OnInit {

  public affichageDuDefi!:AffichageDefi

  constructor(private defiService : DefiService, private mapService : MapService) {
    this.mapService.obsDefiAffiche.subscribe(async x =>
      this.affichageDuDefi = {
        lArret : await this.recupArret(x.code_arret),
        leDefi : x,
        lesMotsClefs : await this.recupMotClef(x.defi),
      })
  }

  ngOnInit() {
  }

  get obsDefiAffiche(): Observable<Defi> {
    return this.mapService.obsDefiAffiche;
  }

  async recupMotClef(id_defi:string):Promise<MotClef[]>{
    const lesMotsClefs = await this.defiService.recupererMotClefUnDefi(id_defi);
    return lesMotsClefs
  }

  async recupArret(code_arret:string):Promise<Arret>{
    const arret = await this.mapService.recupUnArret(code_arret);
    return arret
  }

}
