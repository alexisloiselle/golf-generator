import React from "react";
import { Spring, animated } from "react-spring/renderprops";
import { interpolate } from "flubber";
import { AnimatedValue } from "react-spring";

interface Props {
  from: string;
  to: string;
  style?: React.CSSProperties;
}
const SpringComponent: React.FunctionComponent<Props> = ({
  from,
  to,
  style,
}) => {
  const interpolator = interpolate(from, to);

  return (
    <Spring
      reset
      native
      from={{ t: 0 } as AnimatedValue<{ t: number }>}
      to={{ t: 1 } as AnimatedValue<{ t: number }>}
    >
      {({ t }: AnimatedValue<{ t: number }>) => (
        <animated.path style={style} d={t.interpolate(interpolator)} />
      )}
    </Spring>
  );
};

export default SpringComponent;
