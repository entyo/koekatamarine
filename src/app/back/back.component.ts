import { Component, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE)
const fontJSON = require('../../assets/fonts/rounded-mgen-1c-medium-regular.json');

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent {

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor() {}
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  textObjects: THREE.Mesh[] = [];

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

    let material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: false
    })

    // Add text
    let font = new THREE.FontLoader().parse(fontJSON);
    const {
      webkitSpeechRecognition
    }: IWindow = < IWindow > window;
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = evt => {
      console.log(this.textObjects);
      if (!evt.results) {
        return;
      }
      const result = evt.results[evt.resultIndex];
      if (result.isFinal && result[0].confidence > 0.2) {
        // 取得したフォントを、TextGeometryのパラメータに渡す。
        let textGeometry = new THREE.TextGeometry(result[0].transcript, {
          font: font,
          size: 10,
          height: 5,
          curveSegments: 12,
          bevelEnabled: false
        });
        let textObject = new THREE.Mesh(textGeometry, material);
        this.textObjects.push(textObject);
        this.scene.add(textObject);
      }
    }
    recognition.onerror = evt => {
      console.log(evt);
    }

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
      txt.position.x -= 4;
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

}
