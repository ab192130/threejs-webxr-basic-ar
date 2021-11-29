import * as THREE from 'three';
import {ARButton} from 'three/examples/jsm/webxr/ARButton';
import _ from 'lodash';

let scene;
let camera;
let renderer;
let controller

init()
animate();

function init() {
    // DOM
    let container = document.querySelector('.container');

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20);

    // Render
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Shadows
    container.appendChild(renderer.domElement);

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Handle resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // XR
    renderer.xr.enabled = true; // VR/AR
    document.body.appendChild(ARButton.createButton(renderer));

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.rotateX(_.random(0, 90));
        geometry.rotateY(_.random(0, 90));
        geometry.rotateZ(_.random(0, 90));
        const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xffffff}));
        mesh.position.set(0, 0, -10).applyMatrix4(controller.matrixWorld);
        mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(mesh);
    });

    scene.add(controller);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    renderer.render(scene, camera);
}
