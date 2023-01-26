import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Button, Text, Modal, View, Pressable, TextInput, Keyboard,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
//import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

import Home from "./screens/home"
import homeNav from './screens/homeNav';
import login from './screens/login';
import Settings from './screens/settings';
import Report from './screens/Report';
import ReportTwo from './screens/BodyPage'
import RegisterNav from './screens/RegisterNav'
import CoachHomeNav from './screens/CoachScreens/CoachHomeNav'
import CoachSettings from './screens/CoachScreens/CoachSettings';

const Stack = createNativeStackNavigator();


//export default function App() {
const App = ({navigation}) => {
  const auth = getAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
  
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
        global.data.time = JSON.parse(jsonValue).time
        global.data.percieved = JSON.parse(jsonValue).percieved
        global.data.acwr = JSON.parse(jsonValue).acwr
    } catch(e) {
      // error reading value
    }
  }
  getData()


  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen 
          name="Login" 
          component={login}
          options={{headerShown: false}}
      />
      <Stack.Screen 
          name="LiNK" 
          component={homeNav} 
          //options={{ 
          options={({ navigation }) => ({
            gestureEnabled: false,
            headerTitle: 'Perception',
            headerStyle: {
              //backgroundColor: '#f4511e',
            },
            headerRight: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('Settings')
                //signOut()
              }>
                  <MaterialIcons name='settings' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('Report')
                //signOut()
              }>
                  <MaterialIcons name='add' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            })}
          //options={{ headerShown: false }}
        />
        {/*<Stack.Screen 
          name="Home" 
          component={Home} 
          />*/}
        <Stack.Screen 
          name="CoachHomeNav" 
          component={CoachHomeNav} 
          options={({ navigation }) => ({
            headerTitle: 'Perception',
            headerRight: () => (
              <TouchableOpacity onPress={() => 
                //alert('This is a button!')
                //navigation.navigate('Register')
                navigation.navigate('CoachSettings')
                //signOut()
              }>
                  <MaterialIcons name='settings' size={30} color="black">
                  </MaterialIcons>
              </TouchableOpacity>
            ),
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => 
            //     //alert('This is a button!')
            //     //navigation.navigate('Register')
            //     navigation.navigate('Report')
            //     //signOut()
            //   }>
            //       <MaterialIcons name='add' size={30} color="black">
            //       </MaterialIcons>
            //   </TouchableOpacity>
            // ),
          })}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterNav} 
        />
        <Stack.Screen 
          name="Settings" 
          component={Settings} 
        />
        {/* <Stack.Screen 
          name="ReportTwo" 
          component={ReportTwo} 
          options={({ navigation }) => ({
            headerTitle:'Extra'
          })}
        /> */}
        <Stack.Screen 
        name="CoachSettings" 
        component={CoachSettings} 
        />
        <Stack.Screen 
            name="Report" 
            component={Report} 
            options={({ navigation }) => ({
              //gestureEnabled: false,
              // headerRight: () => (
              //   <Button
              //   title='Submit'
              //   onPress={() => 
              //   alert('This is a button')
              //   }
              //   />
              //   // <TouchableOpacity onPress={() => 
              //   //     //alert('This is a button!')
              //   //     //navigation.navigate('Register')
              //   //     navigation.navigate('ReportTwo')
              //   //     //signOut()
              //   //   }
              //   //   //style={{alignItems:'flex-end', justifyContent:''}}
              //   // >
              //   //   <View style={{flexDirection:'row', alignItems:'center'}}>
              //   //     <Text style={styles.submitbutton}>Submit</Text>
              //   //     {/* <MaterialIcons name='arrow-right' size={35} color="black">
              //   //     </MaterialIcons> */}
              //   //   </View>
              //   // </TouchableOpacity>
              // ),
            })}
        />
    {/*<View style={styles.container}>
      <Home></Home>
      <StatusBar style="auto" />
  </View>*/}
  </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitbutton: {
    fontWeight: '700',
  },
});

export default App;