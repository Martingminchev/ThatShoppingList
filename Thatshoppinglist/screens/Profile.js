import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import JWT from 'expo-jwt';
import {URL,JWT_SECRET} from '../config.js'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUser,setCurrentUser]=useState(null)
  const [ form, setValues ] = useState({
    email: '',
    password: '',
    password2: ''
  });
  const [ message, setMessage ] = useState('');
  const [registered, setRegistered] = useState('logIn')

// =============+> async storage helpers
const storeData = async (data) => {
  try {
    await AsyncStorage.setItem('token', data );
  } catch (error) {
    // Error saving data
  }
};
const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    setToken(value)
  } catch (error) {
  }
};
// execute on start
retrieveData()
const deleteData = async () => {
  try {
    const value = await AsyncStorage.removeItem('token');
    setToken(null)
  } catch (error) {
    // Error deleting data
  }
};
// =============-> end async storage helpers



// =============+> sign up
const register = async (e) => {
  try {
    const response = await axios.post(`${URL}/users/register`, {
      email: form.email,
      password: form.password,
      password2: form.password2
    });
    setMessage(response.data.message);
    setTimeout(()=>{setMessage('')},5000)
    if (response.data.ok) {
      console.log('Server says sign up ok')
    }
  } catch (error) {
    console.log(error);
  }
};

// =============+> log in
const login = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${URL}/users/login`, {
      email: form.email,
      password: form.password,
    });
    setMessage(response.data.message);
    if (response.data.ok) {
        // here after login was successful we extract the email passed from the server inside the token 
        let decodedToken = JWT.decode(response.data.token,JWT_SECRET)
        // and now we now which user is logged in in the client so we can manipulate it as we want, like fetching data for it or we can pass the user role -- admin or not -- and act accordingly, etc...
        console.log("Email extracted from the JWT token after login: ", decodedToken.userEmail)
        // setTimeout(() => {
          letUserIn(response.data.token);
        // }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };


// =============+> verify token so user will not need to log in again
// it's watching for token in state which would be updated on first load from retrieveData
useEffect(
  () => {
    const verify_token = async () => {
      try {
        // if no token found user is not logged in
        if (!token) {
          setIsLoggedIn(false)
        }else {
          // adding token to the headers of request
          axios.defaults.headers.common['Authorization'] = token;
          // sending token to verify in the server
          const response = await axios.post(`${URL}/users/verify_token`);
          // decoding token
          let decodedToken = JWT.decode(token,JWT_SECRET)
          setCurrentUser(decodedToken.userEmail)
          return response.data.ok ? letUserIn(token) : logout();
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  },
  [token]
  );

// =============+> setting logged in user
const letUserIn = (token) => {
  storeData(token)
  setIsLoggedIn(true);
};

// =============+> on log out delete token from storage
const logout = () => {
  deleteData()
  setIsLoggedIn(false);
};

const handleSwitch = () => {
  setRegistered((prevValue) => (prevValue === 'logIn' ? 'registered' : 'logIn'));
};

return (
  <SafeAreaView style={styles.container}>
    <Image style={styles.imageLogo} source={require('../assets/ThatShoppingListLogo.png')} />
  {!isLoggedIn ? (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.text}>User logged in: {`${isLoggedIn}`}</Text>
          {registered === 'logIn' ? (
            <>
              <Text style={styles.text}>LOGIN</Text>
              <TextInput
                style={styles.input}
                placeholder={'Enter email'}
                placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setValues({...form, email:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Enter password'}
                placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setValues({...form, password:text.toLowerCase().trim()})}
              />
              <Button
                onPress={login}
                title="Log in"
                color="#E8804C"
              />
              <Text style={styles.text}>Not registered yet?</Text>
              <Text style={styles.text} onPress={handleSwitch}> Click here to create an account!</Text>
            </>
          ) : (
            <>
              <Text style={styles.text}>REGISTER</Text>
              <TextInput
                style={styles.input}
                placeholder={'Enter email'}
                placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setValues({...form, email:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Enter password'}
               placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setValues({...form, password:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Confirm password'}
               placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setValues({...form, password2:text.toLowerCase().trim()})}
              />
              <Text style={styles.textNotice}>{form.password2 && form.password!==form.password2 && 'Password should match...'}</Text>
              <Button
                onPress={register}
                title="Sign up"
                color="#E8804C"
              />
              <Text style={styles.text}>Already have an account?</Text>
              <Text style={styles.text} onPress={handleSwitch}> Click here to log in!</Text>
            </>
          )}
          <Text style={styles.textNotice}>{message}</Text>
        </View> 
      </TouchableWithoutFeedback>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  ):(
    <View style={styles.container}>
      <Text style={styles.text}>{currentUser}</Text>
      <Button
        onPress={logout}
        title="Log out"
        color="#E8804C"
      />
      <Text style={styles.text}>Now you can share your lists by clicking the share list button.</Text>
      <StatusBar style="auto" />
    </View>
  )}
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#384a58',
    alignItems:'center',
    justifyContent:'center',
    fontSize:20,
  },
  input:{
    height: 40, 
    width:windowWidth*.9,
    marginTop:5,
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    color:'white',
  },
  text:{
    color: 'white'

  },
  textNotice:{
  color:'red'
  },
  imageLogo:{
    width:260,
    height:230,
    
  }
});