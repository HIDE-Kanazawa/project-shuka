/*
 * Three.js Lanterns and Koi Animation
 * 
 * Original code by prisoner849 (https://codepen.io/prisoner849/pen/WNQNdpv)
 * Licensed under MIT License
 * 
 * Copyright (c) 2024 prisoner849
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Three.js 3Dシーン初期化関数
 * 鯉と提灯のアニメーションを含むWebGL背景エフェクトを生成
 * prisoner849氏の作品をベースに和風テイストに改良
 */
// DOM読み込み後にThree.jsシーンを初期化
function initThreeJsScene() {
  if (window.__threeSceneInitialized) return;
  window.__threeSceneInitialized = true;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, -25, 80);
  
  var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setClearColor(0x87CEEB, 0.2);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Add canvas with background styling
  renderer.domElement.className = 'three-js-canvas';
  document.body.appendChild(renderer.domElement);

  // OrbitControls removed: background effect does not need user interaction

  // 鯉をより美しく見せるためのライティング
  let ambientLight = new THREE.AmbientLight(0x404040, 0.4); // 柔らかい環境光
  scene.add(ambientLight);
  
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);
  
  let pointLight = new THREE.PointLight(0x87CEEB, 0.6, 100); // 水中らしい青い光
  pointLight.position.set(0, 20, 0);
  scene.add(pointLight);


  // Koi School (Multiple Koi)
  let oUs = [];
  let koiCount = 4; // 4匹の鯉

  let loader = new THREE.STLLoader();
  //https://clara.io/view/b47726c8-02cf-4eb5-b275-d9b2be591bad
  loader.load("https://cywarr.github.io/small-shop/fish.stl", objGeom => {

    // Create multiple paths for koi school
    for (let koiIndex = 0; koiIndex < koiCount; koiIndex++) {
      // Different path for each koi
      let baseVector = new THREE.Vector3(35 + Math.random() * 10, 0, 0);
      let axis = new THREE.Vector3(0, 1, 0);
      let cPts = [];
      let cSegments = 6;
      let cStep = Math.PI * 2 / cSegments;
      for (let i = 0; i < cSegments; i++){
        cPts.push(
          new THREE.Vector3().copy(baseVector)
          .applyAxisAngle(axis, cStep * i + (koiIndex * 0.5))
          .setY(THREE.MathUtils.randFloat(-15, 15))
        );
      }
      let curve = new THREE.CatmullRomCurve3(cPts);
      curve.closed = true;

      let numPoints = 511;
      let cPoints = curve.getSpacedPoints(numPoints);
      let cObjects = curve.computeFrenetFrames(numPoints, true);

      // data texture for this koi
      let data = [];
      cPoints.forEach( v => { data.push(v.x, v.y, v.z);} );
      cObjects.binormals.forEach( v => { data.push(v.x, v.y, v.z);} );
      cObjects.normals.forEach( v => { data.push(v.x, v.y, v.z);} );
      cObjects.tangents.forEach( v => { data.push(v.x, v.y, v.z);} );

      let dataArray = new Float32Array(data);
      let tex = new THREE.DataTexture(dataArray, numPoints + 1, 4, THREE.RGBFormat, THREE.FloatType);
      tex.magFilter = THREE.NearestFilter;
      
      // Prepare geometry for this koi
      let koiGeom = objGeom.clone();
      koiGeom.center();
      koiGeom.rotateX(-Math.PI * 0.5);
      let scale = 0.4 + Math.random() * 0.2; // Varying sizes
      koiGeom.scale(scale, scale, scale);
      let objBox = new THREE.Box3().setFromBufferAttribute(koiGeom.getAttribute("position"));
      let objSize = new THREE.Vector3();
      objBox.getSize(objSize);

      let objUniforms = {
        uSpatialTexture: {value: tex},
        uTextureSize: {value: new THREE.Vector2(numPoints + 1, 4)},
        uTime: {value: 0},
        uLengthRatio: {value: objSize.z / curve.cacheArcLengths[200]},
        uObjSize: {value: objSize},
        uTimeOffset: {value: koiIndex * 0.8} // Different timing for each koi
      }
      oUs.push(objUniforms);

      // 錦鯉らしい色のバリエーション
      let koiColors = [0xff6600, 0xFFFFFF, 0xFF0000, 0xFFD700]; // オレンジ、白、赤、金
      
      let objMat = new THREE.MeshBasicMaterial({
        color: koiColors[koiIndex % koiColors.length],
        wireframe: true
      });
      
      objMat.onBeforeCompile = shader => {
        shader.uniforms.uSpatialTexture = objUniforms.uSpatialTexture;
        shader.uniforms.uTextureSize = objUniforms.uTextureSize;
        shader.uniforms.uTime = objUniforms.uTime;
        shader.uniforms.uLengthRatio = objUniforms.uLengthRatio;
        shader.uniforms.uObjSize = objUniforms.uObjSize;
        shader.uniforms.uTimeOffset = objUniforms.uTimeOffset;

        shader.vertexShader = `
          uniform sampler2D uSpatialTexture;
          uniform vec2 uTextureSize;
          uniform float uTime;
          uniform float uLengthRatio;
          uniform vec3 uObjSize;
          uniform float uTimeOffset;

          struct splineData {
            vec3 point;
            vec3 binormal;
            vec3 normal;
          };

          splineData getSplineData(float t){
            float step = 1. / uTextureSize.y;
            float halfStep = step * 0.5;
            splineData sd;
            sd.point    = texture2D(uSpatialTexture, vec2(t, step * 0. + halfStep)).rgb;
            sd.binormal = texture2D(uSpatialTexture, vec2(t, step * 1. + halfStep)).rgb;
            sd.normal   = texture2D(uSpatialTexture, vec2(t, step * 2. + halfStep)).rgb;
            return sd;
          }
        ` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>

          vec3 pos = position;

          float wStep = 1. / uTextureSize.x;
          float hWStep = wStep * 0.5;

          float d = pos.z / uObjSize.z;
          float t = fract(((uTime + uTimeOffset) * 0.08) + (d * uLengthRatio));
          float numPrev = floor(t / wStep);
          float numNext = numPrev + 1.;
          float tPrev = numPrev * wStep + hWStep;
          float tNext = numNext * wStep + hWStep;
          splineData splinePrev = getSplineData(tPrev);
          splineData splineNext = getSplineData(tNext);

          float f = (t - tPrev) / wStep;
          vec3 P = mix(splinePrev.point, splineNext.point, f);
          vec3 B = mix(splinePrev.binormal, splineNext.binormal, f);
          vec3 N = mix(splinePrev.normal, splineNext.normal, f);

          transformed = P + (N * pos.x) + (B * pos.y);
          `
        );
      }
      let obj = new THREE.Mesh(koiGeom, objMat);
      scene.add(obj);
    }
  });

  var clock = new THREE.Clock();

  function renderFrame(){
    let t = clock.getElapsedTime();
    oUs.forEach(ou => {ou.uTime.value = t;});
    renderer.render(scene, camera);
  }

  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch(e) {}

  if (prefersReduced) {
    // Render once for reduced motion users
    renderFrame();
  } else {
    renderer.setAnimationLoop(renderFrame);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Page Visibility: pause/resume animation loop to save resources
  function pause(){ renderer.setAnimationLoop(null); }
  function resume(){ if (!prefersReduced) renderer.setAnimationLoop(renderFrame); }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else resume();
  });
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', resume);

  // Expose simple controls for debugging
  window.__threeSceneControl = { pause, resume, renderer };
}

// Initialize when DOM is loaded and Three.js is available
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    initThreeJsScene();
  } else {
    console.error('Three.js not loaded');
  }
});

// Ensure init is reachable when loaded after DOMContentLoaded via lazy loader
window.initThreeJsScene = window.initThreeJsScene || initThreeJsScene;