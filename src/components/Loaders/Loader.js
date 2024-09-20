import { View, ActivityIndicator } from "react-native";

//context
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
