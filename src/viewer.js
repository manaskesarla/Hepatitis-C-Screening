import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export async function mountLiver() {
  const host = document.querySelector('#liver-view');
  const status = document.querySelector('#liver-status');
  const geometry = await new STLLoader().loadAsync(import.meta.env.BASE_URL + 'assets/liver.stl');
  geometry.deleteAttribute('normal');
  const surface = mergeVertices(geometry);
  geometry.dispose();
  surface.computeVertexNormals();
  surface.center();
  surface.computeBoundingSphere();
  const scale = 1.6 / surface.boundingSphere.radius;
  surface.scale(scale, scale, scale);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0.35, 0.12, 5.7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.append(renderer.domElement);

  const model = new THREE.Mesh(surface, new THREE.MeshStandardMaterial({
    color: '#ad493d',
    roughness: 0.52,
  }));
  // Convert the anatomy mesh's Z-up axes to the viewer's Y-up axes.
  model.rotation.x = -Math.PI / 2;
  scene.add(model, new THREE.HemisphereLight('#ffe7d8', '#572a35', 2.1));

  const key = new THREE.DirectionalLight('#ffd8bc', 3.1);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight('#ffc19e', 2.6);
  rim.position.set(4, 2, -4);
  scene.add(key, rim);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enablePan = false;
  orbit.minDistance = 3.5;
  orbit.maxDistance = 9;
  orbit.saveState();
  const render = () => renderer.render(scene, camera);

  function resize() {
    const { clientWidth, clientHeight } = host;
    if (!clientWidth || !clientHeight) return;

    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    render();
  }

  orbit.addEventListener('change', render);
  new ResizeObserver(resize).observe(host);
  resize();

  document.querySelectorAll('[data-turn]').forEach(button => {
    button.addEventListener('click', () => {
      camera.position.applyAxisAngle(camera.up, Number(button.dataset.turn) * Math.PI / 8);
      orbit.update();
    });
  });

  document.querySelector('#reset-view').addEventListener('click', () => orbit.reset());
  document.querySelector('.view-controls').hidden = false;
  status.hidden = true;
}
