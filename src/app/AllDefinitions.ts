import firebase from 'firebase/app';

export interface Chami {
  readonly pseudo: string;
  readonly age:   number;
  readonly ville: string;
  readonly description: string;
  readonly email: string;
}

export interface Defi {
  readonly defi:string;
  readonly titre:string;
  readonly dateDeCreation:string;
  readonly description:string;
  readonly auteur:string;
  readonly code_arret:string;
  readonly type:string;
  readonly dateDeModification:string;
  readonly version:number;
  readonly arret:string;
  readonly points:number;
  readonly duree:string;
  readonly prologue:string;
  readonly epilogue:string;
  readonly commentaire:string;
}

export interface Arret {
  readonly code : string;
  readonly lib_arret: string;
  readonly adresse: string;
  readonly streetmap: string;
}
export interface ArretMap  {
  nb_defi: number;
  info_arret: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>;
}

export interface User {
  chami: Chami | undefined;
  oauthUser: firebase.User;
}

export function componentToHex(c:number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(str :string) {
  let splitted = str.split(",", 3);
  let r:number = +splitted[0]
  let g:number = +splitted[1]
  let b:number = +splitted[2]
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)+"";
}
