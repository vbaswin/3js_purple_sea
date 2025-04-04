import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVetexShader from '/shaders/water/vertex.glsl';
import waterFragmentShader from '/shaders/water/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Colors
debugObject.depthColor = '#71476d'
debugObject.surfaceColor = '#ffffff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
	vertexShader: waterVetexShader,
	fragmentShader: waterFragmentShader,
	side: THREE.DoubleSide,
	uniforms: {
		uBigWavesElevation: {value: 0.2},
		uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
		uTime: {value: 0.0},
		uBigWavesSpeed: {value: 0.75},
		uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
		uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
		uColorOffset: {value: 0.5},
		uColorMultiplier: {value: 2},
		uSmallTimeSpeed: {value: 0.2},
		uSmallFrequency: {value: 3.0},
		uSmallElevation: {value: 0.15}
	}
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequency.x');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequency.y');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(1).step(0.001).name('uBigWavesSpeed');

// update the waterMaterial uniforms when the color changes with onChange(...):
// we are using color from debugobject and not directly from the uniiform(which is linear value not srgb)
gui.addColor(debugObject, 'depthColor').onChange(() => {
	waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
})

gui.addColor(debugObject, 'surfaceColor').onChange(() => {
	waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
})

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(1).step(0.001).name('uColorMultiplier');

gui.add(waterMaterial.uniforms.uSmallTimeSpeed, 'value').min(0).max(1).step(0.001).name('uSmallTimeSpeed');
gui.add(waterMaterial.uniforms.uSmallFrequency, 'value').min(0).max(10).step(0.001).name('uSmallFrequency');
gui.add(waterMaterial.uniforms.uSmallElevation, 'value').min(0).max(1).step(0.001).name('uSmallElevation');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

	waterMaterial.uniforms.uTime.value = elapsedTime; // not just utime, it is utime.valueeeee
	// console.log(waterMaterial.uniforms.uTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()