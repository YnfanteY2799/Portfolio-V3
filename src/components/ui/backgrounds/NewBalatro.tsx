// components/ui/backgrounds/BalatroModern.tsx
"use client";

import { Canvas, useFrame } from "react-ogl";
import { useRef, useMemo } from "react";

interface BalatroProps {
  spinRotation?: number;
  spinSpeed?: number;
  offset?: [number, number];
  color1?: string;
  color2?: string;
  color3?: string;
  contrast?: number;
  lighting?: number;
  spinAmount?: number;
  pixelFilter?: number;
  spinEase?: number;
  isRotate?: boolean;
  mouseInteraction?: boolean;
}

function hexToVec4(hex: string): [number, number, number, number] {
  const h = hex.replace("#", "");
  if (!h) return [0, 0, 0, 1];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return [r, g, b, a];
}

// Your vertex shader (unchanged)
const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

// ←←← PASTE YOUR FULL ORIGINAL FRAGMENT SHADER HERE (exactly as before) ←←←
const fragment = /* glsl */ `
  precision highp float;
  #define PI 3.14159265359

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float uSpinRotation;
  uniform float uSpinSpeed;
  uniform vec2 uOffset;
  uniform vec4 uColor1;
  uniform vec4 uColor2;
  uniform vec4 uColor3;
  uniform float uContrast;
  uniform float uLighting;
  uniform float uSpinAmount;
  uniform float uPixelFilter;
  uniform float uSpinEase;
  uniform bool uIsRotate;
  uniform vec2 uMouse;

  varying vec2 vUv;

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
    // ... your entire effect() function here (copy-paste from original) ...
  }

  void main() {
    vec2 uv = vUv * iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv);
  }
`;

export default function BalatroModern({
  spinRotation = -2,
  spinSpeed = 7,
  offset = [0, 0],
  color1 = "#DE443B",
  color2 = "#006BB4",
  color3 = "#162325",
  contrast = 3.5,
  lighting = 0.4,
  spinAmount = 0.25,
  pixelFilter = 745,
  spinEase = 1,
  isRotate = false,
  mouseInteraction = true,
}: BalatroProps) {
  const meshRef = useRef<any>(null);

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: [1, 1, 1] as [number, number, number] },
      uSpinRotation: { value: spinRotation },
      uSpinSpeed: { value: spinSpeed },
      uOffset: { value: offset },
      uColor1: { value: hexToVec4(color1!) },
      uColor2: { value: hexToVec4(color2!) },
      uColor3: { value: hexToVec4(color3!) },
      uContrast: { value: contrast },
      uLighting: { value: lighting },
      uSpinAmount: { value: spinAmount },
      uPixelFilter: { value: pixelFilter },
      uSpinEase: { value: spinEase },
      uIsRotate: { value: isRotate },
      uMouse: { value: [0.5, 0.5] as [number, number] },
    }),
    [
      spinRotation,
      spinSpeed,
      offset,
      color1,
      color2,
      color3,
      contrast,
      lighting,
      spinAmount,
      pixelFilter,
      spinEase,
      isRotate,
    ]
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const program = meshRef.current.program;
    program.uniforms.iTime.value = state.clock.getElapsedTime();

    // Correct resolution with DPR
    program.uniforms.iResolution.value = [
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
      state.viewport.aspect,
    ];

    if (mouseInteraction) {
      program.uniforms.uMouse.value = [
        state.mouse.x * 0.5 + 0.5,
        1 - (state.mouse.y * 0.5 + 0.5),
      ];
    }
  });

  return (
    <Canvas dpr={[1, 2]} style={{ position: "absolute", inset: 0 }}>
      <mesh ref={meshRef}>
        <triangle geometry />   {/* built-in full-screen triangle */}
        <program                {/* ← THIS IS THE CORRECT COMPONENT */}
          vertex={vertex}
          fragment={fragment}
          uniforms={uniforms}
        />
      </mesh>
    </Canvas>
  );
}