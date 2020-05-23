import React from "react";
import { Spring, animated } from "react-spring/renderprops";
import { interpolate } from "flubber";
import { AnimatedValue } from "react-spring";

interface Props {
  from: string;
  to: string;
}
const SpringComponent: React.FunctionComponent<Props> = ({ from, to }) => {
  const interpolator = interpolate(from, to);

  return (
    <Spring
      reset
      native
      from={{ t: 0 } as AnimatedValue<{ t: number }>}
      to={{ t: 1 } as AnimatedValue<{ t: number }>}
    >
      {({ t }: AnimatedValue<{ t: number }>) => (
        <animated.path d={t.interpolate(interpolator)} />
      )}
    </Spring>
  );
};

export default SpringComponent;
