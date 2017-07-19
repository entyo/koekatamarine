import { Component, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { SpeechRecognitionService } from '../speech-recognition.service';

const OrbitControls = require('three-orbit-controls')(THREE)
const fontJSON = require('../../assets/fonts/rounded-mgen-1c-medium-regular.json');

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'app-koekatamarine',
  templateUrl: './koekatamarine.component.html',
  styleUrls: ['./koekatamarine.component.css']
})
export class KoekatamarineComponent {

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  textObjects: THREE.Mesh[] = [];
  font = new THREE.FontLoader().parse(fontJSON);

  constructor(private speechRecognition: SpeechRecognitionService) {}

  ngAfterViewInit() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

    let controls = new OrbitControls(this.camera); // Add orbit controll function

    let axis = new THREE.AxisHelper(10)
    this.scene.add(axis)

    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, 100, 100)
    this.scene.add(light)

    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, -100)
    this.scene.add(light2)

    // Set camera position
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 300

    this.camera.lookAt(this.scene.position)

    // animation start
    this.animate();
  }

  render() {
    let timer = 0.002 * Date.now()
    this.renderer.render(this.scene, this.camera)
  }

  removeFromScene(mesh: THREE.Mesh) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh = undefined;
  }

  animate() {
   this.textObjects.forEach((txt, i) => {
      txt.position.x -= 2;
      const bbox = new THREE.Box3().setFromObject(txt);
      if (txt.position.x < -(window.innerWidth / 2 + (bbox.max.x - bbox.min.x))) {
        this.removeFromScene(txt);
        this.textObjects[i] = undefined;
      }
    });
    // TODO: もっといいやり方を見つける
    this.textObjects = this.textObjects.filter(txt => {
      return txt;
    });
    requestAnimationFrame(this.animate.bind(this));
    this.render()
  }

  recordStart() {
    // Add text
    this.speechRecognition.record().subscribe(
      term =>{
        let textGeometry = new THREE.TextGeometry(term, {
          font: this.font,
          size: 10,
          height: 5,
          curveSegments: 12,
          bevelEnabled: false
        });
        let material = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          wireframe: false
        })
        let textObject = new THREE.Mesh(textGeometry, material);
        textObject.position.set(window.innerWidth/2, Math.random()*150, Math.random()*100);
        this.textObjects.push(textObject);
        this.scene.add(textObject);
      },
      err => {
        console.log(err);
      },
      () => {} // complete時には何もしない
    );
  }

  recordPause(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.speechRecognition.abort()
      .then(() => {
        console.log("paused");
        resolve();
      })
      .catch(e => {
        console.log(e);
        reject();
      });
    });
  }

}