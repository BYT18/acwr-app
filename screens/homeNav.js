import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from "./home"
import Report from './Report';
import share from './share'
import History from './History';
import Calendar from './Calendar'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import settings from './settings';

import { auth, db} from "./Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth} from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 

const Stack = createMaterialBottomTabNavigator();
var thisUser = {name: '', email: '', acwr: null, team:''}
var athletes = []
/*global.data = {
  date: [],
  time: [],
  percieved: [],
  acute: [],
  chronic: [],
  acwr: [],
}*/

function homeNav() {
  //console.log(global.data)
  const[email, setEmail] = useState('');
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setEmail(user.email)
      //console.log(user.email)
      getUser(user.email)
      getData()
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const getUser = async (email) =>{
    //console.log('tet',email);
    await getDocs(query(collection(db, "users"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //const allUsers = []
          //console.log(doc.data().email);
          if (doc.data().email == email){
            thisUser.email = email
            thisUser.name = doc.data().name
            thisUser.acwr = doc.data().acwr
            thisUser.team = doc.data().team
            thisUser.status = doc.data().status
            thisUser.notiTime = doc.data().notiTime
          }
          //console.log('timmmyyy', thisUser.team);
          //allUsers.push(user)
      });
  });
  getTeam(thisUser.team)
  }
  
  const getTeam = async (team) => {
    const querySnapshot = await getDocs(collection(db, "teams", team, 'athletes'));
    var players = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      players.push(doc.data())
      //athletes.push('text')
    });
    athletes = players

    //const docRef = doc(db, "teams", team);
    //const docSnap = await getDoc(docRef);
    //athletes = docSnap.data().athletes
    //console.log('login',athletes)
  }
  

  const getData = async () => {
    
    try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        jsonValue != null ? JSON.parse(jsonValue) : null;
        //console.log(JSON.parse(jsonValue).acute)
        
        //data.acute = JSON.parse(jsonValue).acute
        //data.chronic = JSON.parse(jsonValue).chronic
        //data.daily = JSON.parse(jsonValue).daily

        global.data.acute = JSON.parse(jsonValue).acute
        global.data.chronic = JSON.parse(jsonValue).chronic
        //data.daily = JSON.parse(jsonValue).daily

        global.data.date = JSON.parse(jsonValue).date
        global.data.fullDate = JSON.parse(jsonValue).fullDate
        global.data.time = JSON.parse(jsonValue).time
        global.data.percieved = JSON.parse(jsonValue).percieved
        global.data.acwr = JSON.parse(jsonValue).acwr

        global.data.desc = JSON.parse(jsonValue).desc
        global.data.com = JSON.parse(jsonValue).com
        global.data.goals = JSON.parse(jsonValue).goals
        global.data.notifications = JSON.parse(jsonValue).notifications
        //global.data.desc = []        
        //global.data.com = []
        //global.data.goals = []
    } catch(e) {
      // error reading value
    }
    //console.log(global.data)
  }

  return (
    <Stack.Navigator
      /*</NavigationContainer>screenOptions={{
        //title: 'LiNK',
        headerStyle: {
          //backgroundColor: '#f4511e',
        },
        headerTintColor: 'slateblue',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'Cochin',
        },
      }}*/
      
      activeColor="black"
      barStyle={{ backgroundColor: 'white' }}
    >
      
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{
          // unmountOnBlur: true,
          
          tabBarColor:'white',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='home' size={24} color={color}></MaterialIcons>
          ),
        }}
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
      />
      <Stack.Screen 
        name="Calendar" 
        component={Calendar} 
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Calendar',
          tabBarColor:'white',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='calendar-today' size={24} color={color}></MaterialIcons>
          ),
        }}
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
      />
      {/* <Stack.Screen 
        name="Share" 
        component={share} 
        options={{
          // unmountOnBlur: true,
          tabBarLabel: 'Share',
          tabBarColor:'white',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='people' size={24} color={color}></MaterialIcons>
          ),
        }}
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})}
      /> */}
     
      <Stack.Screen 
        name="Settings" 
        component={settings} 
        options={{
          tabBarLabel: 'Profile',
          tabBarColor:'orange',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='person' size={24} color={color}></MaterialIcons>
          ),
        }}
      />
    </Stack.Navigator>

);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
});

export {athletes, thisUser}
export default homeNav