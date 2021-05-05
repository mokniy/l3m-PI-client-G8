import { VisiteService } from './../visite.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { Observable } from 'rxjs';
import { ArretMap, Defi, Visite } from '../AllDefinitions';
import { MapService } from '../map.service';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  tileLayerUrl = OSM_TILE_LAYER_URL;

  constructor(private mapService : MapService,private visiteService : VisiteService) {
    this.mapService.recupAllLinesSEMITAG();
    this.mapService.recupArretAvecDefiAPIPerso();
    this.mapService.closeDefi();
    this.visiteService.closeAllVisite();
  }

  ngOnInit(): void {
  }

///////////////////////////AFFICHAGE DEFI ARRET
  get obsUnArret(): Observable<Defi[]> {
    return this.mapService.obsChallArret;
  }

  get obsLesVisite(): Observable<Visite[]> {
    return this.visiteService.obsVisArret;
  }

  closeDefi(): void{
    this.mapService.closeDefi();
    this.visiteService.closeAllVisite();
  }

///////////////////////////////////////////SERVICE MAP///////////////////////////////////////////
  get obsArrets(): Observable<ArretMap[]> {
    return this.mapService.arretsObs;
  }

  get obsLignes(): Observable<GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString, any>[]> {
    return this.mapService.lignesObs;
  }

  colorationLines(i: number): string | undefined {
    return this.mapService.colorationLines(i);
  }

  getUrlMarker(nb_defi:number): string {
    return "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue"+nb_defi+".png";
  }

  displayContenuArret(i: number) {
    this.mapService.stopAffDefi()
    this.arretDisplay = this.mapService.displayDefi(i);
    this.visiteService.getAllVisiteOfAnArret(this.arretDisplay);
    if(this.map !== undefined) {
      this.loadView()
    }
  }
  ///////////////////////////////////////////SERVICE MAP///////////////////////////////////////////

  ////////////////////////////////////AFFICHAGE DEFI
  afficherUnDefi(defi:Defi, el:HTMLElement) {
    this.mapService.newDefiAffiche(defi)
    this.setView(el)
  }

  get obsDefiAffiche(): Observable<Defi> {
    return this.mapService.obsDefiAffiche;
  }

  //////////////////load street view
  @ViewChild(GoogleMap) map!: GoogleMap;
  public arretDisplay!:ArretMap;

  loadView() {
    const streetView =this.map.getStreetView()
    streetView.setOptions({
      position: { lat: +this.arretDisplay.info_arret.geometry.coordinates[1], lng: +this.arretDisplay.info_arret.geometry.coordinates[0] },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    });
    if(streetView.getVisible() === false) {
      streetView.setVisible(true);
    }
  }
  ///////////ANCRE
  setView(el:HTMLElement) {
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  public tsssss:boolean=false;
  tst() {
    if(this.tsssss) {
      this.tsssss = false;
    } else {
      this.tsssss = true;
    }
  }
  dataToggle() {

  }
}
