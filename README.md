# Theatre GLTF Animations to Track Sequence importer

It's develop for Theater.js 0.6.0

It is a module for Theatre.js which allows you to import animation into timeline from a GLTF file.

1) Create the studio and register the extension
2) Import event extension
3) Import model and call event `GLTFAnimEvent(<animations gltf>)`.
4) In `Studio` project a sub tab `GLTF Animations Tracks` will appear with animated elements.

***Knowledge of Bugs:***
    [ ] You need to enable 'Sequence all' so that the script can reassign animation to the selected properties.
    [x] When reloading the page, the bind is not saved.
    [x] Re-order position axies on import animation

***Theater.js bugs:***
    1) Activate secquence for some object: https://github.com/theatre-js/theatre/issues/352

***Videos Samples***

<video width="480" controls>
  <source src="_videos_/1-blender.mp4" type="video/mp4">
</video>
<video width="480" controls>
  <source src="_videos_/2-all-scene.mp4" type="video/mp4">
</video>
<video width="480" controls>
  <source src="_videos_/3-partial.mp4" type="video/mp4">
</video>

## Instalation and integration

1) run `npm i @theatre/extensions-animations`

***main file***
```javascript
    import animationsExtension from "theatre-extensions-animations";
    ...
    studio.extend(animationsExtension);
    studio.initialize();
    ...
```

Example with `useLoader` + `drei`
***project file***
```javascript 
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";
...
import { GLTFAnimEvent } from "theatre-extensions-animations";
...

//function in react
function Scene() {
	const gltf = useLoader(GLTFLoader, "/test_animation.glb");
	if (gltf) GLTFAnimEvent(gltf);

	return <primitive object={gltf.scene} />;
}
...

//JSX
<Canvas>
    {/* ... */}
    <color attach="background" args={["#ccc"]} />
    <OrbitControls />
    
    <Scene /> {/*import model*/}
</Canvas>

```

### Colaboration

If you want to collaborate, you can create a `pull request` or you can comment it in the `issue` section.


### Docs:
    * https://www.theatrejs.com/docs/latest/manual/authoring-extensions