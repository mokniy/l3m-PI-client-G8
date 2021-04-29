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

  constructor(private MapService : MapService) {
  }

  ngOnInit(): void {
  }

///////////////////////////AFFICHAGE DEFI ARRET
  get obsUnArret(): Observable<Defi[]> {
    return this.MapService.obsChallArret;
  }

  closeDefi(): void{
    this.MapService.closeDefi();
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
  }

  getUrlMarker(nb_defi:number): string {
    return "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue"+nb_defi+".png";
  }
  ///////////////////////////////////////////SERVICE MAP///////////////////////////////////////////

  ////////////////////////////////////AFFICHAGE DEFI
  tstAffichage(defi:Defi) {
    this.MapService.newDefiAffiche(defi)
  }
}
