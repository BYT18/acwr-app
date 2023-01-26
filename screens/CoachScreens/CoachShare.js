import React, { useState, useLayoutEffect} from 'react';
import { StyleSheet, Button, Image, Pressable, Text, View, SafeAreaView, SectionList,ActivityIndicator, TouchableOpacity, Dimensions, ScrollView, Modal, RefreshControl} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from '../Firebase';

import { thisUser } from '../login';
import { athletes } from './CoachHomeNav';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

var graphLabels = []
var graphData = []
var comments = []
var mood = []

function CoachShare({navigation}) {
    //console.log(thisUser)

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);

    const [people, setPeople] = useState([
        { name: 'shaun', id: '1', acwr: 5, newM:true  },
        { name: 'yoshi', id: '2', acwr: 0.2, newM:true },
        { name: 'mario', id: '3', acwr: 8, newM:true  },
        { name: 'luigi', id: '4', acwr: 7, newM:false},
        { name: 'peach', id: '5', acwr: 6, newM:false },
        { name: 'toad', id: '6', acwr: 2, newM:false},
        { name: 'bowser', id: '7', acwr: 3, newM:false },
        { name: 'bowser', id: '8', acwr: 1, newM:false},
    ]);
    //const [people, setPeople] = useState(contacts);

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    const [modalVisible, setModalVisible] = useState(false);
    const [mAlert, showmAlert] = useState(false);
    const [clickedPerson, setClickedPerson] = React.useState('');
    const [clickedEmail, setClickedEmail] = React.useState('');

    const data = {acute:[], chronic :[]};
    //var data;

    const alert = (s) => {
        if (0.9 <= s && s <= 1.3) {
          //return <Image style={styles.av} source={{ uri:'https://placeimg.com/140/140/any'}}></Image>
          //return <Image style={styles.av} source={{uri: people[1].avatar}}></Image>
          return <View
                    style={[styles.roundButton1,{borderColor:'limegreen'}]}
                    //onPress={() => {
                    //    setModalVisible(true)     
                    //}}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={styles.acwrtext}>{s}</Text>
                </View>
        } else if (1.3 < s && s <= 1.5) {
            return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'yellow'}]}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={styles.acwrtext}>{s}</Text>
                </TouchableOpacity>
        } else {
          //return <Image style={[styles.av,{borderWidth:0}]} source={{uri: photo}}></Image>
          return <View
                    style={[styles.roundButton1,{borderColor:'red'}]}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={styles.acwrtext}>{s}</Text>
                </View>
        }
    }

    //var athletes = []
    const getTeam = async () => {
        const docRef = doc(db, "teams", thisUser.team);
        const docSnap = await getDoc(docRef);
        //athletes = docSnap.data().athletes
        //console.log("Document data:", docSnap.data().athletes)
        /*for (let i = 0; i < docSnap.data().athletes.length; i++) {
            const athlete = {
                id: i,
                name: docSnap.data().athletes[i].name,
                acwr: docSnap.data().athletes[i].acwr,
            }
            athletes.push(athlete)
        }
        console.log(athletes)*/
        //JSON.parse(athletes)
        //console.log(athletes)
        //var [peo, setPeo] = useState(athletes)
        //console.log(people)
    }

    const chartLabels = (dates) => {
        if (dates.length < 7){
            const days = dates
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < dates.length; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }else{
            const days = dates.slice(-7)
            const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (let i = 0; i < 7; i++) {
                days[i] = weekday[new Date(days[i]).getDay()]
            }
            return days
        }
    }

    const statCol = (stat) =>{
        if (stat == 'Resting'){
            return 'orange'
        }
        else if (stat == 'Academic'){
            return 'blue'
        }
        else if (stat == 'Injured'){
            return 'red'
        }
        else if (stat == 'Active'){
            return 'green'
        }
    }
    

    useLayoutEffect(() => {
        //getTeam()
        if (onChangeSearch){

        }
    })
    //console.log('main',athletes)

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            jsonValue != null ? JSON.parse(jsonValue) : null;
            //console.log(JSON.parse(jsonValue).acute)
            data.acute = JSON.parse(jsonValue).acute
            data.chronic = JSON.parse(jsonValue).chronic
            return jsonValue
        } catch(e) {
          // error reading value
        }
    }

    const updateData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
            console.log('done')
          } catch (e) {
            // saving error
          }
    }

    const addData = () => {
        try {
            data.chronic.push(100)
            //console.log(data.acute)
            //console.log(data.chronic)
          } catch (e) {
            // saving error
          }
    }

    const getPlayerData = async(email) => {
        const docRef = doc(db, "users", email, 'data', 'acwr');
        const docSnap = await getDoc(docRef);
        graphData = docSnap.data.values
        graphLabels = docSnap.data.dates
    }

    const getLab = async(email) => {
        const docRef = doc(db, "users", email, 'data', 'acwr');
        const docSnap = await getDoc(docRef);
        graphLabels = chartLabels(docSnap.data().dates)
        return docSnap.data().dates
    }

    const getDat = async(email) => {
        const docRef = doc(db, "users", email, 'data', 'acwr');
        const docSnap = await getDoc(docRef);
        comments = docSnap.data().comments
        graphData = docSnap.data().values
        mood = docSnap.data().mood
        setIsLoading(false)
        return docSnap.data().values
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style = {{flexDirection: 'row'}}>
                <View style = {{flex:7}}>
                    {/* <Searchbar
                        //placeholder= {'search '+ thisUser.team}
                        placeholder= {'SEARCH'}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        elevation={0}
                    /> */}
                </View>
                {/*<View style = {{flex:2, justifyContent:'center'}}>
                    <Button
                        title='Filter'
                    >
                    </Button>
                </View>*/}
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
            >
                <Text style={[{fontWeight: "700", fontSize: 28, paddingHorizontal: 20, paddingTop: 30}]}>Team List</Text>
                <View style={[{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, fontWeight: "800", fontSize: 18}]}>
                <Text style={[{fontWeight: "600", fontSize: 21}]}>Name</Text><Text style={[{fontWeight: "600", fontSize: 21}]}>ACWR</Text>
                </View>
                {athletes.map(item => (
                    <View key={item.key} style={[{ justifyContent: "space-evenly"}, { flexDirection: "row", marginTop: 20, }]}>
                        <View style={styles.item}>
                            <View key={item.key} style={[ { flexDirection: "row" }]}>
                            
                                <Text style={[styles.nametext,{ flex:3}]}>
                                    {item.name.toUpperCase()}
                                </Text>
                                </View>
                                </View>

                                <View style={styles.acwrbox}>

                                {/* <View  style={[styles.statusBox,{backgroundColor: statCol(item.status)}]}>
                                 */}
                                   <View  style={[styles.statusBox]}>

                                    {/* <Text style={[styles.statusText]}>
                                        {item.status}
                                    </Text> */}
                                </View>
                                <View style={styles.acwrtext}>
                                {alert(Math.round(item.acwr * 100) / 100)}
                                </View>
                                </View>

                            
                        
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    /*container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
      //alignItems: 'center',
      //justifyContent: 'center',
    },*/
    av: {
        width: 50,
        height: 50,
        //alignSelf:"center",
        borderRadius: 50,
        //borderWidth:4,
        //borderColor:'dodgerblue'
    },
    roundButton1: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        //backgroundColor: 'orange',
        borderWidth: 5,
        //borderColor:'limegreen'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    container: {
        flex: 1,
        paddingTop: 40,
        //paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    nametext:{
        paddingTop:13,
        paddingLeft:25,
        justifyContent:'center',
        fontSize: 21,
        fontWeight: '600'
        //color:'white'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "red",
        padding:5,
        marginTop: 20
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    item: {
        flex: 1,
        backgroundColor: '#ececec',
        fontSize: 50,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        marginLeft: 15,
        paddingTop: 20,
    },
    profileIcon: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    statusText:{
       fontSize:10,
       color:'white'
    },
    statusBox:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        marginRight:15,
        padding:5,
        borderRadius:15,
    },
    acwrbox:{
        backgroundColor: '#f6f6f6',
        alignItems: 'center',
        justifyContent: "center",
        alignContent: "center",
        textAlign: 'center',
        paddingHorizontal: 15,
        marginRight: 15,
        paddingBottom: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    acwrtext: {
        fontSize:10, 
        fontWeight: '800',
    },
    
});

export default CoachShare;