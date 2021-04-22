import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Defi } from '../AllDefinitions';
import { MapService } from '../map.service';
import { DefiService } from './../defi.service';

@Component({
  selector: 'app-crea-defi',
  templateUrl: './crea-defi.component.html',
  styleUrls: ['./crea-defi.component.scss']
})
export class CreaDefiComponent implements OnInit {

  //INPUT USER AUTH
  constructor(private MapService : MapService, private defiService : DefiService) { }

  ngOnInit() {
  }

  get obsLibelleArret(): Observable<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]> {
    return this.MapService.obsArretForALibelle;
  }

  async recupLib(s:string){
    await this.MapService.recupWithLibelle(s)
  }

  closeChoiceArret() {
    this.MapService.closeChoiceArret()
  }

  testMultiplechoice(defiID:string,defiTitre:string,arretInfo:string,descriptionSaisie:string) {
    const arretInfoSplited = arretInfo.trim().split(",")
    let d : Defi = {
      defi: defiID,
      titre: defiTitre,
      dateDeCreation:'',
      description:descriptionSaisie,
      auteur:'yanis.mokni@gmail.com',
      code_arret:arretInfoSplited[2].trim(),
      type: 'enigme',
      dateDeModification: '',
      version: 1,
      arret: '',
      points: 15,
      duree: '',
      prologue: '',
      epilogue: '',
      commentaire: ''
    }
    this.defiService.postDefi(d);
    this.MapService.recupArretAvecDefiAPIPerso();
  }

}
