import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import { auth, db} from "../Firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore"; 

const RegisterCoachScreen = ({navigation}) =>{
  const[email, setEmail] = useState('');
  const[name, setName] = useState('');
  const[team, setTeam] = useState('');
  const[imageURL, setImageURL] = useState('');
  const[password, setPassword] = useState('');
  
  const register = () =>
    createUserWithEmailAndPassword(auth, email,password)
    .then((userCredential) => {
        //console.log("Document written with ID: ", docRef.id);
        createTeam(team,email.toLowerCase())
        /*addDoc(collection(db, "teams"), {
            name: team,
            athletes: [],
            coach: email
            //password: password
        });*/
        updateProfile(auth.currentUser, {
          displayName: name, photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
        navigation.navigate('CoachHomeNav')

    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
  });

    const createTeam = async (team, email) =>{
        const docRef = await addDoc(collection(db, "teams"), {
            name: team,
            athletes: [],
            coach: email,
            workout:''
        });
        setDoc(doc(db, "users", email.toLowerCase()), {
            name: name,
            email: email.toLowerCase(),
            teamID: docRef.id,
            //password: password
          });
        console.log('test' + docRef.id)
        return docRef.id
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
          placeholder = 'Enter Team Name'
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
          <TouchableOpacity style = {styles.button} onPress = {register}>
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
      color: 'black',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '500',
    },
    button:{
      width:320,
      height:45,
      marginTop: 10,
      borderRadius: 8,
      borderColor: 'black',
      borderWidth: 2,
      justifyContent: 'center'
    },
  });
  
  export default RegisterCoachScreen;