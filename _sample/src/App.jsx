import { Canvas, useLoader } from "@react-three/fiber";
import {
	ScrollControls,
	useScroll,
	OrbitControls,
	useAnimations,
} from "@react-three/drei";
import { getProject, val } from "@theatre/core";
//import theatreState from "./theatreState.json";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import {
	SheetProvider,
	PerspectiveCamera,
	useCurrentSheet,
	editable as e,
} from "@theatre/r3f";
import { useEffect, useRef } from "react";

import { GLTFAnimEvent } from "theatre-extensions-animations";

function Scene() {
	const gltf = useLoader(GLTFLoader, "/test_animation.glb");

	console.log("scne", gltf);

	const modelAnimations = useAnimations(gltf.animations);

	if (modelAnimations) GLTFAnimEvent(modelAnimations);

	return <primitive object={gltf.scene} />;
}

export default function App() {
	/*
  	const sheet = getProject("Fly Through", { state: theatreState }).sheet(
		"Scene"
	);
  	*/

	return (
		<Canvas gl={{ preserveDrawingBuffer: true }}>
			<SheetProvider sheet={getProject("Fly Through").sheet("Scene")}>
				<PerspectiveCamera
					theatreKey="Camera"
					makeDefault
					position={[5, 5, -5]}
					fov={75}
				/>
			</SheetProvider>

			<color attach="background" args={["#ccc"]} />
			<OrbitControls />
			<Scene />
		</Canvas>
	);
}
