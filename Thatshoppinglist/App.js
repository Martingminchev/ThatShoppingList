import Home from "./screens/Home";
import Mylist from './screens/Mylist.js'
import Profile from './screens/Profile.js'
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {Text} from 'react-native'

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
  initialRouteName="Home"
  screenOptions={{
    tabBarStyle: { backgroundColor: '#384a58', marginTop: 35 },
  }}
>
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
    </NavigationContainer>
  );
}

