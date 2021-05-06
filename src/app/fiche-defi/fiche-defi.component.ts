import { VisiteService } from './../visite.service';
import { MapService } from './../map.service';
import { DefiService } from './../defi.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AffichageDefi, Defi, MotClef, Arret } from '../AllDefinitions';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-fiche-defi',
  templateUrl: './fiche-defi.component.html',
  styleUrls: ['./fiche-defi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Pour minimiser les rendus et les évaluations
})
export class FicheDefiComponent implements OnInit {
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
    return lesMotsClefs;
  }

  debutNewVis() {
    this.newVisite = true;
    if(this.defi) {
      this.visiteService.newVisite(this.defi.defi)
    }
  }

}
