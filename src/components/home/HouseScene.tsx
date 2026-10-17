"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/*
  Maquete digital da Residência Mirante.
  Coordenadas em metros, iguais às do modelo usado nas renderizações (Blender: X leste, Y profundidade, Z altura).
  Conversão para three.js: (x, y, z) -> (x, z, -y).
*/

type Box = [number, number, number, number, number, number];

function toThree([x0, y0, z0, x1, y1, z1]: Box) {
  return {
    pos: new THREE.Vector3((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2),
    size: new THREE.Vector3(x1 - x0, z1 - z0, y1 - y0),
  };
}

function Block({ b, mat, cast = true }: { b: Box; mat: THREE.Material; cast?: boolean }) {
  const { pos, size } = useMemo(() => toThree(b), [b]);
  return (
    <mesh position={pos} castShadow={cast} receiveShadow material={mat}>
      <boxGeometry args={[size.x, size.y, size.z]} />
    </mesh>
  );
}

function useMaterials() {
  return useMemo(
    () => ({
      model: new THREE.MeshStandardMaterial({ color: "#e9e4da", roughness: 0.92 }),
      concrete: new THREE.MeshStandardMaterial({ color: "#cfc9bf", roughness: 0.9 }),
      stone: new THREE.MeshStandardMaterial({ color: "#b9ab96", roughness: 0.95 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9a8061", roughness: 0.75 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#c9d6d4", roughness: 0.05, transmission: 0, transparent: true, opacity: 0.35, metalness: 0 }),
      water: new THREE.MeshStandardMaterial({ color: "#6f8584", roughness: 0.08, metalness: 0.2 }),
      ground: new THREE.MeshStandardMaterial({ color: "#d9d3c7", roughness: 1 }),
      tree: new THREE.MeshStandardMaterial({ color: "#c9c2b4", roughness: 1 }),
      dark: new THREE.MeshStandardMaterial({ color: "#2b2b28", roughness: 0.6 }),
    }),
    [],
  );
}

const ground: Box[] = [[-16, -2.6, -1.6, 12, 10, 0.02]];
const groundFloor: Box[] = [
  [-10, 0.6, 0.02, 8, 10, 0.25],
  [5.6, 1.2, 0.25, 8, 9.5, 3.4],
];
const groundWood: Box[] = [[-10, 9.0, 0.25, 5.6, 9.5, 3.4]];
const groundGlass: Box[] = [
  [-9.6, 1.18, 0.25, 5.6, 1.22, 3.4],
  [-9.62, 1.2, 0.25, -9.58, 9.0, 3.4],
];
const upper: Box[] = [
  [-14, -0.4, 3.4, 9, 9.5, 3.85],
  [-14, -0.4, 6.3, 9, 9.5, 6.8],
  [-14, -0.4, 3.85, -13.4, 9.5, 6.3],
  [8.4, -0.4, 3.85, 9, 9.5, 6.3],
  [-13.4, 9.0, 3.85, 8.4, 9.5, 6.3],
];
const upperGlass: Box[] = [[-13.4, 0.2, 3.85, 8.4, 0.24, 6.3]];
const brise: Box[] = Array.from({ length: 48 }, (_, i) => {
  const x = -13.2 + i * 0.2;
  return [x, -0.32, 3.85, x + 0.07, -0.18, 6.3] as Box;
});
const pergola: Box[] = [[9, -2.4, 3.3, 15, 6, 3.42]];
const pool: Box[] = [[-14, -8.2, -0.5, 2, -2.6, -0.08]];
const poolEdge: Box[] = [
  [-14.3, -8.4, -1.6, 2.3, -8.2, -0.06],
  [2, -8.4, -1.6, 2.3, -2.6, 0.0],
  [-14.3, -8.4, -1.6, -14, -2.6, 0.0],
];
const deck: Box[] = [[2.3, -8.4, -1.6, 12, -2.6, 0.0]];
const furniture: Box[] = [
  [-7.5, 3.5, 0.25, -4.0, 4.4, 0.65],
  [-1.5, 3.0, 0.25, 2.5, 4.2, 1.0],
  [-1.5, 6.5, 0.25, 4.0, 8.6, 0.78],
];
const trees: [number, number, number, number][] = [
  [-25, 3, 7, 3.2],
  [-22, 13, 9, 2.6],
  [20, 12, 8, 3],
  [26, 3, 6.5, 2.6],
  [-12, 15, 10, 3.4],
  [11, 16, 8.5, 2.8],
  [-31, -5, 6, 2.4],
  [-2.5, 7.8, 3.2, 1.4],
];

function Tree({ x, y, h, r, mat }: { x: number; y: number; h: number; r: number; mat: THREE.Material }) {
  return (
    <group position={[x, -1.6, -y]}>
      <mesh position={[0, h * 0.35, 0]} castShadow material={mat}>
        <cylinderGeometry args={[0.08, 0.1, h * 0.7, 6]} />
      </mesh>
      <mesh position={[0, h * 0.78, 0]} castShadow material={mat}>
        <icosahedronGeometry args={[r, 1]} />
      </mesh>
    </group>
  );
}

/** Sol: azimute e altura calculados a partir da hora (aproximação para latitude ~23°S). */
function sunFromHour(hour: number) {
  const t = (hour - 6) / 13; // 6h -> 19h
  const az = THREE.MathUtils.lerp(Math.PI * 0.55, -Math.PI * 0.55, t);
  const el = Math.sin(Math.PI * t) * THREE.MathUtils.degToRad(68) + THREE.MathUtils.degToRad(2);
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el) * 0.6 + 0.4);
  return { dir: dir.normalize(), el };
}

function Lighting({ hour }: { hour: number }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();
  const target = useRef({ hour });
  target.current.hour = hour;
  const cur = useRef(hour);
  const warm = useMemo(() => new THREE.Color("#ffb877"), []);
  const day = useMemo(() => new THREE.Color("#fff6ea"), []);
  const bgDay = useMemo(() => new THREE.Color("#1f201d"), []);
  const bgDusk = useMemo(() => new THREE.Color("#2a211a"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((_, dt) => {
    cur.current = THREE.MathUtils.damp(cur.current, target.current.hour, 3.2, dt);
    const { dir, el } = sunFromHour(cur.current);
    const low = 1 - THREE.MathUtils.clamp(el / THREE.MathUtils.degToRad(35), 0, 1);
    if (sun.current) {
      sun.current.position.copy(dir.clone().multiplyScalar(60));
      sun.current.color.copy(tmp.copy(day).lerp(warm, low));
      sun.current.intensity = 1.2 + 2.2 * Math.min(1, el * 2.4);
    }
    if (hemi.current) hemi.current.intensity = 0.55 + 0.5 * (1 - low);
    scene.background = tmp.copy(bgDay).lerp(bgDusk, low * 0.8).clone();
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#f3ede2", "#4a4740", 0.8]} />
      <directionalLight
        ref={sun}
        castShadow
        intensity={2.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
    </>
  );
}

function House({ exploded, scrollTurn }: { exploded: boolean; scrollTurn: React.RefObject<number> }) {
  const m = useMaterials();
  const top = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (top.current) top.current.position.y = THREE.MathUtils.damp(top.current.position.y, exploded ? 6 : 0, 3, dt);
    if (root.current) root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, (scrollTurn.current ?? 0) * 0.5 - 0.25, 4, dt);
  });
  return (
    <group ref={root}>
      {/* plataforma de pedra e terreno */}
      <mesh position={[0, -1.62, 0]} receiveShadow material={m.ground} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[46, 64]} />
      </mesh>
      {ground.map((b, i) => (
        <Block key={i} b={b} mat={m.stone} />
      ))}
      {groundFloor.map((b, i) => (
        <Block key={i} b={b} mat={i === 0 ? m.model : m.stone} />
      ))}
      {groundWood.map((b, i) => (
        <Block key={i} b={b} mat={m.wood} />
      ))}
      {groundGlass.map((b, i) => (
        <Block key={i} b={b} mat={m.glass} cast={false} />
      ))}
      {furniture.map((b, i) => (
        <Block key={i} b={b} mat={m.model} />
      ))}
      {pool.map((b, i) => (
        <Block key={i} b={b} mat={m.water} cast={false} />
      ))}
      {poolEdge.map((b, i) => (
        <Block key={i} b={b} mat={m.stone} />
      ))}
      {deck.map((b, i) => (
        <Block key={i} b={b} mat={m.wood} />
      ))}
      {pergola.map((b, i) => (
        <Block key={i} b={b} mat={m.concrete} />
      ))}
      <mesh position={[14.6, 1.65, 2.0]} castShadow material={m.dark}>
        <cylinderGeometry args={[0.09, 0.09, 3.3, 12]} />
      </mesh>
      <group ref={top}>
        {upper.map((b, i) => (
          <Block key={i} b={b} mat={m.concrete} />
        ))}
        {upperGlass.map((b, i) => (
          <Block key={i} b={b} mat={m.glass} cast={false} />
        ))}
        {brise.map((b, i) => (
          <Block key={i} b={b} mat={m.wood} />
        ))}
      </group>
      {trees.map(([x, y, h, r], i) => (
        <Tree key={i} x={x} y={y} h={h} r={r} mat={m.tree} />
      ))}
    </group>
  );
}

export default function HouseScene({
  hour,
  exploded,
  scrollTurn,
  interactive,
  active,
  onReady,
}: {
  hour: number;
  exploded: boolean;
  scrollTurn: React.RefObject<number>;
  interactive: boolean;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [46, 30, 54], fov: 28, near: 1, far: 400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady();
      }}
    >
      <fog attach="fog" args={["#1f201d", 70, 160]} />
      <Lighting hour={hour} />
      <group position={[2, 0, 0]}>
        <House exploded={exploded} scrollTurn={scrollTurn} />
      </group>
      {interactive && (
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.44}
        minAzimuthAngle={-Math.PI * 0.15}
        maxAzimuthAngle={Math.PI * 0.62}
        target={[0, 1.5, 0]}
      />
      )}
    </Canvas>
  );
}
