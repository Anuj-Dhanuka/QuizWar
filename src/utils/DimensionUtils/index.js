// @flow
import { Dimensions } from "react-native";

const guidelineBaseWidth = 411;
const guidelineBaseHeight = 840;

const scaleVertical = (size) => {
  const { height } = Dimensions.get("window");
  const out = height > 0 ? (height / guidelineBaseHeight) * size : size;
  return out;
};

const scaleHorizontal = (size) => {
  const { width } = Dimensions.get("window");
  const out = width > 0 ? (width / guidelineBaseWidth) * size : size;
  return out;
};

export const scaleH = (size, factor = 0.6) => {
  const out = size + (scaleHorizontal(size) - size) * factor;
  return out;
};

export const scaleV = (size, factor = 0.6) => {
  const out = size + (scaleVertical(size) - size) * factor;
  return out;
};

export { scaleV as scale, scaleHorizontal as normalize, scaleVertical };
