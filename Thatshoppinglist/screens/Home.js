import React, { useState, useContext , useEffect } from 'react';
import { Text, View, SafeAreaView, TextInput, FlatList, StyleSheet, Alert, Image,} from 'react-native';
import axios from 'axios';
import {URL} from '../config.js'
import { UserContext } from '../components/UserContext';


const Home = ({navigation}) => {
  const [item, setList] = useState('');
  const [items, setLists] = useState([]);
  const { currentUser } = useContext(UserContext);

  const addListToServer = async () => {
    try {
      const response = await axios.post(`${URL}/users/add_List`, {
        email: currentUser,
        listName:item,
      });
      
      if (response.data.ok) {
        setLists([...items,  { listName: item }]);
        setList('');
        console.log('Item added')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddItem = () => {
    if(item.length==0){
      Alert.alert(
        "Name is missing",
        "Please provide a name for your list.",
        [
          { text: "OK"}
        ]
      );
    }
    else if(items.some(i => i.name === item)){
      Alert.alert(
        "List exists",
        "A list with this name already exists! Try another name.",
        [
          { text: "OK"}
        ]
      );
    }
    else{
      addListToServer();
    }
  };

  const handleRemoveItem = async (index) => {
    Alert.alert(
      "Delete list",
      "Are you sure you want to delete this list?",
      [
        {
          text: "Cancel",
        },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              const listName = items[index].listName;
              const response = await axios.post(`${URL}/users/remove_List`, {
                email: currentUser,
                listName,
              });
              if (response.data.ok) {
                setLists(items.filter((_, i) => i !== index));
                console.log('List removed');
              }
            } catch (error) {
              console.log(error);
            }
          } 
        }
      ]
    );
  };
  
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.post(`${URL}/users/get_Lists`, {
          email: currentUser,
        });
        if (response.data.ok) {
          setLists(response.data.lists.map(listName => ({ listName })));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLists();
  }, []);

  const handleListClick = (index) => {
    navigation.navigate('Mylist', { newList: items[index].listName});
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View >
      <Image style={styles.imageLogo} source={require('../assets/ThatShoppingListLogo.png')} />
      </View>
       {items.length==0&&<Text style={styles.textStyle}>Your shopping lists will be displayed here.
       <Text style={styles.textStyle}></Text> You can add a new list by entering name and clicking + to add the list. </Text>}
    
      
      <FlatList
        data={items}
        style={styles.flatlist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text onPress={() => handleListClick(index)} style={item.bought ? styles.bought : styles.notBought}>
            {item.listName} 
            </Text>
            <Text  style={styles.button}  onPress={() => handleRemoveItem(index)} >  ✗</Text>
          </View>
        )}
      />
      
        <View style={styles.addItem}>
      <TextInput
        style={styles.input}
        value={item}
        onChangeText={setList}
       placeholder="Enter name for your list" 
       placeholderTextColor='rgba(255, 255, 255, 0.45)'
       />
      
      


      <Text  style={styles.buttonAdd} onPress={handleAddItem} >+</Text>
      
      </View>
    
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  //Container
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#384a58',
    alignItems:'center',
    fontSize:20,
  },
//add item and text style
  addItem:{
    margin:5,
    flexDirection: 'row',
  },
   textStyle:{
    color: 'white',

   },


  //input 
  input: {
    width:270,
    height:50,
    borderColor: 'gray',
    borderRadius:20,
    borderWidth: 1,
    backgroundColor:'#374a50',
    fontSize:20,
    textAlign: 'center',
    color: 'white'
  },
  

  //styles of item 
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    fontSize: 20,
    backgroundColor:'#3d4f5d',
    marginTop:5,
    borderRadius:10,
    width:300,
  },
  notBought:{
    fontWeight:'bold',
    fontSize:23,
    width:200,
    color:'#ebeff0',
  },
  bought: {
    textDecorationLine: 'line-through',
    fontSize:23,
    width:200,
    color:'#acadb6'
  },
  //Button add list
  buttonAdd:{
    fontSize: 19,
    backgroundColor:'#e2eef5',
    height:28,
    width:30,
    borderRadius:20 ,
    textAlign:'center' ,
    textShadowColor: 'rgba(82,63,74,0.2)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    margin:10,
  },
  //remove button
  button:{
    fontSize:25 ,
    color:'#E8804C' ,
   
  },
  //logo image
  imageLogo:{
    width:260,
    height:230,
    
  }
});

export default Home;

