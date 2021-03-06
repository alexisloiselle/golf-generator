import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { generateSvgPath } from "./logic/draw";
import Course from "./logic/models/course";
import Point from "./logic/models/point";
import useWindowDimensions from "./logic/useWindowDimensions";
import SpringComponent from "./SpringComponent";
import { Button } from "antd";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const getPolePath = (point: Point) => `M ${point.x} ${point.y} l 0 -45`;
const getFlagPath = (point: Point) =>
  `M ${point.x} ${point.y - 45} l 18 6 l -18 6 z`;

function App() {
  const { width, height } = useWindowDimensions();
  const [isFirstGen, setIsFirstGen] = useState(true);

  const [holePoint, setHolePoint] = useState(new Point(390, 390));
  const [hole, setHole] = useState(
    "M 388 390 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0"
  );
  const [tee, setTee] = useState(
    "M 385 390 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0"
  );
  const [greenPath, setGreenPath] = useState(
    "M 380 390 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0"
  );
  const [teePath, setTeePath] = useState(
    "M 380 390 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0"
  );
  const [fairwayPath, setFairwayPath] = useState(
    "M 370 390 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0"
  );
  const [roughPath, setRoughPath] = useState(
    "M 350 390 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0"
  );
  const [forestPath, setForestPath] = useState(
    `M ${width / 2 - 60} ${height / 2} a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0`
  );

  const prevHolePoint = usePrevious(holePoint) || holePoint;
  const prevHole = usePrevious(hole) || hole;
  const prevTee = usePrevious(tee) || tee;
  const prevGreen = usePrevious(greenPath) || greenPath;
  const prevTeePath = usePrevious(teePath) || teePath;
  const prevFairway = usePrevious(fairwayPath) || fairwayPath;
  const prevRough = usePrevious(roughPath) || roughPath;
  const prevForest = usePrevious(forestPath) || forestPath;

  const adjustForest = (
    newWidth: number,
    newHeight: number,
    isFirstGen: boolean
  ) => {
    if (isFirstGen) {
      return `M ${newWidth / 2 - 60} ${
        newHeight / 2
      } a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0`;
    }

    const x = newWidth / 2;
    const y = newHeight / 2;
    const a = x * Math.sqrt(2);
    const b = y * Math.sqrt(2);

    return `M -${a - x} ${y} a ${a} ${b} 0 1 0 ${2 * a} 0 a ${a} ${b} 0 1 0 ${
      -2 * a
    } 0`;
  };

  useEffect(() => {
    setForestPath(adjustForest(width, height, isFirstGen));
  }, [width, height, isFirstGen]);

  const getCourse = async () => {
    if (isFirstGen) {
      setIsFirstGen(false);
      setForestPath(adjustForest(width, height, false));
    }
    const course = new Course();
    const {
      teeCenter: { x: teeX, y: teeY },
      greenCenter: { x: gX, y: gY },
      greenCenter,
    } = course;
    setHolePoint(greenCenter);
    setGreenPath(`M ${gX - 30} ${gY} a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0`);
    setHole(`M ${gX - 2.5} ${gY} a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0`);
    setTeePath(`M ${teeX - 20} ${teeY} a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0`);
    setTee(`M ${teeX - 5} ${teeY} a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0`);
    setFairwayPath(
      generateSvgPath(course.fairwayOutline.map((p) => new Point(p.y, p.x)))
    );
    setRoughPath(
      generateSvgPath(course.roughOutline.map((p) => new Point(p.y, p.x)))
    );
  };

  const reset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setIsFirstGen(true);
    setHolePoint(new Point(390, 390));
    setHole("M 388 390 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0");
    setTee("M 385 390 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0");
    setGreenPath("M 380 390 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0");
    setTeePath("M 380 390 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0");
    setFairwayPath("M 370 390 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0");
    setRoughPath("M 350 390 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0");
    setForestPath(
      `M ${width / 2 - 60} ${
        height / 2
      } a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0`
    );
  };

  return (
    <div className="container" onClick={getCourse}>
      <Button
        type="link"
        style={{ zIndex: 1, backgroundColor: "transparent", color: "#9CC365" }}
        onClick={reset}
      >
        Clear
      </Button>

      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="#6A953B"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevForest} to={forestPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#90C656"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevRough} to={roughPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#A5D368"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevFairway} to={fairwayPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#B0DA74"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevTeePath} to={teePath} />
        <SpringComponent from={prevGreen} to={greenPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#A5D368"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevTee} to={tee} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#416320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent from={prevHole} to={hole} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SpringComponent
          from={getPolePath(prevHolePoint)}
          to={getPolePath(holePoint)}
          style={{ strokeWidth: 2, stroke: "black" }}
        />
        <SpringComponent
          from={getFlagPath(prevHolePoint)}
          to={getFlagPath(holePoint)}
          style={{
            stroke: "#DD4D4B",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}
        />
        <SpringComponent
          from={getFlagPath(prevHolePoint)}
          to={getFlagPath(holePoint)}
          style={{
            fill: "#DD4D4B",
          }}
        />
      </svg>
    </div>
  );
}

export default App;
