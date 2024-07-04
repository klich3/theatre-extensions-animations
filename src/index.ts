/*
█▀ █▄█ █▀▀ █░█ █▀▀ █░█
▄█ ░█░ █▄▄ █▀█ ██▄ ▀▄▀

Author: <Anton Sychev> (anton at sychev dot xyz) 
index.js (c) 2023 
Created:  2023-06-16 17:36:41 
Desc: Extension for theater
Docs: 
	* three animation types: https://threejs.org/docs/#api/en/animation/KeyframeTrack
	* three animation functions: https://github.com/mrdoob/three.js/blob/master/src/animation/AnimationUtils.js
	* keyframes from code: https://github.com/theatre-js/theatre/issues/411
*/

import { onChange, types } from "@theatre/core";
import type { IExtension } from "@theatre/studio";

//Note: menu icon
const svgImage = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M16.13 5.38L7.038 8h9.46a.5.5 0 0 1 .5.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 15.5V8.571l-.257-.893a2.5 2.5 0 0 1 1.71-3.095l8.647-2.493a2.5 2.5 0 0 1 3.095 1.71l.277.96a.5.5 0 0 1-.342.62zM3.84 7.88l.607-.175L5.889 5.21l-1.16.335A1.5 1.5 0 0 0 3.703 7.4l.138.48zm1.992-.574l2.12-.612l1.443-2.497l-2.125.613a.51.51 0 0 1-.021.042L5.833 7.307zm5.627-1.622l1.442-2.498l-2.126.613a.517.517 0 0 1-.026.053L9.34 6.296l2.12-.611zm2.684-2.652a.54.54 0 0 1-.02.036l-1.279 2.216l2.527-.728l-.139-.48a1.5 1.5 0 0 0-1.09-1.044zM4 9v6.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V9H4z" fill="currentColor"></path></g></svg>`;

let [_set, _studio, _sheet, _gltf, _scene] = [null, null, null, null, null];

/**
 * Vector type function
 * @param x
 * @param y
 * @param z
 * @returns
 */
const Vector = (x: number, y: number, z: number) => ({
	x: types.number(x, { nudgeMultiplier: 0.1 }),
	y: types.number(y, { nudgeMultiplier: 0.1 }),
	z: types.number(z, { nudgeMultiplier: 0.1 }),
});

/**
 * Quaternion type function
 * @param x
 * @param y
 * @param z
 * @param w
 * @returns
 */
const Quaternion = (x: number, y: number, z: number, w: number) => ({
	x: types.number(x, {
		nudgeMultiplier: 0.01,
		range: [-Math.PI / 2, Math.PI / 2],
	}),
	y: types.number(y, {
		nudgeMultiplier: 0.01,
		range: [-Math.PI / 2, Math.PI / 2],
	}),
	z: types.number(z, {
		nudgeMultiplier: 0.01,
		range: [-Math.PI / 2, Math.PI / 2],
	}),
	w: types.number(w, {
		nudgeMultiplier: 0.01,
		range: [-Math.PI / 2, Math.PI / 2],
	}),
});

/**
 * Extension for create button in toolbar
 */
const animationsExtension: IExtension = {
	id: "gltf-animations",
	toolbars: {
		global(set, studio) {
			_set = set;
			_studio = studio;

			set([
				{
					type: "Icon",
					title: "Apply GLTF Animations to selected objects",
					svgSource: svgImage,
					onClick: () => parseToTreeFunction(false),
				},
			]);
		},
	},
	panes: [],
};

/**
 * Event listener on click the button to import GLTF animations
 */
window.addEventListener(
	"GLTFAnimationPresent",
	(e: any) => {
		console.info("GLTFAnimationPresent > recieve this data", e.detail);

		_gltf = e.detail.animations;
		_scene = e.detail.scene;

		if (!_gltf || !_gltf.length) {
			console.warn("No animations found in GLTF file.");
			return;
		}

		if (!_scene) {
			console.warn("Please declare your scene in GLTFAnimEvent.");
			return;
		}

		parseToTreeFunction();
	},
	false
);

//-----

//TODO: add more types

/**
 * define object types
 */
const objectTypes: any = {
	vector: Vector(0, 0, 0),
	quaternion: Quaternion(0, 0, 0, 0),
};

/**
 * parse to tree function
 * @param isInitial
 * @returns
 */
const parseToTreeFunction = (isInitial: boolean = true) => {
	if (_studio === null) {
		console.warn("Studio is not initialized.");
		return;
	}

	_sheet = _studio.getStudioProject().sheet("GLTF Animations Tracks");

	for (let clips of _gltf) {
		const baseName = clips.name || "Animation";

		const objectsData: any = [];
		const objectsTimes: any = [];
		const objectsAttributes: any = [];

		for (let track of clips.tracks) {
			const objectAttribute = track.name.split(".").pop();
			const trackName = track.name.replace(`.${objectAttribute}`, "");
			const type = Object.getPrototypeOf(track).ValueTypeName;

			if (!objectsData[trackName]) {
				objectsData[trackName] = {};
				objectsAttributes[trackName] = {};
			}

			objectsTimes[trackName] = track.times;

			//Note: reconstruct animation data to every frame
			//track.times = number of frames
			//
			if (!objectsData[trackName][objectAttribute])
				objectsData[trackName][objectAttribute] = [];

			for (let i = 1; i <= track.times.length - 1; i++) {
				let value;
				let props;
				if (objectAttribute === "quaternion") {
					value = i * 4;
					props = {
						x: track.values[value + 0] || 0,
						y: track.values[value + 1] || 0,
						z: track.values[value + 2] || 0,
						w: track.values[value + 3] || 0,
					};
				} else {
					value = i * 3;
					props = {
						x: track.values[value + 0] || 0,
						y: track.values[value + 1] || 0,
						z: track.values[value + 2] || 0,
					};
				}

				//objectsData[trackName][objectAttribute].push(props);
				if (!objectsData[trackName][i]) objectsData[trackName][i] = {};
				objectsData[trackName][i][objectAttribute] = props;
			}

			//Note: reconstruct objects and attributes
			objectsAttributes[trackName][objectAttribute] = objectTypes[type];
		}

		//Note: reconstruct objects and attributes
		if (_sheet)
			for (let objName in objectsAttributes) {
				const obj = _sheet.object(
					`${baseName} / ${objName}`,
					objectsAttributes[objName],
					{ reconfigure: !isInitial }
				);

				obj.name = objName;
				obj.object = _scene.getObjectByName(objName);

				if (!obj.object) {
					console.warn(`Object ${objName} not found in scene.`);
					continue;
				}

				onChange(obj.props, (values) => {
					for (let attr in values) {
						//Note: assign values to objects
						obj.object[attr].copy(values[attr]);
					}
				});

				if (isInitial) continue;

				_studio.transaction((api) => {
					for (let i = 1; i <= objectsTimes[objName].length - 1; i++) {
						const props = objectsData[objName][i];

						_sheet.sequence.position = objectsTimes[objName][i];
						api.set(obj.props, props);
					}
				});
			}
	}
};

//-----

/**
 * @description Dispatch event with animations data loaded from gltf
 * @param data <object>
 * @example GLTFAnimEvent({animations: <gltf animations clips>, scene: <three scene>})
 * @returns void
 */
export const GLTFAnimEvent = (data: any) => {
	window.dispatchEvent(
		new CustomEvent("GLTFAnimationPresent", { detail: data })
	);
};

export default animationsExtension;
