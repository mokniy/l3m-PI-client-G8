import firebase from 'firebase/app';

export interface Chami {
  readonly pseudo: string;
  readonly age:   number;
  readonly ville: string;
  readonly description: string;
  readonly email: string;
}

export interface Defi extends DefiTmp{
  readonly defi:string;
}

export interface DefiTmp {
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
  readonly streetMap: string;
}

export interface ArretMap  {
  nb_defi: number;
  info_arret: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString,any>;
}

export interface User {
  chami: Chami | undefined;
  oauthUser: firebase.User;
}

export interface MotClef {
  readonly id_mc : string;
  readonly mot_mc: string;
}

export interface MotClefTmp {
  readonly mot_mc: string;
}

export interface Chercher{
  readonly id_defi : string;
  readonly id_mc: string;
}

export interface IndiceTmp{
  label_ind:string;
  description_ind:string;
  readonly points_ind:number;
  id_defi?:string;
}

export interface Indice{
  readonly id_ind:string;
  readonly label_ind:string;
  readonly description_ind:string;
  readonly points_ind:number;
  readonly id_defi:string;
}

export interface Question {
  readonly id_qst:string;
  readonly label_qst:string;
  readonly description_qst:string;
  readonly secret_qst:string;
  readonly points_qst:number;
  readonly id_defi:string;
}

export interface QuestionTmp {
  label_qst:string;
  description_qst:string;
  secret_qst:string;
  readonly points_qst: number;
  id_defi?:string;
}

export interface AffichageDefi {
  readonly leDefi:Defi;
  readonly lArret: Arret;
  readonly lesMotsClefs: MotClef[]
}

/////////////VISITE/////////////

export interface IndiceForVisite extends Indice {
  usedInd ?:boolean;
}

export interface QuestionForVisite extends Question {
  reponse ?:string;
  resultat ?:boolean;
}

export interface NouvelleVisite {
  readonly leDefi:Defi;
  readonly lArret: Arret;
  readonly lesMotsClefs: MotClef[]
  readonly lesQuestions: QuestionForVisite[]
  readonly lesIndices: IndiceForVisite[]
}

export interface Visite extends VisiteTmp{
  readonly id_vis :string;
}

export interface VisiteTmp {
  readonly date_vis :string;
  readonly mode_vis :string;
  readonly statut_vis :string;
  readonly pts_vis : number;
  readonly score_vis : number;
  readonly temps_vis :string;
  readonly id_visiteur :string;
  readonly id_defi :string;
  readonly commentaire :string;
  readonly indice_utilise_vis: string;
}

export interface ReponseTmp{
  reponse_rep: string;
  readonly id_qst:string;
}

export interface Reponse extends ReponseTmp{
  readonly id_rep: string;
}

export interface EvaluationTmp{
  readonly id_vis : string;
  readonly id_rep :string;
}
/////////////////////////////FUNCTION/////////////////////////////

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

export function escape_quote(s:string):string {
  return s.replace(/'/g,"''")
}
export function current_date(): Date{
  return new Date(new Date().getTime())
}
