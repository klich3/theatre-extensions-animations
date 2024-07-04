# Theatre GLTF Animations to Track Sequence importer

Plugin to import GLTF animations.

How it works first we have to declare the SCENE and Animations of the GLTF. 
Then select an animated object, in the right menu click on a keyframe and the timeline will open. Click on the button in the toolbar above.

The keyframes of your GLTF will be recreated on the timeline.


It's develop for Theater.js 0.7.2

It is a module for Theatre.js which allows you to import animation into timeline from a GLTF file.

> [!IMPORTANT]
>***Knowledge of Bugs:***
>
>    [ ] You need to enable 'Sequence all' so that the script can reassign animation to the selected properties.
> 
>    [x] When reloading the page, the bind is not saved.
> 
>    [x] Re-order position axies on import animation


***Theater.js bugs:***
    1) Activate secquence for some object: https://github.com/theatre-js/theatre/issues/352

***Videos Samples***

You can see it browsing `_videos` folder.

---

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

---

### Colaboration

If you want to collaborate, you can create a `pull request` or you can comment it in the `issue` section.


### Docs:
    * https://www.theatrejs.com/docs/latest/manual/authoring-extensions