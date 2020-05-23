import React, { useState, useEffect } from "react";
import "./App.css";
import { generateSvgPath } from "./logic/draw";
import Course from "./logic/models/course";
import Point from "./logic/models/point";
import useWindowDimensions from "./logic/useWindowDimensions";

function App() {
  const { width, height } = useWindowDimensions();

  const [fairwayPath, setFairwayPath] = useState("");
  const [roughPath, setRoughPath] = useState("");
  const [forestPath, setForestPath] = useState("");

  useEffect(() => {
    setForestPath(`M 0 0 h ${width} v ${height} h ${-width} z`);
  }, [width, height]);

  const getCourse = async () => {
    const course = new Course();
    setFairwayPath(
      generateSvgPath(course.fairwayOutline.map((p) => new Point(p.y, p.x)))
    );
    setRoughPath(
      generateSvgPath(course.roughOutline.map((p) => new Point(p.y, p.x)))
    );
  };

  return (
    <div className="container" onClick={getCourse}>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="#6A953B"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={forestPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#90C656"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={roughPath} />
      </svg>
      <svg
        style={{ position: "fixed", top: 0, left: 0 }}
        viewBox="0 0 780 780"
        width={width}
        height={height}
        fill="#A5D368"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={fairwayPath} />
      </svg>
    </div>
  );
}

export default App;
