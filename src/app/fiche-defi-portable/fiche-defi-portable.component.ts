import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AffichageDefi, Arret, Defi, MotClef } from '../AllDefinitions';
import { DefiService } from '../defi.service';
import { MapService } from '../map.service';
import { VisiteService } from '../visite.service';

@Component({
  selector: 'app-fiche-defi-portable',
  templateUrl: './fiche-defi-portable.component.html',
  styleUrls: ['./fiche-defi-portable.component.scss']
})
export class FicheDefiPortableComponent implements OnInit {
  private _defi: Defi | null = null;
  @Input() // On passe par un attribut calculé pour pouvoir déclancher les calculs
  get defi(): Defi | null {return this._defi;}
  set defi(leDefi: Defi | null) {
    this._defi = leDefi;
    if (leDefi) {
      const P = Promise.all([this.recupArret(leDefi.code_arret), this.recupMotClef(leDefi.defi)]);
      P.then( ([lArret, lesMotsClefs]) => this.defiSubj.next({leDefi, lArret, lesMotsClefs}) );
      this.newVisite = false;
      this.visiteService.closeNewVisite();
    } else {
      this.defiSubj.next(null);
      this.newVisite = false;
    }
  }

  public newVisite = false;

  private defiSubj = new Subject<AffichageDefi | null>();
  readonly affichageDuDefi: Observable<AffichageDefi | null> = this.defiSubj.asObservable();

  constructor(private defiService : DefiService, private mapService : MapService, private visiteService : VisiteService) {
  }

  ngOnInit() {
  }

  private async recupMotClef(id_defi:string):Promise<MotClef[]>{
    const lesMotsClefs = await this.defiService.recupererMotClefUnDefi(id_defi);
    return lesMotsClefs
  }

  private async recupArret(code_arret:string):Promise<Arret>{
    const arret = await this.mapService.recupUnArret(code_arret);
    return arret
  }

  displayMotClef(tabMC:MotClef[]):string{
    //console.log(JSON.stringify(tabMC))
    let lesMotsClefs:string="";
    tabMC.forEach(x =>
      {
        if(lesMotsClefs===""){
          lesMotsClefs+=x.mot_mc
        }
        else {
          lesMotsClefs+=",   "+x.mot_mc
        }
        }
      );
      //console.log("Mot : "+lesMotsClefs);
    return lesMotsClefs;
  }

  debutNewVis() {
    this.newVisite = true;
    if(this.defi) {
      this.visiteService.newVisite(this.defi.defi)
    }
  }


}
