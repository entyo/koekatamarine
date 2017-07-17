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

  ngAfterViewInit() {
    let scene = new THREE.Scene()

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.rendererContainer.nativeElement.appendChild(renderer.domElement)

    let controls = new OrbitControls(camera); // Add orbit controll function

    let axis = new THREE.AxisHelper(10)
    scene.add(axis)

    let light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, 100, 100)
    scene.add(light)

    let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
    light2.position.set(-100, 100, -100)
    scene.add(light2)

    let material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: false
    })

    const removeFromScene = (mesh: THREE.Mesh) => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh = undefined;
    }

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

    let textObjects: THREE.Mesh[] = [];
    recognition.onresult = evt => {
      console.log(textObjects);
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
        textObject.position.set(window.innerWidth / 2, Math.random() * 200, 0);
        textObjects.push(textObject);
        scene.add(textObject);
      }
    }
    recognition.onerror = evt => {
      console.log(evt);
    }

    // Set camera position
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 300

    camera.lookAt(scene.position)

    const render = (): void => {
      let timer = 0.002 * Date.now()
      renderer.render(scene, camera)
    }

    const animate = (): void => {
      textObjects.forEach((txt, i) => {
        txt.position.x -= 4;
        const bbox = new THREE.Box3().setFromObject(txt);
        if (txt.position.x < -(window.innerWidth / 2 + (bbox.max.x - bbox.min.x))) {
          removeFromScene(txt);
          textObjects[i] = undefined;
        }
      });
      // TODO: もっといいやり方を見つける
      textObjects = textObjects.filter(txt => {
        return txt;
      });
      requestAnimationFrame(animate)
      render()
    }

    animate()
  }

  // ngOnInit() {
  //   let scene = new THREE.Scene()

  //   let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  //   let renderer = new THREE.WebGLRenderer()
  //   renderer.setSize(window.innerWidth, window.innerHeight)
  //   document.body.appendChild(renderer.domElement)

  //   let controls = new OrbitControls(camera); // Add orbit controll function

  //   let axis = new THREE.AxisHelper(10)
  //   scene.add(axis)

  //   let light = new THREE.DirectionalLight(0xffffff, 1.0)
  //   light.position.set(100, 100, 100)
  //   scene.add(light)

  //   let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
  //   light2.position.set(-100, 100, -100)
  //   scene.add(light2)

  //   let material = new THREE.MeshBasicMaterial({
  //     color: 0xFFFFFF,
  //     wireframe: false
  //   })

  //   const removeFromScene = (mesh: THREE.Mesh) => {
  //     scene.remove(mesh);
  //     mesh.geometry.dispose();
  //     mesh.material.dispose();
  //     mesh = undefined;
  //   }

  //   // Add text
  //   let font = new THREE.FontLoader().parse(fontJSON);
  //   const { webkitSpeechRecognition }: IWindow = <IWindow>window;
  //   const recognition = new webkitSpeechRecognition();
  //   recognition.continuous = true;
  //   recognition.lang = 'ja';
  //   recognition.interimResults = true;
  //   recognition.maxAlternatives = 1;
  //   recognition.start();

  //   let textObjects: THREE.Mesh[] = [];
  //   recognition.onresult = evt => {
  //     console.log(textObjects);
  //     if (!evt.results) {
  //       return;
  //     }
  //     const result = evt.results[evt.resultIndex];
  //     if (result.isFinal && result[0].confidence > 0.3) {
  //       // 取得したフォントを、TextGeometryのパラメータに渡す。
  //       let textGeometry = new THREE.TextGeometry(result[0].transcript, {
  //         font: font,
  //         size: 10,
  //         height: 5,
  //         curveSegments: 12,
  //         bevelEnabled: false
  //       });
  //       let textObject = new THREE.Mesh(textGeometry, material);
  //       textObject.position.set(window.innerWidth / 2, Math.random() * 200, 0);
  //       textObjects.push(textObject);
  //       scene.add(textObject);
  //     }
  //   }
  //   recognition.onerror = evt => {
  //     console.log(evt);
  //   }

  //   // Set camera position
  //   camera.position.x = 0
  //   camera.position.y = 0
  //   camera.position.z = 300

  //   camera.lookAt(scene.position)

  //   const render = (): void => {
  //     let timer = 0.002 * Date.now()
  //     renderer.render(scene, camera)
  //   }

  //   const animate = (): void => {
  //     textObjects.forEach((txt, i) => {
  //       txt.position.x -= 4;
  //       const bbox = new THREE.Box3().setFromObject(txt);
  //       if (txt.position.x < -(window.innerWidth / 2 + (bbox.max.x - bbox.min.x))) {
  //         removeFromScene(txt);
  //         textObjects[i] = undefined;
  //       }
  //     });
  //     // TODO: もっといいやり方を見つける
  //     textObjects = textObjects.filter(txt => {
  //       return txt;
  //     });
  //     requestAnimationFrame(animate)
  //     render()
  //   }

  //   animate()
  // }

}
