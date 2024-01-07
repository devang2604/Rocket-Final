import * as THREE from "/js/three.js";
import { GLTFLoader } from "/js/GLTFLoader.js";
import { OrbitControls } from "/js/OrbitControls.js";
import { DRACOLoader } from "/js/DRACOLoader.js";
import Stats from "/js/stats.module.js";
import { MeshSurfaceSampler } from "/js/MeshSurfaceSampler.js";
import { TWEEN } from "/js/tween.module.min.js";
import { createParticles } from "./particles.js";

/**
 * Debug
 */
// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager();

const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.style.width = (loaded / total) * 100 + "%";
};
loadingManager.onLoad = function (url, loaded, total) {
  progressContainer.style.display = "none";
  document.getElementById("start-button").style.display = "block";
};

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/js/draco/");

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

// Models
var island;

gltfLoader.load("/models/text.glb", function (gltf) {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      sampler = new MeshSurfaceSampler(obj).build();
    }
  });
  transformMesh();
  // scene.add(gltf.scene);
});
let sampler;
let uniforms = { mousePos: { value: new THREE.Vector3() } };
let pointsGeometry = new THREE.BufferGeometry();
const vertices = [];
const tempPosition = new THREE.Vector3();

function transformMesh() {
  for (let i = 0; i < 30000; i++) {
    sampler.sample(tempPosition);
    vertices.push(tempPosition.x - 3.4, -tempPosition.z + 1.3, tempPosition.y);
  }
  pointsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xff6A0DAD,
    size: 0.1,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    sizeAttenuation: true,
  });
  pointsMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.mousePos = uniforms.mousePos;

    shader.vertexShader = `
              uniform vec3 mousePos;
              varying float vNormal;
              
              ${shader.vertexShader}`.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>   
                  vec3 seg = position - mousePos;
                  vec3 dir = normalize(seg);
                  float dist = length(seg);
              `
    );
  };

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(points);
}

// var mug;
// gltfLoader.load("/models/controlpanel.glb", function (gltf) {
//   mug = gltf.scene;
//   gltf.scene.traverse(function (node) {
//     if (node.isMesh) {
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }
//   });
//   scene.add(mug);
//   mug.scale.set(0.06, 0.06, 0.06);
//   mug.position.set(.7, .8, 13);
// });

var mug2;
gltfLoader.load("/models/galaxy.glb", function (gltf) {
  mug2 = gltf.scene;
  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  scene.add(mug2);
  
  mug2.rotation.x = Math.PI / 4; // Adjust the angle as needed
  mug2.rotation.y = Math.PI / 2;
  mug2.rotation.z = Math.PI / 2;
  mug2.scale.set(0.5, 0.5, 0.5);
  mug2.position.set(-3.0, 5, -20);
});

var mug3;
// gltfLoader.load("/models/spacecenter.glb", function (gltf) {
//   mug3 = gltf.scene;
//   gltf.scene.traverse(function (node) {
//     if (node.isMesh) {
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }
//   });
//   scene.add(mug3);
//   mug3.scale.set(.1, 0.01, 0.1);
//   mug3.position.set(0, 0, 0);
// });

var mixer3;
var action3;
// gltfLoader.load("/models/joshua.glb", function (gltf) {
//   var joshua = gltf.scene;

//   //Playing Animation
//   mixer3 = new THREE.AnimationMixer(joshua);
//   action3 = mixer3.clipAction(gltf.animations[0]);
//   action3.timeScale = 1;
//   action3.play();

//   gltf.scene.traverse(function (node) {
//     if (node.isMesh) {
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }
//   });
//   scene.add(joshua);
//   joshua.scale.set(1, 1, 1);
//   joshua.position.set(-3.5, 0, 10);
//   joshua.rotation.y = 0;
// });
// for (let i = 0; i < 4; i++) {
//   gltfLoader.load("/models/among.glb", function (gltf) {
//     var man = gltf.scene;
//     man.scale.set(0.49, 0.49, 0.49);

//     // Add a constant offset to create space between instances
//     var offsetX = i * 0.2; // Adjust this value to control the spacing
//     var offsetZ = i * 0.24; // Adjust this value to control the spacing

//     man.position.set(
//       -8.5 + Math.random() * 2 + offsetX,
//       -0.01,
//       4.5 + Math.random() * 2 + offsetZ
//     );

//     man.rotation.y = Math.random() * 20;

//     gltf.scene.traverse(function (node) {
//       if (node.isMesh) {
//         node.castShadow = true;
//         node.receiveShadow = true;
//       }
//     });

//     scene.add(man);
//   });
// }

var clapper;
var mixer;
var action;

var cyclist;
var mixer2;
var action2;
gltfLoader.load("/models/rocket.glb", function (gltf) {
  cyclist = gltf.scene;
  cyclist.scale.set(0.0025, 0.0025, 0.0025);

  //Playing Animation
  mixer2 = new THREE.AnimationMixer(cyclist);
  action2 = mixer2.clipAction(gltf.animations[0]);
  action2.timeScale = 0;
  action2.play();

  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  scene.add(cyclist);
});

var mixer4;
var action4;
gltfLoader.load(
    '/models/planet1.glb', function(gltf){
        var stag = gltf.scene;

        stag.scale.set(.5,.5,.5);
        stag.rotation.y = Math.PI/2;
        stag.position.set(.7, .5, 10);

        mixer4 = new THREE.AnimationMixer( stag );
        action4 = mixer4.clipAction( gltf.animations[ 0 ] );
        action4.timeScale = 1;
        action4.play();

        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(stag);
});

var robot;
var mixer5;
var action5;
// gltfLoader.load(
//     '/models/robo.glb', function(gltf){
//         robot = gltf.scene;
//         gltf.scene.traverse( function( node ) {
//             if ( node.isMesh ) {
//                 node.castShadow = true;
//                 node.receiveShadow = true;
//             }
//         } );

//         mixer5 = new THREE.AnimationMixer( robot );
//         action5 = mixer5.clipAction( gltf.animations[ 14 ] );
//         action5.play();

//         robot.scale.set(.5,.5,.5);
//         robot.position.set(0,0,-9.5);
//         robot.rotation.y = -Math.PI;

//         scene.add(robot);
// });

// Camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  1,
  90
);
camera.position.set(0, 30, 30);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 2.15;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 16;
controls.maxDistance = 30;
controls.enableDamping = true;
controls.rotateSpeed = 0.25;

// Renderer
THREE.Cache.enabled = true;

// let AA = true
// if (window.devicePixelRatio > 1) {
//   AA = false
// }

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);
scene.background = null;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.getElementById("start-button").onclick = function () {
  document.getElementById("loadingscreen").classList.add("hidden");

  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 1.2, z: 16 }, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
};

// Lights
const hemiLight = new THREE.HemisphereLight(0xfff, 0xfff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

let shadowMapSize = 13;
const sunLight = new THREE.DirectionalLight(0xffffff, 1, 100);
sunLight.position.set(0, 12, 12);
sunLight.color.setHSL(0.1, 1, 0.95);
sunLight.visible = true;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = shadowMapSize * 2;
sunLight.shadow.camera.top = shadowMapSize;
sunLight.shadow.camera.bottom = -shadowMapSize;
sunLight.shadow.camera.left = -shadowMapSize;
sunLight.shadow.camera.right = shadowMapSize;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
scene.add(sunLight.target);

// const helper = new THREE.CameraHelper( sunLight.shadow.camera );
// scene.add( helper );

const spotLight = new THREE.SpotLight(0xff6A0DAD, 4, 6, Math.PI / 4, 1, 1);
spotLight.position.set(0, 3.5, 0);
spotLight.visible = false;
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 2;
spotLight.shadow.normalBias = 0.02;
scene.add(spotLight);
scene.add(spotLight.target);

createParticles(scene);

// const helper2 = new THREE.CameraHelper( spotLight.shadow.camera );
// scene.add( helper2 );

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

let scrollSpeed = (function () {
  let lastPos, newPos, delta;

  function clear() {
    lastPos = null;
    delta = 0;
  }

  clear();

  return function () {
    newPos = controls.getAzimuthalAngle();
    if (lastPos != null) {
      // && newPos < maxScroll
      delta = newPos - lastPos;
    }
    if (delta == 1 || delta == -1) delta = 0;
    if (delta < -1) {
      delta = -delta;
    }
    //else if (delta > 1) cyclist.rotation.z = 0;
    if (action2) action2.timeScale = delta * 160;

    lastPos = newPos;
    return delta;
  };
})();

const spans = document
  .getElementById("menuToggle")
  .getElementsByTagName("span");
const light = new THREE.AmbientLight(0xfffdfeff); // soft white light
scene.add(light);
spotLight.visible = true;
spotLight.castShadow = true;
sunLight.visible = false;
sunLight.castShadow = false;
canvas.style.background = "black";
hemiLight.intensity = 0.01;
document.body.style.color = "white";
for (const span of spans) {
  span.style.background = "white";
}
/**
 * Animate
 */
let azimuthalAngle;
let cyclePos = 0;
let i = 0;
let g = 0.8;

const popups = document.getElementsByClassName("popup");
const clock = new THREE.Clock();

const tick = () => {
  // Update controls
  controls.update();

  // Update cyclist position
  azimuthalAngle = controls.getAzimuthalAngle();
  cyclePos = azimuthalAngle / (Math.PI * 2);
  if (cyclePos < 0) {
    cyclePos = 0.5 + (0.5 + cyclePos);
  }

  spotLight.position.x = Math.sin(azimuthalAngle) * 12.4;
  spotLight.position.z = Math.cos(azimuthalAngle) * 12.4;
  spotLight.target.position.x = Math.sin(azimuthalAngle) * 9;
  spotLight.target.position.z = Math.cos(azimuthalAngle) * 9;

  if (cyclist) {
    cyclist.position.x = Math.sin(azimuthalAngle) * 11.4;
    cyclist.position.z = Math.cos(azimuthalAngle) * 11.4;
    cyclist.rotation.y = azimuthalAngle;
  }

  if (azimuthalAngle >= 0.1 || azimuthalAngle < -0.1) {
    document.getElementById("instructions").classList.add("hidden");
  }

  for (let i = 0; i < popups.length; i++) {
    if (
      cyclePos >= 0.025 + i / popups.length &&
      cyclePos < 0.08 + i / popups.length
    ) {
      popups[i].classList.remove("hidden");
      popups[i].classList.add("visible");
    } else {
      popups[i].classList.add("hidden");
      popups[i].classList.remove("visible");
    }
  }

  // Animation Mixer
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  if (mixer2) mixer2.update(delta);
  if (mixer3) mixer3.update(delta);
  if (mixer4) mixer4.update(delta);
  if (mixer5) mixer5.update(delta);

  scrollSpeed();

  TWEEN.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
