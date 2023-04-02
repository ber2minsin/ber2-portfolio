import React, { useRef } from 'react';
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three';

function MyAsciiEffect(props){
    const effectRef = useRef(null);
    React.useEffect(() => {
        const renderer = new THREE.WebGLRenderer();

        const characters = " .:-+*=%@#";
        const ASCIIColor = "#ffffff";
        const backgroundColor = "#000000";
        const effectSize = { amount: 1 };
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        let effect;
        const myMesh = new THREE.Mesh();
        function createEffect() {
            effect = new AsciiEffect(renderer, characters, { invert: true, amount: effectSize.amount });
            effect.setSize(sizes.width, sizes.height);
            effect.domElement.style.color = ASCIIColor;
            effect.domElement.style.backgroundColor = backgroundColor;
            effect.domElement.style.scrollSnapAlign = "start";
            // effect.domElement.style.display = "grid";
        }
        createEffect();
        console.log(effect.domElement);

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0, 0, 0);

        const pointLight1 = new THREE.PointLight(0xffffff, 1);
        pointLight1.position.set(100, 100, 400);
        scene.add(pointLight1);


        // Create material
        const material = new THREE.MeshStandardMaterial()
        material.flatShading = true
        material.side = THREE.DoubleSide;

        const clock = new THREE.Clock()

        // Load model
        const stlLoader = new STLLoader();

        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);
        camera.focus = 3;

        stlLoader.load('threemodels/plate.stl',
            function (geometry) {

                myMesh.material = material;
                myMesh.geometry = geometry;

                var tempGeometry = new THREE.Mesh(geometry, material)
                myMesh.position.copy = (tempGeometry.position)

                geometry.computeVertexNormals();
                myMesh.geometry.center();

                // controls = new OrbitControls(camera, effect.domElement);
                // controls.dispose();
                myMesh.geometry.computeBoundingBox();
                var bbox = myMesh.geometry.boundingBox;

                // myMesh.position.y = ((bbox.max.z - bbox.min.z) / 5)
                // myMesh.rotation.y = 90;
                myMesh.rotation.x = 45;
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 3;
                scene.add(myMesh);

                let lastTime = 0;
                const minRenderInterval = 1000 / 60;
                function tick() {
                    window.requestAnimationFrame(tick)
                    const currentTime = Date.now();
                    const timeSinceLastRender = currentTime - lastTime;
                    if (timeSinceLastRender < minRenderInterval) {
                        return;
                    }
                    lastTime = currentTime;

                    const elapsedTime = clock.getElapsedTime()
                    myMesh.rotation.z = (elapsedTime) / 3;
                    // myMesh.rotation.z = (elapsedTime) / 3;
                    effect.render(scene, camera);
                }
                tick()
                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);
                    effect.setSize(window.innerWidth, window.innerHeight);
                }
                window.addEventListener('resize', onWindowResize, false);
            }
        )
        // renderer.setSize( window.innerWidth, window.innerHeight );
        console.log(effect.domElement);
        effectRef.current.parentNode.insertBefore(effect.domElement, effectRef.current.nextSibling);
        // effectRef.current.appendChild(effect.domElement);
        }

    )

    return (<div ref={effectRef} />);
}

export default MyAsciiEffect;