import "./style.css";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PointLight,
  Mesh,
  MeshToonMaterial,
  MeshMatcapMaterial,
  SphereGeometry,
  TorusGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
// import { createPopper } from "@popperjs/core";

const THREE = {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PointLight,
  Mesh,
  MeshToonMaterial,
  MeshMatcapMaterial,
  SphereGeometry,
  TorusGeometry,
};
const cssHeight = "100%";
const cssWidth = "100%";
// const app = document.querySelector<HTMLDivElement>("#app")!;
const cv = document.querySelector<HTMLCanvasElement>("#can")!;
// const pop = document.querySelector("#pop") as HTMLDivElement;
// const tooltip = document.querySelector("#tooltip") as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, cv.width / cv.height, 0.1, 1000);
//
renderer.setPixelRatio(devicePixelRatio);
// renderer.setClearColor(0x555555);
camera.position.z = 7;
resizeCanvas();
const controls = new OrbitControls(camera, cv);

const pointLight = new THREE.PointLight(0xffffff, 1, Infinity);
pointLight.lookAt(controls.target);
camera.add(pointLight);
scene.add(camera);

let material = "Toon";

const nucleus = create("Sphere", material, [0.5], {
  color: 0xff4444,
  // wireframe: true,
  // emissive: 0xffffff,
});
const shell = create("Torus", material, [3, 0.01, 100, 100]);
const electron = create("Sphere", material, [0.2], {
  color: 0x4444ff,
});
electron.position.y = -2;
const atom = new THREE.Mesh();
atom.add(nucleus);
atom.add(shell);
atom.add(electron);
scene.add(atom);
// let angle;
// let n = 100;
// const a = 0;
// const b = 0.07;
// for (let i = 0; i < n; i++) {
//   const angle = 0.1 * i;
//   const ball = create("Sphere", "Toon", [0.2], {
//     color: 0x4444ff,
//   });
//   ball.position.x = (a + b * angle) * Math.cos(angle);
//   ball.position.y = (a + b * angle) * Math.sin(angle);
//   scene.add(ball);
// }
let text = new THREE.Mesh();
let loader = new FontLoader();
loader.load("./res/Noto Sans_Regular.json", function (font) {
  var textGeometry = new TextGeometry("Hydrogen", {
    font: font,
    size: 1,
    height: 0,
    curveSegments: 12,
    // });
    // size: 1,
    // height: 1,
    // curveSegments: 12,

    // bevelThickness: 1,
    // bevelSize: 1,
    // bevelEnabled: true,
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();
  var textMaterial = new THREE.MeshToonMaterial({
    color: 0xffffff,
    // emissive: 0,
    // specular: 0xffffff,
  });

  var mesh = new THREE.Mesh(textGeometry, textMaterial);
  mesh.position.y = 4;
  // mesh.position.z = 2;
  mesh.lookAt(camera.position);
  atom.add(mesh);
  text = mesh;
});

controls.addEventListener("change", () => text.lookAt(camera.position));

render();
let start = performance.now();
let t = 0;
// let pos = electron.position.unproject(camera);
function animate() {
  render();
  t = performance.now() - start;
  electron.position.x = Math.sin((t * 1) / 1000) * 3;
  electron.position.y = Math.cos((t * 1) / 1000) * 3;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
function resizeCanvas() {
  cv.width = 0;
  cv.height = 0;
  cv.style.width = cssWidth;
  cv.style.height = cssHeight;
  renderer.setSize(cv.clientWidth, cv.clientHeight);
  camera.aspect = cv.clientWidth / cv.clientHeight;
  camera.updateProjectionMatrix();
  render();
}
function render() {
  renderer.render(scene, camera);
}

onresize = function () {
  resizeCanvas();
};
// type matParams = THREE
function create(geom: string, mat: string, geomArgs?: any, matArgs?: any) {
  const g = new (THREE as any)[`${geom}Geometry`](
    ...geomArgs
  ) as THREE.BufferGeometry;
  const m = new (THREE as any)[`Mesh${mat}Material`](matArgs) as THREE.Material;
  const obj = new THREE.Mesh(g, m);
  // scene.add(obj);
  return obj;
}

// createPopper(pop, tooltip, {
//   placement: "top",
// });
