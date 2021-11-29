import * as THREE from 'three';
import {ARButton} from 'three/examples/jsm/webxr/ARButton';

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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Render
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Shadows
    container.appendChild(renderer.domElement);

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Handling resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // XR
    renderer.xr.enabled = true; // VR/AR
    document.body.appendChild(ARButton.createButton(renderer));

    const geometry = new THREE.BoxGeometry(1, 1, 1).rotateX(45)
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
        console.log("hey");
        const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xffffff}));
        mesh.position.set(0, 0, -10).applyMatrix4(controller.matrixWorld);
        mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(mesh);
    });

    scene.add(controller);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
