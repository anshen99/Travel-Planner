'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Globe() {
  const globeRef = useRef()
  
  // Load Earth textures
  const [earthTexture, bumpMap, specularMap] = useTexture([
    '/earth_texture.jpg',
    '/earth_bump.jpg',
    '/earth_specular.jpg'
  ])

  // Create material with proper settings
  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      specularMap: specularMap,
      specular: new THREE.Color('white'),
      shininess: 10,
      emissive: new THREE.Color(0x112244),
      emissiveIntensity: 0.2
    })
  }, [earthTexture, bumpMap, specularMap])

  useFrame(({ clock }) => {
    globeRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <Sphere ref={globeRef} args={[1, 64, 64]}>
      <primitive object={material} attach="material" />
    </Sphere>
  )
} 