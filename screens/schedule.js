import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Button, Text, View, SafeAreaView, Header,Body,Title,Image, TouchableOpacity , StatusBar} from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat'
//import { auth, db } from './Firebase';


function Schedule({route}) {
  const [messages, setMessages] = useState([]);
  const username  = route.params.name;
  const chatID = route.params.chatID;
  //console.log(chatID)
  //const { name } = "joe"

  /*useEffect(() => {
    setMessages([
      {
      _id: 1,
      // text: 'Hello developer',
      text: 'Past Messages',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])*/

  useEffect(()=>{
    //const unsubscribe = db.collection('chats').
    //const unsubscribe = db.collection('chats').doc(auth.currentUser.email).collection(username).
    const unsubscribe = db.collection('chats').doc(chatID).collection('messages').
    orderBy('createdAt', 'desc').onSnapshot
    (snapshot=>setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user 
      }))
    ))

    //if (unsubscribe.user == username){
    //  return unsubscribe
    //}
    return unsubscribe;

  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user
    } = messages[0]
    db.collection('chats').doc(chatID).collection('messages').add({
      _id,
      createdAt,
      text,
      user
    })
  }, [])
  
return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {/*<View style={[styles.head, {flex: 2}]}>
          <TouchableOpacity >
            <Image style={styles.av} source={{ uri:'https://placeimg.com/140/140/any'}}></Image>
          </TouchableOpacity>
          <Text style={styles.headerText}>Chatting with {name}</Text>
</View>*/}
        <View style={{flex: 17}}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            showAvatarForEveryMessage = {true}
            //renderAvatar = {null}
            StatusBar ={{ backgroundColor: 'white' }}
            //renderMessage={<Message
            //renderUsernameOnMessage
            messagesContainerStyle={{ backgroundColor: 'white' }}
            user={{
              _id: auth?.currentUser?.email,
              name: auth?.currentUser?.displayName,
              avatar: auth?.currentUser?.photoURL,
            }}
          />
        </View>  
      </SafeAreaView>
  ) 
}


const styles = StyleSheet.create({
  container: {
    borderBottomColor:"lightgrey",
    borderBottomWidth: 1,
    //borderTopWidth: 10,
    //marginHorizontal: 10,
    backgroundColor: 'white',
    //marginTop: 100,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      //alignItems: 'center',
      //justifyContent: 'center',
  },
  head: {
    borderBottomColor:"lightgrey",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      //alignItems: 'center',
      //justifyContent: 'center',
  },
  headerText: {
      color: 'black',
      textAlign: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 3
  },
  av: {
    width: 50,
    height: 50,
    alignSelf:"center",
    borderRadius: 100,
  },
});

export default Schedule;