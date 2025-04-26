import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Cube({ rotationSpeed, isRotating }) {
  const xLayerRef = useRef();
  const yLayerRef = useRef();
  const zLayerRef = useRef();

  const colors = {
    red: new THREE.Color(0xff0000),
    green: new THREE.Color(0x00ff00),
    blue: new THREE.Color(0x0000ff),
    white: new THREE.Color(0xffffff),
    yellow: new THREE.Color(0xffff00),
    orange: new THREE.Color(0xffa500),
  };

  const createSmallCube = (x, y, z) => {
    const materials = [
      new THREE.MeshStandardMaterial({ color: colors.white }), // right
      new THREE.MeshStandardMaterial({ color: colors.blue }),  // left
      new THREE.MeshStandardMaterial({ color: colors.yellow }),// top
      new THREE.MeshStandardMaterial({ color: colors.white }), // bottom
      new THREE.MeshStandardMaterial({ color: colors.red }),   // front
      new THREE.MeshStandardMaterial({ color: colors.green }), // back
    ];

    if (x === 1) materials[0] = new THREE.MeshStandardMaterial({ color: colors.orange });
    if (x === -1) materials[1] = new THREE.MeshStandardMaterial({ color: colors.red });
    if (y === 1) materials[2] = new THREE.MeshStandardMaterial({ color: colors.yellow });
    if (y === -1) materials[3] = new THREE.MeshStandardMaterial({ color: colors.white });
    if (z === 1) materials[4] = new THREE.MeshStandardMaterial({ color: colors.blue });
    if (z === -1) materials[5] = new THREE.MeshStandardMaterial({ color: colors.green });
    
    return (
      <mesh key={`${x}${y}${z}`} position={[x, y, z]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>
    );
  };

  const smallCubesX = [];
  const smallCubesY = [];
  const smallCubesZ = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        if (x === 1) smallCubesX.push(createSmallCube(x, y, z));
        if (y === 0) smallCubesY.push(createSmallCube(x, y, z));
        if (z === -1) smallCubesZ.push(createSmallCube(x, y, z));
      }
    }
  }

  useFrame(() => {
    if (isRotating) {
      if (xLayerRef.current) {
        xLayerRef.current.rotation.x += rotationSpeed;
      }
      if (yLayerRef.current) {
        yLayerRef.current.rotation.y += rotationSpeed;
      }
      if (zLayerRef.current) {
        zLayerRef.current.rotation.z += rotationSpeed;
      }
    }
  });

  return (
    <group>
      <group ref={xLayerRef}>
        {smallCubesX}
      </group>
      <group ref={yLayerRef}>
        {smallCubesY}
      </group>
      <group ref={zLayerRef}>
        {smallCubesZ}
      </group>
    </group>
  );
}



function Animation() {
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube rotationSpeed={rotationSpeed} isRotating={isRotating} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white'
      }}>
        <label>
          Rotation Speed:
          <input 
            type="range" 
            min="0" 
            max="0.05" 
            step="0.001" 
            value={rotationSpeed} 
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
          />
        </label>
        <button onClick={() => setIsRotating(!isRotating)} style={{ marginLeft: '10px' }}>
          {isRotating ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}

export default Animation;