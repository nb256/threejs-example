import * as THREE from "three";
import React, { useRef, useEffect, useMemo } from "react";
import { apply, Canvas, useRender, useThree } from "react-three-fiber";
import { useSprings, a } from "react-spring/three";
// import * as resources from "./resources/index";
// import WebVR from "./resources/WebVR.js";
import "./styles.css";
// Make extra stuff available as native-elements (<effectComposer />, etc.)
import GetRandomUrl from "./GetRandomUrl";
const { OrbitControls } = require("./resources/controls/OrbitControls");

// function ApplyVR() {
//   const { gl, scene, camera } = useThree();
//   useEffect(() => {
//     camera.position.set(0, 0, 20);
//     document.body.appendChild(WebVR.createButton(gl));
//     gl.vr.enabled = true;
//     gl.setAnimationLoop(function() {
//       gl.render(scene, camera);
//     });
//   }, []);
//   return <React.Fragment />;
// }

const number = 70;
const colors = ["#FFFFFF", "#000000", "#FFFFFF", "#000000"];
const random = () => {
  const r = Math.random();
  return {
    position: [
      30 - Math.random() * 60,
      30 - Math.random() * 60,
      Math.random() * 40
    ],
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    scale: [6 + r * 10, 6 + r * 10, 1]
  };
};

function Content() {
  const { viewport, camera } = useThree();
  const aspect = viewport.width / 6;
  const [springs, set] = useSprings(number, i => ({
    from: random(),
    ...random(),
    config: { mass: 20, tension: 500, friction: 200 }
  }));
  let controls;

  useEffect(
    () =>
      void setInterval(
        () => {
          set(i => ({ ...random(), delay: i * 50 }));
        },

        5900
      ),
    []
  );

  useEffect(() => {
    camera.position.set(0, 0, 60);
    controls = new OrbitControls(camera);
    return () => {
      controls.dispose();
    };
  }, []);

  return springs.map(({ color, ...props }, index) => (
    <a.mesh key={index} {...props}>
      {Image({ url: GetRandomUrl() })}
    </a.mesh>
  ));
}

function Image({ url }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  return (
    <a.mesh>
      <a.planeBufferGeometry attach="geometry" />
      <a.meshLambertMaterial attach="material" transparent>
        <a.primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  );
}

function Background() {
  const { scene } = useThree();
  const texture = useMemo(
    () =>
      new THREE.CubeTextureLoader().load([
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556032180/background.jpg",
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556032180/background.jpg",
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556031157/pos-y.jpg",
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556031167/neg-y.jpg",
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556032180/background.jpg",
        "https://res.cloudinary.com/dzja2grke/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1556032180/background.jpg"
      ]),
    []
  );

  useEffect(() => {
    scene.background = texture;
  }, []);
  return <React.Fragment />;
}

export default function App() {
  return (
    <div className="main">
      <Canvas style={{ background: "#FFFFFF" }}>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.5} position={[300, 300, 4000]} />
        <Content />
        {/* <ApplyVR /> */}
        <Background />
      </Canvas>
      <a
        href="https://github.com/nb256/threejs-example"
        className="top-left"
        children="Source Code"
      />

      <div
        style={{
          position: "fixed",
          left: "20px",
          bottom: "20px",
          width: "150px"
        }}
      >
        Use arrow keys or mouse left/right to navigate on scene
      </div>
      <div
        style={{
          position: "fixed",
          opacity: "0.3",
          right: "20px",
          bottom: "20px"
        }}
      >
        my previous projects
      </div>
    </div>
  );
}
