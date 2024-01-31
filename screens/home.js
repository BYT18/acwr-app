import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Button, Text, View, SafeAreaView, Platform, TouchableOpacity, FlatList, RefreshControl, Dimensions, ScrollView} from 'react-native';
//import { MaterialIcons } from '@expo/vector-icons';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from './Firebase';
import { useIsFocused } from '@react-navigation/native'
import ACWREntry from '../components/ACWREntry';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
//import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
//import CustomButton from '../components/CustomButton';
import { getAuth } from "firebase/auth";
//import * as BackgroundFetch from 'expo-background-fetch';
//import * as TaskManager from 'expo-task-manager';
//import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import InNav from '../components/InNav';
import { thisUser } from './homeNav';
//import { async } from '@firebase/util';
//import { removePushTokenSubscription } from 'expo-notifications';

const contacts = []

/*const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = new Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}*/

var goals = []
const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75)


/*const TASK_NAME = "BACKGROUND_TASK"

TaskManager.defineTask(TASK_NAME, () => {
  try {
    // fetch data here...
    const receivedNewData = "Simulated fetchhome " + Math.random()
    global.data.acwr.push(0)
    //console.log("My task ", receivedNewData)
    console.log('task done' + global.data.acwr)
    return receivedNewData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData
  } catch (err) {
    console.log('big error' + err)
    return BackgroundFetch.Result.Failed
  }
})*/

function Home({navigation, route}) {
  
/*RegisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 1, // seconds,
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    })
    console.log("Task registered")
  } catch (err) {
    console.log("Task Register failed:", err)
  }
}*/
  /*const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();*/

      //console.log(global.data)
  const [isRegistered, setIsRegistered] = useState(true);
  const [status, setStatus] = useState(null);
  const [carInd, setCarInd] = useState(0);

   const getGoals = async() => {
     if (global.data.goals.length > 2){
       for (let i = 0; i < 3; i++) {
         const tempGo = global.data.goals[Math.floor(Math.random() * global.data.goals.length)]
         while (tempGo == null){
           tempGo = global.data.goals[Math.floor(Math.random() * global.data.goals.length)]
         }
         goals.push({key:(global.data.date[Math.floor(Math.random() * global.data.goals.length)]), goaltext:tempGo})
       }
     }else{
      goals.push({key:"Add more goals", goaltext:"Keep working!"})
     }
   };

  /*const getGoals = async() => {
    if (global.data.goals.length > 0){
      for (let i = 0; i < 3; i++) {
        const tempGo = global.data.goals[i]
        //while (tempGo == null){
        //  tempGo = global.data.goals[i]
        //}
        goals.push({key:(global.data.date[i]), goaltext:tempGo})
      }
    }
  };*/

  //getGoals()

  // const getAthleteName = () => {
  //   const docSnap = getDoc(doc(db, "users", thisUser.email))

  //       thisUser.name = docSnap.data().name
  // }

  
  const isFocused = useIsFocused()
  useEffect(() => {
    global.data = global.data
  }, [isFocused]);

  useEffect(() => {
    getGoals()
  }, [])

  /*const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };*/
    
    const tableHead = ['Day/Workout', 'Monday', 'Wednesday', 'Friday']
    const tableData = [
              ['Warm Up', 'Cleans', 'Snatch', 'Clean + Jerk'],
              ['Superset 1', 'Squat\nRDL', 'Bench\nPullup', 'Deadlift\nNordic Curls'],
              ['Superset 2', 'Calf Bounds', 'Rows\nLateral Raises', 'Back Extension\nReverse Nordic'],
              ['Cool Down', 'Tibialis Raises', 'Rotator Cuff', 'Calf Raises']
            ]

    const chartLabels = () => {
        if ( global.data.date.length < 7){
            const days = global.data.date
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < global.data.date.length; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }else{
            const days = global.data.date.slice(-7)
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < 7; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }
    }

  const allTimeLabels = (length) => {
      const dates = []
      for (let i = 0; i < length - 1; i++) {
        dates[i] = ''
      }
      dates[0] = global.data.date[0]
      dates.push(global.data.date[global.data.date.length-1])
      return dates
  }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        var displayName = user.displayName;
        //const email = user.email;
        //const photoURL = user.photoURL;
        //const emailVerified = user.emailVerified;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        //const uid = user.uid;
    }

    const data = [
      {
        labels: chartLabels(),
        data: global.data.acwr.slice(-7)
      },
      {
        //labels: allTimeLabels(global.data.acwr.length),
        labels: allTimeLabels(30),
        data: global.data.acwr
      },
    ];
    
    const CarouselCardItem = ({ item, index }) => {
      return (
        <View style={[styles.carousel,{justifyContent:'center', alignContent:'center'}]}  key={index}>
          <LineChart
          data={{
          //labels: global.data.date.slice(-7),
          //labels: chartLabels(),
          labels: item.labels,
          datasets: [
              {
              /*data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
              ]*/
              //data: global.data.acwr.slice(-7)
              data: item.data
              }
          ]
          }}
          width={Dimensions.get("window").width - 40} // from react-native
          height={250}
          //yAxisLabel="$"
          //yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 69, 196, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 39, 89, ${opacity})`,
          style: {
              borderRadius: 1
          },
          propsForDots: {
              r: "3",
              strokeWidth: "6",
              stroke: "#001f59"
          }
          }}
          style={{
            marginVertical: 10,
            borderRadius: 10
          }}
        />
        </View>
      )
    }
    const isCarousel = React.useRef(null)

    const pickCol = (s) =>{
        if (0.9 <= s && s <= 1.3) {
            return 'limegreen'
          } else if (1.3 < s && s <= 1.5) {
              return 'gold'
          } else {
            return 'red'
          }
    }
  
    return (
        <SafeAreaView style={[styles.container, {flexDirection: "column"}]}>
  
            {/* <View>
                    <Text style={styles.welcometext}>Welcome, {displayName} </Text>
            </View> */}
                        {/* <Text style={[{fontWeight: "700", fontSize: 28, paddingHorizontal: 20, paddingTop: 30}]}>{thisUser.name}'s Lab</Text> */}

          <ScrollView>
            <View style={{flex: 2, justifyContent:'space-between'}}>
              
                <View style={{ marginVertical:12}}>

                <View>
                    <Text style={styles.centersubheading}>Current ACWR</Text>
                </View>
                            <Text style={[styles.roundbuttontext1, {color: pickCol(Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100)}]}>
                                {Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100}
          </Text>
                    </View>
                           
                <View style={{ justifyContent: 'center', alignSelf:'center'}}>
                <View>
                    <Text style={styles.centersubheading}>Load Progress</Text>
                </View>
                <View style={{flex:1,}}>
                
                  <Carousel
                      layout="stack"
                      layoutCardOffset={0}
                      ref={isCarousel}
                      data={data}
                      renderItem={CarouselCardItem}
                      sliderWidth={SLIDER_WIDTH}
                      itemWidth={ITEM_WIDTH}
                      inactiveSlideShift={0}
                      useScrollView={true}
                      onSnapToItem={(index) => setCarInd(index) }
                    />   
                          
                </View>
                <View style={{flex: 20, marginTop: -40, marginBottom: 5,}}>
                <Pagination
                  dotsLength={data.length}
                  activeDotIndex={carInd}
                  carouselRef={isCarousel}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 2,
                    backgroundColor: '#000',
                  }}
                  tappableDots={true}
                  inactiveDotStyle={{
                    backgroundColor: 'black',
                    // Define styles for inactive dots here
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={1}
                />   
                </View>
            </View>
            
            </View>
            <View style={{flex:1,}}>
                <View style={styles.goalstextbox}>
                  <Text style={styles.goalstext}>
                    Goals
                  </Text>
                  {/*<FlatList 
                            data={goals}
                            renderItem={({item}) => <Text style={styles.goalstexttwo}>{item.key}</Text>}
                /> */}
                  <FlatList
                  style={styles.goallistcontainer}
                    data={goals}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                        renderItem={({ item }) => (
                            <View style={styles.goalsbutton}>
                                <View>
                                    <View style={styles.itemtitlebox}>
                                    <Text style={styles.itemtitle}>{item.key}</Text> 
                                    <Text style={styles.itemgoal}>{item.goaltext}</Text> 
                                    </View>
                                </View>
                            </View>
                        )}  
                    />
                </View>
                {/*<InNav style={{  alignSelf:'center'}} image={require('../assets/goals.jpg')} text='View Goals'/>*/}
                {/* <InNav image={require('../assets/workout.jpg')} text='View Workout Plan' 
                onPress={() => openLink()}
                //onPress={() => removePushTokenSubscription(isRegistered)}
                /> */}
            </View>
            </ScrollView>
            {/* <ACWREntry /> */}
        </SafeAreaView>
    );
}

async function openLink() {
  const querySnapshot = await getDoc(doc(db, "teams", thisUser.team));
  //const querySnapshot = await getDoc(doc(db, "teams", 'varsity blues', 'workouts', '2022.8.14'));
  console.log("Document data:", querySnapshot.data().workout);
  //WebBrowser.openBrowserAsync('https://docs.google.com/document/d/1-AE1s9csIH2K-I1qxqjm1voYK95gGR6fGIg5ZtYK5CU/edit?usp=sharing')
  WebBrowser.openBrowserAsync(querySnapshot.data().workout)
}
  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    carousel:{
        //backgroundColor: 'black',
        borderRadius: 5,
        width: ITEM_WIDTH,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    welcometext: {
        padding: 10,
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 10,
    },
    roundButton1: {
        //justifyContent: 'center',
        //alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    roundbuttontext1: {
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    profileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        //backgroundColor: 'white',
        //borderRadius:10,
        //borderWidth: 1,
        //borderColor: '#fff'
    },
    fileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        //backgroundColor: 'white',
        //borderRadius:10,
        //borderWidth: 1,
        //borderColor: '#fff'
    },
    loginScreenButton: {
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#1E6738',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    subheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 5,
    },
    centersubheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20,
        textAlign: 'center',
    },
    goalstextbox: {
      marginLeft: 20,
      marginRight: 20,
      borderColor: 'black',
    },
    goalstext: {
        marginLeft: 2,
        paddingBottom: 2,
        //marginRight: 10,
        fontWeight: '600',
        //paddingVertical: 2,
        fontSize: 24,
        //borderWidth: 5,
        //borderColor: 'red'
    },
    goalstexttwo: {
      fontWeight: '400',
      fontSize: 18,
    },
    roundButton1: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        borderWidth: 5,
        margin:10
    },
    head: {
        height: 30,
        backgroundColor: '#f1f8ff'
     },
    text: { 
        margin: 5 
    },
    goallistcontainer: {
      paddingVertical: 28,

  },
    goalsbutton:{
      backgroundColor: '#f0f0f0',
      width:200,
      marginRight: 20,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 10,
    },
    itemtitle: {
      fontSize: 15,
      fontWeight: "800",
      color: "#757575",
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      backgroundColor: "#f0f0f0",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    itemgoal: {
      fontSize: 15,
      fontWeight: "800",
      color: "#000",
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: "#f0f0f0",
    },
    itemtitlebox: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: "#f0f0f0",
    },
});


export {contacts};
export default Home;