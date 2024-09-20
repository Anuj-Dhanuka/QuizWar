import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Image, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//context
import { useTheme } from "../../../context/ThemeContext";

//Dimensions utils
import { normalize, scaleVertical } from "../../../utils/DimensionUtils";


export default function HealthBar({ currentPoints, reset }) {
  const { currentTheme } = useTheme();

  const styles = getStyles(currentTheme);

  const { count, addScore } = currentPoints;

  const [score, setScore] = useState(0);
  const [animatedWidth] = useState(new Animated.Value(0));



  const updateScore = () => {
    if (score + addScore < 95) {
      setScore((prevScore) => prevScore + addScore);
    } else {
      setScore(95);
    }
  };

  useEffect(() => {
    if(reset) {
      setScore(0);
      animatedWidth.setValue(0);
    }
    updateScore();
  }, [addScore, count, reset]);

  const screenWidth =
    Dimensions.get("window").width -
    Dimensions.get("window").width * (27 / 100);

  useEffect(() => {
    const toValue = ((score) / 100) * screenWidth;
    Animated.timing(animatedWidth, {
      toValue: toValue,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [score, screenWidth, addScore]);

  return (
    <View style={styles.topView}>
      <View style={styles.container}>
        <View style={styles.healthBarContainer}>
          <Animated.View style={[styles.healthBar, { width: animatedWidth }]}>
            <Image
              source={require("../../../assets/icons/blue_flame_icon.png")}
              style={styles.icon}
            />
          </Animated.View>
        </View>
      </View>
      {/* <Image
        style={{ height: scaleVertical(20), width: normalize(25) }}
        source={require("../../../../assets/images/loveicon.png")}
      /> */}
      <Icon name="cards-heart" size={normalize(24)} color="#cc3300" />
      <Icon name="plus" size={normalize(12)} color="#FFFFFF" style={styles.plusSymbol} />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    topView: {
      flexDirection: "row",
      alignItems: "center",
    },
    container: {
      flex: 1,
    },
    healthBarContainer: {
      width: "90%",
      height: scaleVertical(10),
      backgroundColor: "#ADADAD",
      borderRadius: normalize(10),
      marginRight: normalize(10),
    },
    healthBar: {
      height: "100%",
      backgroundColor: "#00D4FF",
      borderRadius: normalize(10),
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    icon: {
      width: normalize(20),
      height: scaleVertical(30),
      position: "absolute",
      right: normalize(-12),
      top: scaleVertical(-15),
    },

    plusSymbol: {
      right: normalize(14),
      top: scaleVertical(4),
    },
  });
