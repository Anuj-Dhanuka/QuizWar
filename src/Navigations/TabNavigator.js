import React from 'react';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';

//common utils/common functions
import {triggerButtonCLickSound, triggerHapticFeedback} from '../utils/CommonUtils.js/commonFunctions';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Routes from './RoutesConstants';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const authData = useSelector(state => state.auth);
  const {isHapticEnabled, isSoundEnabled} = authData;
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          height: 70,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          // Set icon based on route name
          if (route.name === Routes.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === Routes.DASHBOARD) {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === Routes.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name={Routes.HOME}
        component={HomeScreen}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (isHapticEnabled) {
                  triggerHapticFeedback();
                }
                if(isSoundEnabled){
                  triggerButtonCLickSound()
                }
                props.onPress();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.DASHBOARD}
        component={DashboardScreen}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (isHapticEnabled) {
                  triggerHapticFeedback();
                }
                if(isSoundEnabled){
                  triggerButtonCLickSound()
                }
                props.onPress();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (isHapticEnabled) {
                  triggerHapticFeedback();
                }
                if(isSoundEnabled){
                  triggerButtonCLickSound()
                }
                props.onPress();
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
