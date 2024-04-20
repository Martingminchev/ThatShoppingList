import React, { useContext, useEffect } from 'react';
import { UserContext, Provider } from './components/UserContext';
import Home from "./screens/Home";
import Mylist from './screens/Mylist.js'
import Profile from './screens/Profile.js'
import { NavigationContainer , useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {Text} from 'react-native'

const Tab = createMaterialTopTabNavigator();

function MainTabs() {
  const { isLoggedIn } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    let timeout;
    if (isLoggedIn) {
      timeout = setTimeout(() => {
        navigation.navigate("Home");
      }, 120); 
    }

    return () => clearTimeout(timeout); 
  }, [isLoggedIn, navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#384a58', marginTop: 35 },
        lazy: true,
      }}
    >
      {isLoggedIn ? (
        <>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? 'white' : 'lightgrey' }}>Home</Text>
              ),
            }}
          />

          <Tab.Screen
            name="Mylist"
            component={Mylist}
            initialParams={{ list: 'defaultList' }}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? 'white' : 'lightgrey' }}>My list</Text>
              ),
            }}
          />
        </>
      ) : null}
      
      <Tab.Screen
      name="Profile"
      component={Profile} 
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? 'white' : 'lightgrey' }}>Profile</Text>
        ),
      }}
    />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </Provider>
  );
}
