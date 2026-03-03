"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Float, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

function Bus({ start, end, isAnimating, onComplete }: {
    start: [number, number];
    end: [number, number];
    isAnimating: boolean;
    onComplete: () => void;
}) {
    const busRef = useRef<THREE.Group>(null);
    const globeRadius = 5;

    const { startPos, endPos, curve } = useMemo(() => {
        const s = latLngToVector3(start[0], start[1], globeRadius);
        const e = latLngToVector3(end[0], end[1], globeRadius);

        const mid = new THREE.Vector3()
            .addVectors(s, e)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(globeRadius * 1.3);

        const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
        return { startPos: s, endPos: e, curve };
    }, [start, end]);

    useEffect(() => {
        if (isAnimating && busRef.current) {
            const bus = busRef.current;
            const data = { t: 0 };

            gsap.to(data, {
                t: 1,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    const point = curve.getPoint(data.t);
                    bus.position.copy(point);
                    if (data.t < 0.99) {
                        const nextPoint = curve.getPoint(data.t + 0.01);
                        bus.lookAt(nextPoint);
                    }
                },
                onComplete: onComplete
            });
        }
    }, [isAnimating, curve, onComplete]);

    return (
        <group>
            {isAnimating && (
                <mesh>
                    <tubeGeometry args={[curve, 100, 0.05, 8, false]} />
                    <meshStandardMaterial
                        color="#FFFFFF"
                        emissive="#FF6B00"
                        emissiveIntensity={10}
                        transparent
                        opacity={1}
                    />
                </mesh>
            )}

            <group ref={busRef} position={startPos}>
                {/* Main Bus Body */}
                <mesh castShadow>
                    <boxGeometry args={[0.35, 0.2, 0.6]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.8} />
                </mesh>

                {/* Windshield */}
                <mesh position={[0, 0.05, 0.25]}>
                    <boxGeometry args={[0.3, 0.1, 0.11]} />
                    <meshStandardMaterial color="#333" roughness={0.1} />
                </mesh>

                {/* Powerful Headlights */}
                <group position={[0, -0.05, 0.3]}>
                    <mesh position={[0.12, 0, 0]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                    <mesh position={[-0.12, 0, 0]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial color="#FFFFFF" />
                    </mesh>
                    <spotLight
                        position={[0, 0, 0.1]}
                        angle={0.6}
                        penumbra={0.5}
                        intensity={10}
                        distance={5}
                        color="#FFF"
                    />
                </group>

                {/* Light Trail Glow */}
                <pointLight intensity={3} distance={2} color="#FF6B00" />
            </group>

            <mesh position={endPos}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
                <pointLight intensity={3} distance={2} color="#FFF" />
            </mesh>

            {!isAnimating && <SuccessEffect position={endPos} />}
        </group>
    );
}

function MainGlobe() {
    const globeRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (globeRef.current && !state.mouse.x) {
            globeRef.current.rotation.y += 0.001;
        }
    });

    return (
        <>
            <Sphere ref={globeRef} args={[5, 64, 64]}>
                <meshStandardMaterial
                    roughness={0.6}
                    metalness={0.1}
                    color="#FF8C33"
                    wireframe
                />
            </Sphere>

            <Sphere args={[5.1, 64, 64]}>
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </Sphere>

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Stars radius={5} depth={0.5} count={150} factor={2} saturation={0} fade />
            </Float>
        </>
    );
}

function SuccessEffect({ position }: { position: THREE.Vector3 }) {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.01;
        }
    });

    const points = useMemo(() => {
        const p = new Float32Array(150);
        for (let i = 0; i < 150; i += 3) {
            p[i] = (Math.random() - 0.5) * 1.5;
            p[i + 1] = (Math.random() - 0.5) * 1.5;
            p[i + 2] = (Math.random() - 0.5) * 1.5;
        }
        return p;
    }, []);

    return (
        <points ref={particlesRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.06} color="#FFFFFF" transparent opacity={1} />
        </points>
    );
}

function CameraController({ targetPos }: { targetPos: [number, number] | null }) {
    const { camera } = useThree();

    useEffect(() => {
        if (!targetPos) {
            const initialFocus = latLngToVector3(11.1271, 78.6569, 14);
            camera.position.set(initialFocus.x, initialFocus.y, initialFocus.z);
        }
    }, [camera, targetPos]);

    useEffect(() => {
        if (targetPos) {
            const pos = latLngToVector3(targetPos[0], targetPos[1], 8);
            gsap.to(camera.position, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                duration: 2.5,
                ease: "power2.inOut",
            });
        }
    }, [targetPos, camera]);

    return null;
}

interface EnhancedGlobeProps {
    selection: { from: [number, number]; to: [number, number] } | null;
    searchId?: number;
    onAnimationComplete: () => void;
}

export default function EnhancedGlobe({ selection, searchId, onAnimationComplete }: EnhancedGlobeProps) {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#FFF" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#FF6B00" />

                <MainGlobe />

                {selection && (
                    <Bus
                        key={searchId}
                        start={selection.from}
                        end={selection.to}
                        isAnimating={true}
                        onComplete={onAnimationComplete}
                    />
                )}

                <CameraController targetPos={selection?.to || null} />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={20}
                    autoRotate={!selection}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
