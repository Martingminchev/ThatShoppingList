import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import {useContext} from 'react'
import { UserContext } from '../components/UserContext';



const windowWidth = Dimensions.get('window').width;

export default function Profile() {
  const { currentUser, isLoggedIn, form, setForm,  message,  registered, handleSwitch, register, logout,login,} = useContext(UserContext);





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
                onChangeText={(text) => setForm({...form, email:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Enter password'}
                placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setForm({...form, password:text.toLowerCase().trim()})}
              />
              <Button
                onPress={login}
                title="Log in"
                color="#E8804C"
              />
              <Text style={styles.text} onPress={handleSwitch} >Not registered yet?</Text>
              <Text style={styles.text} onPress={handleSwitch}> Click here to create an account!</Text>
            </>
          ) : (
            <>
              <Text style={styles.text}>REGISTER</Text>
              <TextInput
                style={styles.input}
                placeholder={'Enter email'}
                placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setForm({...form, email:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Enter password'}
               placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setForm({...form, password:text.toLowerCase().trim()})}
              />
              <TextInput
                style={styles.input}
                placeholder={'Confirm password'}
               placeholderTextColor='rgba(255, 255, 255, 0.45)'
                onChangeText={(text) => setForm({...form, password2:text.toLowerCase().trim()})}
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
  )
  :
  (
    <View style={styles.container}>
      <Text style={styles.text}>{currentUser}</Text>
      <Button
        onPress={logout}
        title="Log out"
        color="#E8804C"
      />
      <Text style={styles.text}>Manage, delete and add new lists to your account.</Text>
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
    textAlign: 'center',
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