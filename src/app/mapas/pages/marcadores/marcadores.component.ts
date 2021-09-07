import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }
    .list-group{
      position:fixed;
      top:20px;
      right:20px;
      z-index: 999;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number,number] = [-60.694519091319634,-32.89874074869976];

  //arreglo de marcadores
  marcadores: MarcadorColor[] = []

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage()

    //MARCADOR HECHO CON UNA PALABRA
    // const markerHtml: HTMLElement = document.createElement('div')
    // markerHtml.innerHTML = 'CASA'
              //element: markerHtml //ESTO SE PONDRIA DENTRO DEL .Marker()

    // MARCADOR ESTATICO
    // const marker = new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //     .addTo(this.mapa)

  }

  irMarcador(marca:MarcadorColor){
    this.mapa.flyTo({
      center: marca.marker!.getLngLat()
    });
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color,
    }
    )
      .setLngLat(this.center)
      .addTo(this.mapa)

      this.marcadores.push({
        color,
        marker: nuevoMarcador
      })

  this.guardarMarcadoresLocalStorage()

  nuevoMarcador.on('dragend', () => {
    this.guardarMarcadoresLocalStorage()
  })
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = []

    this.marcadores.forEach( m => {
      const color = m.color
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng,lat]
      });
    })
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))
  }

  leerLocalStorage() {

    if (!localStorage.getItem('marcadores')){
      return
    }

    const lngLatArr: MarcadorColor[]= JSON.parse(localStorage.getItem('marcadores')!)

    lngLatArr.forEach( m => {

      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
          .setLngLat(m.centro!)
          .addTo(this.mapa)

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', () => {
        console.log(newMarker)
        this.guardarMarcadoresLocalStorage()
      })


    });
  }

  borrarMarcador(i: number) {
    console.log(i)
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1)
    this.guardarMarcadoresLocalStorage()
  }

  }


