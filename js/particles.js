import * as THREE from "/js/three.js";

export function createParticles(scene) {
  // Create a geometry to hold the particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
  });

  // Create an array to store particle positions
  const particlesPositions = [];

  // Add random particle positions
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = Math.random() * 10 - 5 ;
    const z = (Math.random() - 0.5) * 20;

    particlesPositions.push(x, y, z);
  }

  // Add positions to the geometry
  particlesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particlesPositions, 3)
  );

  // Create the particle system
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  particles.scale.set(4, 4, 4);

  // Add the particle system to the scene
  scene.add(particles);
}