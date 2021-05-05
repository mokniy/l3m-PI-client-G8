import { Component, HostListener, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-page-accueil',
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent implements OnInit {

  constructor() {
  }


  ngOnInit(): void {


    this.bg = document.getElementById("bg") as HTMLElement;
    this.front = document.getElementById("front") as HTMLElement;
    this.text = document.getElementById("text") as HTMLElement;
    this.img1 = document.getElementById("img1") as HTMLElement;
    this.img2 = document.getElementById("img2") as HTMLElement;


  }

  private bg!:HTMLElement
  private front !:HTMLElement
  private text !:HTMLElement
  private img1!:HTMLElement
  private img2!:HTMLElement




divScroll(e:any) {
  var value =window.pageYOffset;
  console.log("v"+value);
  //console.log(this.img1)
    if (value <= 450) {
      //this.img1.style.left = -70 + value * 0.045 + "vw";
      //this.img2.style.left = 75 - value * 0.045 + "vw";
    }
}

}
