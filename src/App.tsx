import React, { useState } from "react";
import "./App.css";
import { generateSvgPath } from "./logic/draw";
import Course from "./logic/models/course";
import Point from "./logic/models/point";

function App() {
  const [path, setPath] = useState("");

  const getCourse = async () => {
    const course = new Course();
    setPath(
      generateSvgPath(course.fairwayOutline.map((p) => new Point(p.y, p.x)))
    );
  };

  return (
    <div className="container">
      <h1>Golf course generator!</h1>
      <button onClick={getCourse} className="generate-button">
        Generate new course
      </button>
      <div style={{ border: "1px solid black" }}>
        <svg width={800} height={800} xmlns="http://www.w3.org/2000/svg">
          <path d={path} stroke="black" />
        </svg>
      </div>
    </div>
  );
}

export default App;
