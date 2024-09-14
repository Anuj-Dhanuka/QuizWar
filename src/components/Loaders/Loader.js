import { View, ActivityIndicator } from "react-native";

//importing context to know current theme of app
import { useTheme } from "../../context/ThemeContext";

function Loader({ isLoaderActive }) {
  const { currentTheme } = useTheme();
  return (
    <View>
      <ActivityIndicator
        size="large"
        animating={isLoaderActive}
        color={currentTheme.white}
      />
    </View>
  );
}

export default Loader;
