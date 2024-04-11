import React, { useState, useEffect, useContext } from 'react';
import { Text, View, SafeAreaView, TextInput, Button, FlatList, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import {URL} from '../config.js'
import { UserContext } from '../components/UserContext';

const Mylist = ({ route }) => {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const { newList, } = route.params;
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.post(`${URL}/users/get_Items`, {
          email: currentUser,
          listName: newList,
        });
        if (response.data.ok) {
          setItems(response.data.items.map(item => ({ name: item, bought: false })));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [newList]);

  const handleAddItem = async () => {
    if(item.length==0){
      Alert.alert(
        "Name is missing",
        "Please provide an item name.",
        [
          { text: "OK"}
        ]
      );
    }
    else if(items.some(i => i.name === item)){
      Alert.alert(
        "Item exists",
        "An item with this name already exists! Try adding another item.",
        [
          { text: "OK"}
        ]
      );
    }
    else{
      try {
        const response = await axios.post(`${URL}/users/add_Item`, {
          email: currentUser,
          listName: newList,
          item,
        });
        if (response.data.ok) {
          setItems([...items, { name: item, bought: false }]);
          setItem('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveItem = async (index) => {
    Alert.alert(
      "Delete list",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
        },
        { text: "OK", onPress: async () => {
          try {
            const response = await axios.post(`${URL}/users/remove_Item`, {
              email: currentUser,
              listName: newList,
              item: items[index].name,
            });
            if (response.data.ok) {
              setItems(items.filter((_, i) => i !== index));
            }
          } catch (error) {
            console.log(error);
          }
        }}
      ]
    );
  };
  
  const handleItemClick = (index) => {
    setItems(items.map((item, i) => {
      if (i === index) {
        return { ...item, bought: !item.bought };
      } else {
        return item;
      }
    }));
  };

 


return (
  <SafeAreaView style={styles.container}>
    
    <View >
    <Image style={styles.imageLogo} source={require('../assets/ThatShoppingListLogo.png')} />
    </View>
     <View >
        {newList?<Text style={styles.headerTextStyle}>{newList}</Text>:<Text style={styles.textStyle}>Welcome, please create a list to view and edit its items!</Text>}
        {items.length==0&&<Text style={styles.textStyle}>Your shopping items will be displayed here.
     <Text style={styles.textStyle}></Text> You can add a new item by entering name and clicking + to add the item. </Text>}
        </View>
  
    
    <FlatList
      data={items}
      style={styles.flatlist}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text onPress={() => handleItemClick(index)} style={item.bought ? styles.bought : styles.notBought}>
          {item.name} 
          </Text>
          <Text  style={styles.button}  onPress={() => handleRemoveItem(index)} >  ✗</Text>
        </View>
      )}
    />
    
        {newList?<View style={styles.addItem}>
    <TextInput
      style={styles.input}
      value={item}
      onChangeText={setItem}
     placeholder="Enter item here" 
     placeholderTextColor='rgba(255, 255, 255, 0.45)'
    />
    
    


    <Text  style={styles.buttonAdd} onPress={handleAddItem} >+</Text></View> :null}
    
  
    

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
//Top menu with logo
addItem:{
  margin:5,
  flexDirection: 'row',
},
 textStyle:{
  color: 'white',

 },
 headerTextStyle:{
   color: 'white',
   fontSize:50,
   textAlign:'center'
 },

headerButtons:{
marginTop:30,
fontSize:20,
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
  backgroundColor:'#3d4f5d',
  marginTop:5,
  borderRadius:10,
  height:50,
  width:300,
},
notBought:{
  fontSize:20,
  width:200,
  color:'#ebeff0',
},
bought: {
  textDecorationLine: 'line-through',
  fontSize:20,
  width:200,
  color:'#acadb6',
  opacity:0.5,
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
  marginLeft:-100,
  width:200,
  height:200,
  opacity:0.1,
  position:'absolute'
}
});

export default Mylist;