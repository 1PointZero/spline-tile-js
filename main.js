import "./style.css";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
// // import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
// // import { Int8Attribute } from "three";
import { GLTFLoader } from "three/examples/jsm//loaders/GLTFLoader";
// import { GUI } from "https://cdn.skypack.dev/dat.gui";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
// import { TDSLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/TDSLoader";
// import { FBXLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/FBXLoader";
// import Stats from "https://cdn.skypack.dev/three-stdlib@2.8.5/libs/stats";
// import Stats from "https://cdn.skypack.dev/stats.js.fps";
import { Water } from "three/examples/jsm//objects/Water";
// import { Sky } from "https://cdn.skypack.dev/three-stdlib@2.8.5/objects/Sky";
import SplineLoader from '@splinetool/loader';


// import * as THREE from "https://cdn.skypack.dev/three@0.137";
// import { MapControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";

// // // import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
// // // import { Int8Attribute } from "three";

// import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
// import { GUI } from "https://cdn.skypack.dev/dat.gui";

// import { EffectComposer } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer";
// import { RenderPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass";
// import { UnrealBloomPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass";

// import { TDSLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/TDSLoader";
// import { FBXLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/FBXLoader";

// // import Stats from "https://cdn.skypack.dev/three-stdlib@2.8.5/libs/stats";
// import Stats from "https://cdn.skypack.dev/stats.js.fps";
// import { Water } from "https://cdn.skypack.dev/three-stdlib@2.8.5/objects/Water";
// import { Sky } from "https://cdn.skypack.dev/three-stdlib@2.8.5/objects/Sky";


let renderer, scene, camera, controls;

init();

// Init
function init() {
  //Scene
  scene = new THREE.Scene();

  //Camera
  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.set(0, 1200, -1500);
  camera.zoom = 1;
  // camera.position.setZ(30);
  // camera.position.set(1000, 600, 0);
  // camera.position.y = MATH.sin(90) * 500;

  // Renderer
  renderer = new THREE.WebGL1Renderer({
    // canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true, //bloom ?
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // renderer.setClearColorHex( 0xffffff, 1 );

  // OrbtiControls
  controls = new MapControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1500;
  controls.maxPolarAngle = Math.PI / 2;
  controls.keys = {
    LEFT: "ArrowLeft", //left arrow
    UP: "ArrowUp", // up arrow
    RIGHT: "ArrowRight", // right arrow
    BOTTOM: "ArrowDown", // down arrow
  };
  controls.keyPanSpeed = 50;
  controls.listenToKeyEvents(window);

  // Light
  const pointLight = new THREE.PointLight(0xfffdee, 300, 3000, 1);
  pointLight.position.set(500, 800, 500);
  pointLight.casTShadow = true;
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x222222, 1);
  scene.add(ambientLight);

  //Events
  window.addEventListener("resize", () => {
    onWindowResize;
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  });

  //Gridhelper
  // const size = 3000;
  // const divisions = 10;

  // const gridHelper = new THREE.GridHelper(size, divisions);
  // // gridHelper.position(0,10,0);
  // scene.add(gridHelper);
  //GUI
  // const gui = new GUI();
  // gui.add( gridHelper, 'visible' );r
  // const gui = new GUI();
  // const params = {
  //   exposure: 1,
  //   bloomStrength: 2.5,
  //   bloomThreshold: 0.95,
  //   bloomRadius: 0.5,
  //   rotationSpeed: 1,
  //   orbitSpeed: 1,
  // };
  // window.params = params;
  // gui
  //   .add(params, "orbitSpeed", 0.0, 5)
  //   .step(0.01)
  //   .onChange(function (value) {
  //     window.params.orbitSpeed = Number(value);
  //   }

  ///Add sun as post-processed object (bloom effects9)
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = 0.5;
  bloomPass.strength = 1; 
  bloomPass.radius = 0.1;
  // bloomPass.exposure = 0.1;
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  //sun object //not Texture
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.IcosahedronGeometry(30, 15);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(500, 800, 500);
  window.bloomComposerSun = bloomComposer;
  window.bloomPass = bloomPass;
  scene.add(sphere);

  //add Waterd
  const water = addWater();
  scene.add(water);
  window.water = water;
  // scene.add(createFantasy());

// Load a glTF resource

// const loader = new GLTFLoader();
// loader.load(
// 	// resource URL
// 	'assets/tileTest.gltf',
// 	// called when the resource is loaded
// 	function ( gltf ) {
// 		scene.add( gltf.scene );
//     animate();

// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {
// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 	},
// 	// called when loading has errors
// 	function ( error ) {
// 		console.log( 'An error happened' );

// 	}
// );

  // 'https://prod.spline.design/2vJ66uc8lqHTenDf/scene.splinecode',
  //local   'assets/sceneTile.splinecode',
// spline scene
const loader = new SplineLoader();
loader.load(
  'https://prod.spline.design/2vJ66uc8lqHTenDf/scene.splinecode',

  (splineScene) => {
    scene.add(splineScene);
    animate();
  }
);
  



}

var t = 0;
// Animation Function
function animate() {
  t += 0.01;
  requestAnimationFrame(animate);
  controls.update(); 
  render();

  
}

// Render Function
function render() {
//water Renderer
  const time = performance.now() * 0.001;
  window.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  renderer.render(scene, camera);

  window.bloomComposerSun.render(); //durch promise asynchron und deshalb nicht abgespeichert
  renderer.setClearColor("rgb(	76, 168, 230)", 0.5); //renderer
}

//Resize Function
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function createSimple() {
  const geometry = new THREE.PlaneBufferGeometry(2160, 1080, 128, 128);

  const texture = new THREE.TextureLoader().load("assets/heightmapExample.jpg");

  //material
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: texture,
    // side: THREE.DoubleSide,
    displacementMap: texture,
    displacementScale: 100,
    //     transparent: true,
    //     opacity: 0.5,j
    // sheen: 1,
    // color: 0xffff00,
    // side: THREE.DoubleSide,
  });

  //plane
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.rotation.z = Math.PI / 2;
  return plane;
}

function createFantasy() {
  const geometry = new THREE.PlaneBufferGeometry(1640, 2360, 128, 128);

  const distMap = new THREE.TextureLoader().load("assets/fantasyHeight.png");
  const texture = new THREE.TextureLoader().load("assets/fantasyMap.png");

  //material
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: texture,
    // side: THREE.DoubleSide,
    displacementMap: distMap,
    displacementScale: 300,
    //     transparent: true,
    //     opacity: 0.5,j
    // sheen: 1,
    // color: 0xffff00,
    // side: THREE.DoubleSide,
  });

  //plane
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.rotation.z = Math.PI / 2;
  return plane;
}

function addWater() {

  //Water
  let water;

  const waterGeometry = new THREE.PlaneGeometry(950, 950);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "assets/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI /2 ;
  water.rotation.z = Math.PI / 2;
  water.position.set(0, 40, 0);

  // water.rotation.x = -Math.PI / 2;

  return water;

}

// async function addTile() {
//   var loader = new THREE.TextureLoader();
//   var normal = loader.load("assets/greycolor.png");
//   var loader = new TDSLoader();
//   const spacestation = await loader.loadAsync(
//     "assets/spacestation/isscombined.3ds"
//   );
//   spacestation.position.set(0, 0, 65);
//   spacestation.name = "ISS";
//   spacestation.rotation.y = (Math.PI / 2) * 1.3;
//   return spacestation;
// }


async function loadGltfTile() {
  const loader = new GLTFLoader();

  const loadedData = await loader.load('assets/tileTest.gltf');
  
  return loadedData;
  // var loader = new THREE.TextureLoader();
  // var normal = loader.load("assets/greycolor.png");
  // var loader = new TDSLoader();
  // const spacestation = await loader.loadAsync(
  //   "assets/spacestation/isscombined.3ds"
  // );
  // spacestation.position.set(0, 0, 65);
  // spacestation.name = "ISS";
  // spacestation.rotation.y = (Math.PI / 2) * 1.3;
  // return spacestation;
}



