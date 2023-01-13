import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getAuth, onAuthStateChanged, signInWithEmailAndPassword  } from "firebase/auth";
//import { auth } from './Firebase';
import {auth, db} from "./Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, getAdditionalUserInfo,  getAuth} from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import {Video} from 'expo-av'
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"

nowDate = new Date()
/*global.data = {
  date: [nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate()],
  fullDate: [nowDate],
  time: [0],
  percieved: [0],
  acute: [0],
  chronic: [0],
  acwr: [0],
  desc: [0],
  com: [0],
  goals: [0],
  notifications:true
}*/

global.data = {
  date: [],
  fullDate: [],
  time: [],
  percieved: [],
  acute: [],
  chronic: [],
  acwr: [],
  desc: [],
  com: [],
  goals: [],
  notifications:true
}

const signOut = () => {
  //navigation.navigate('Login')
  getAuth().signOut().then(function() {
      navigation.navigate('Login')
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
}
//signOut()

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
    //console.log(new Date())
    //console.log(jsonValue)
  } catch (e) {
    // saving error
  }
}

//storeData(global.data)

function myTask() {
  try {
    // fetch data here...
    const backendData = "Simulated fetch " + Math.random();
    const day = new Date()
    if (global.data.date.indexOf(day.getFullYear()+'/'+(day.getMonth()+1)+'/'+day.getDate()) == -1){
        var acutePast = global.data.acute[global.data.acute.length - 1]
        var chronicPast = global.data.chronic[global.data.chronic.length - 1]
        //var current = time * slide
        var current = 0
        var acwrNew = 0
        var acuteNew = 0
        var chronicNew = 0

        if (global.data.date.length === 0){
            acwrNew = 0
            acuteNew = current
            chronicNew = current
        }
        else{
            acuteNew = (current * 0.25) + (0.75 * acutePast) 
            chronicNew = current * (2/22) + (1 - 2/22) * chronicPast
            acwrNew = acuteNew/chronicNew
        }

        global.data.acwr.push(acwrNew)
        global.data.time.push(0)
        global.data.fullDate.push(day)
        global.data.date.push(day.getFullYear()+'/'+(day.getMonth()+1)+'/'+day.getDate())
        storeData()
        updateDoc(doc(db, "teams", thisUser.team, 'athletes',  thisUser.email.toLowerCase()), {
          acwr: acwrNew, 
      })
    }
    console.log(global.data.acwr)
    console.log(global.data.date)
    console.log("myTask() ", backendData);
    return backendData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    //return BackgroundFetch.Result.Failed;
  }
}
async function initBackgroundFetch(taskName,taskFn,interval = 60*15) {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
    TaskManager.defineTask(taskName, taskFn);
    }
    const options = {
    minimumInterval: interval, // in seconds
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  };

  await BackgroundFetch.registerTaskAsync(taskName, options);
  } catch (err) {
  console.log("registerTaskAsync() failed:", err);
  }
}

  initBackgroundFetch('myTaskName', myTask, 60);

//var data = {daily: [], acute:[], chronic :[]};
//var data = {

//global [global.data, global.onChangeACWR] = React.useState();
var allUsers = []
var thisUser = {name: '', email: '', acwr: null, team:'', teamID: null}
var athletes = []

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const login = ({navigation}) =>{

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  
  
  const signIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        //alert(errorMessage)
        alert('Email or Password Invalid')
      }); 
    
    getUser()
  }

  const getTeam = async (team) => {
    const docRef = doc(db, "teams", team);
    const docSnap = await getDoc(docRef);
    athletes = docSnap.data().athletes
    console.log('login',athletes)
  }

  const getUser = async(email) => {
    await getDocs(query(collection(db, "users"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //const allUsers = []
          //console.log('doggggg' + email)
          if (doc.data().email == email){
            thisUser.email = email
            thisUser.name = doc.data().name
            thisUser.acwr = doc.data().acwr
            thisUser.team = doc.data().team
            thisUser.teamID = doc.data().teamID
            thisUser.status = doc.data().status
            console.log('ghost' + thisUser.teamID)
            if (thisUser.teamID != null){
              navigation.navigate('CoachHomeNav');
            }
            else{
              navigation.navigate('LiNK',{acwr: Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100, name: thisUser.name});
            }
                }
      });
    });
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

    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      getUser(user.email)
      getData()
      getTeam()
      
      //console.log('cattt' + getUser(user.email).resolve(value).toString())
      //navigation.replace('LiNK');
    } else {
        navigation.canGoBack() && navigation.popToTop()
    }
    });
    return unsubscribe
  })

  return (
    <View style={styles.container}>
      <Video
          source={require("./../assets/video1.mp4")}
          style={styles.backgroundVideo}
          shouldPlay={true}
          isLooping
          resizeMode='cover'
          isMuted
          ignoreSilentSwitch={"obey"}
          />
      <SafeAreaView>
      
        <Text style={styles.welcomeText}>Login</Text>
        <View>
      <Input
      inputStyle = {{color:'white'}}
      placeholder = 'Enter Email'
      placeholderTextColor="#bbbbbb"
      leftIcon = {{type: 'material', name:'email', color: 'white'}}
      value = {email}
      onChangeText = {text => setEmail(text)}
      />
      <Input
      inputStyle = {{color:'white'}}
      placeholder = 'Enter Password'
      placeholderTextColor="#bbbbbb"
      leftIcon = {{type: 'material', name:'lock', color:'white'}}
      value = {password}
      onChangeText = {text => setPassword(text)}
      secureTextEntry
      />
      </View>
      <View style={styles.buttonBox}>
      <TouchableOpacity style={styles.button} onPress={signIn}>
      <View><Text style={styles.buttonText}>Sign In</Text></View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttontwo} onPress={()=>navigation.navigate('Register')}>
      <View><Text style={styles.buttontwoText}>Register</Text></View>
      </TouchableOpacity>
      </View>
      {/*<Button title = 'Sign In' style = {styles.button} onPress={()=>navigation.navigate('LiNK')}/>*/}
      {/* <Button title = 'Register' style = {styles.button} onPress={()=>navigation.navigate('Register')}/> */}
      </SafeAreaView>
    </View>
  )
}

const offset = 24;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 43,
    fontWeight: '700',
    marginTop: 80,
    marginBottom: 80,
    color: 'white',

  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
  buttonText: {
    // marginLeft: offset,
    // fontSize: offset,
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  buttontwoText: {
    // marginLeft: offset,
    // fontSize: offset,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  button:{
    width:320,
    height:45,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  buttontwo:{
    width:320,
    height:45,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center'
  },
  buttonBox:{
    justifyContent: 'flex-end',
    marginVertical: 40,
  },
  container:{
    flex:1,
    alignItems: 'center',
    padding:10,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

//export {thisUser, athletes, data}
export {thisUser, athletes}
export default login;