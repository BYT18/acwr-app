import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Input, Button} from 'react-native-elements';

import { auth, db} from "./Firebase";
import { checkActionCode, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc, arrayUnion, getDoc} from "firebase/firestore"; 
import { athletes } from './login';
import { async } from '@firebase/util';

//import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
//const auth = getAuth();
//import auth from "@react-native-firebase/auth"
//import { auth } from './Firebase';


const RegisterScreen = ({navigation}) =>{
  const[email, setEmail] = useState('');
  const[name, setName] = useState('');
  const[team, setTeam] = useState('');
  const[imageURL, setImageURL] = useState('');
  const[password, setPassword] = useState('');

  const register = async(getTeam) => {
    console.log('blablabla')
    const docSnap = await getDoc(doc(db, 'teams', getTeam));
    if (docSnap.exists() == false) {
      alert('TEAM DOES NOT EXIST')
    } else {
      // doc.data() will be undefined in this case
    createUserWithEmailAndPassword(auth, email, password) 
    .then((userCredential) => {
        //var user = userCredential.user;
        //user.updateProfile({
        //displayName: name, photoURL: imageURL? imageURL:"https://example.com/jane-q-user/profile.jpg"
        //}).catch(function(error) {
          //setValidationMessage(error.message);
        //});
        setDoc(doc(db, "users", email.toLowerCase()), {
          name: name,
          email: email.toLowerCase(),
          team: team,
          status: 'Active'
          //password: password
        });

        //console.log('register' + email)
        
        setDoc(doc(db, "teams", team, 'athletes',  email.toLowerCase()), {
          acwr: 1, 
          name: name,
          status: 'Active',
          email: email.toLowerCase()
        })

        setDoc(doc(db, "users",  email.toLowerCase(), 'data', 'acwr'), {
          dates: []
        })
       
        
        //updateDoc(doc(db, "teams", team), {
        //  athletes: arrayUnion({acwr: 1, email: email, name: name})
        //})
        /*.catch(error => {   
          switch(error.code) {
            case 'auth/email-already-in-use':
                  Alert.alert('Email already in use !')
                  break;
        }})*/

        updateProfile(auth.currentUser, {
          displayName: name, photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
        navigation.navigate('LiNK')
        //navigation.replace('LiNK')
        //navigation.popToTop();
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage)
    });
  }
}


    return (
      <View style={styles.container}>
          <Input
          placeholder = 'Enter Name'
          label = 'Name'
          leftIcon = {{type: 'material', name:'badge'}}
          value = {name}
          onChangeText = {text => setName(text)}
          />
          <Input
          placeholder = 'Enter Team Code'
          label = 'Team'
          leftIcon = {{type: 'material', name:'people'}}
          value = {team}
          onChangeText = {text => setTeam(text)}
          />
          <Input
          placeholder = 'Enter Email'
          label = 'Email'
          leftIcon = {{type: 'material', name:'email'}}
          value = {email}
          onChangeText = {text => setEmail(text)}
          />
          <Input
          placeholder = 'Enter Password'
          label = 'Password'
          leftIcon = {{type: 'material', name:'lock'}}
          value = {password}
          onChangeText = {text => setPassword(text)}
          secureTextEntry
          />
        
        
        {/*<Input
        placeholder = 'Enter Image'
        label = 'Image'
        leftIcon = {{type: 'material', name:'face'}}
        value = {imageURL}
        onChangeText = {text => setImageURL(text)}
    />*/}
        
          <TouchableOpacity style = {styles.button} onPress = {() => register(team)}>
            <Text style = {styles.buttonText}>
              Register  
            </Text>
          </TouchableOpacity>
      </View>
    )
  }
  
  const offset = 24;
  
  const styles = StyleSheet.create({
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
    container:{
      flex:1,
      alignItems: 'center',
      padding:10,
      backgroundColor: 'white'
    },
    buttonText: {
      // marginLeft: offset,
      // fontSize: offset,
      color: 'black',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '500',
    },
    button:{
      //justifyContent:,
      width:320,
      height:45,
      marginTop: 10,
      borderRadius: 8,
      borderColor: 'black',
      borderWidth: 2,
      justifyContent: 'center'
    },
  });
  
  export default RegisterScreen;