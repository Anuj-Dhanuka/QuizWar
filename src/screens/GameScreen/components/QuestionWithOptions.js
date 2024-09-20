import React from "react";
import { View, Text, StyleSheet } from "react-native";

//context
import { useTheme } from "../../../context/ThemeContext";

//Dimension utils
import { normalize, scaleVertical } from "../../../utils/DimensionUtils";

//font utils
import { getInterFont } from "../../../utils/FontUtils/interFontHelper";

//local component
import OptionButton from "./OptionButton";


const QuestionWithOptions = ({
  questionData,
  checkAns,
  answerClickHandler,
  isDisable,
}) => {
  const { currentTheme } = useTheme();

  const styles = getStyles(currentTheme);

  let correctOption = null;

  if (checkAns.id != checkAns.correctAns) {
    correctOption = checkAns.correctAns;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questionData?.question}</Text>
      {/* <View style={[styles.fireSymbolContainer, { display: isDisable? "flex" : "none" }]}>
        <Image
          source={require("../../../../assets/images/fireSymbol.png")}
          style={styles.fireSymbol}
        />
      </View> */}
      <View style={styles.dummyView}></View>
      <View style={styles.optionsContainer}>
        <OptionButton
          text={questionData?.options[0]}
          buttonId="1"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
          isDisable={isDisable}
        />
        <OptionButton
          text={questionData?.options[1]}
          buttonId="2"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
          isDisable={isDisable}
        />
      </View>
      <View style={styles.optionsContainer}>
        <OptionButton
          text={questionData?.options[2]}
          buttonId="3"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
          isDisable={isDisable}
        />
        <OptionButton
          text={questionData?.options[3]}
          buttonId="4"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
          isDisable={isDisable}
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
    },
    question: {
      color: "#FFFFFF",
      fontSize: normalize(26),
      lineHeight: scaleVertical(32),
      marginBottom: scaleVertical(30),
      ...getInterFont("Bold")
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: scaleVertical(5),
    },
    fireSymbol: {
      position: "absolute",
      top: scaleVertical(-40),
      display: "flex",
      height: scaleVertical(40),
      width: normalize(50),
      alignSelf: "center",
    },
    clockContainer: {
      width: "100%",
      alignItems: "center",
    },
    clockText: {
      color: "#FFFFFF",
      fontWeight: "400",
      position: "absolute",
    },
    dummyView: {
      marginTop: scaleVertical(15),
    },
  });

export default QuestionWithOptions;
