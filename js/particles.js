import * as THREE from "/js/three.js";

export function createParticles(scene) {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
  });

  const particlesPositions = [];

  for (let i = 0; i < 8000; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = Math.random() * 10 - 5;
    const z = (Math.random() - 0.5) * 20;

    particlesPositions.push(x, y, z);
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particlesPositions, 3)
  );

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  particles.scale.set(4, 4, 4);

  scene.add(particles);

  function animate() {
    particles.rotation.y += 0.0004; 
    requestAnimationFrame(animate);
  }
  animate();
}
