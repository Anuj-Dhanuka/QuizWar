import { Dimensions } from "react-native";

//dimension utils
import { normalize } from "../DimensionUtils";

export const {width} = Dimensions.get('screen');

//category screen
export const ITEM_WIDTH = normalize(230);
export const SPACER_WIDTH = normalize((width - ITEM_WIDTH - 33) / 2);
export const ITEM_SPACING = normalize(10);

//result screen
export const scorePerQuestion = 5;