import { DefiService } from './../defi.service';
import { Component, OnInit } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { Observable } from 'rxjs';
import { ArretMap, Defi } from '../AllDefinitions';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  tileLayerUrl = OSM_TILE_LAYER_URL;
  public defiExergue !: Defi|undefined;

  constructor(private MapService : MapService) {
    if(this.defiExergue === undefined ){
      console.log("Defi inexistant")
    }
    console.log(this.defiExergue)
  }

  ngOnInit(): void {
  }

///////////////////////////AFFICHAGE DEFI ARRET
  get obsUnArret(): Observable<Defi[]> {
    return this.MapService.obsChallArret;
  }

  closeDefi(): void{
    this.MapService.closeDefi();
    this.defiExergue = undefined;
  }

///////////////////////////////////////////SERVICE MAP///////////////////////////////////////////
  get obsArrets(): Observable<ArretMap[]> {
    return this.MapService.arretsObs;
  }

  get obsLignes(): Observable<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]> {
    return this.MapService.lignesObs;
  }

  colorationLines(i: number): string | undefined {
    return this.MapService.colorationLines(i);
  }

  displayDefi(i: number) {
    this.MapService.displayDefi(i);
    this.defiExergue = undefined;
  }

  getUrlMarker(nb_defi:number): string {
    //console.log("'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue"+nb_defi+".png'");
    return "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue"+nb_defi+".png";
  }
  ///////////////////////////////////////////SERVICE MAP///////////////////////////////////////////

  ////////////////////////////////////AFFICHAGE DEFI
  tstAffichage(defi:Defi) {
    this.defiExergue = defi;
  }
}
