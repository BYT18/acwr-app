import React, { useState, useLayoutEffect} from 'react';
import { StyleSheet, Button, Image, Pressable, Text, View, SafeAreaView, SectionList,ActivityIndicator, TouchableOpacity, Dimensions, ScrollView, Modal, RefreshControl} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from './Firebase';

import { thisUser } from './login';
import { athletes } from './homeNav';
import { getStatusAsync } from 'expo-background-fetch';
import { async } from '@firebase/util';
import { color } from 'react-native-elements/dist/helpers';
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

function Share({navigation}) {
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
          return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'limegreen'}]}
                    //onPress={() => {
                    //    setModalVisible(true)     
                    //}}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={{fontSize:12}}>{s}</Text>
                </TouchableOpacity>
        } else if (1.3 < s && s <= 1.5) {
            return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'yellow'}]}
                    onPress={() => {
                        addData()     
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={{fontSize:12}}>{s}</Text>
                </TouchableOpacity>
        } else {
          //return <Image style={[styles.av,{borderWidth:0}]} source={{uri: photo}}></Image>
          return <TouchableOpacity
                    style={[styles.roundButton1,{borderColor:'red'}]}
                    onPress={() => {
                        getData() 
                    }}
                >
                {/*<MaterialIcons name='access-time' size={50} color='orange'></MaterialIcons>*/}
                    <Text style={{fontSize:12}}>{s}</Text>
                </TouchableOpacity>
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
        graphData = docSnap.data().values
        setIsLoading(false)
        return docSnap.data().values
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style = {{flexDirection: 'row'}}>
                <View style = {{flex:7}}>
                    <Searchbar
                        //placeholder= {'search '+ thisUser.team}
                        placeholder= {'SEARCH'}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        elevation={0}
                    />
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
                {athletes.map(item => (
                    <View key={item.key} style={[{ justifyContent: "space-evenly" }, { flexDirection: "row" }]}>
                        <TouchableOpacity style={styles.item} onPress={()=>
                             //HomeScreen(),
                             //navigation.navigate('name',{name:item.name, chatID: item.chatID})
                             {setModalVisible(true), setClickedPerson(item.name), setClickedEmail(item.email), getLab(item.email), getDat(item.email)}
                             //HomeScreen()
                             //navigation.navigate('C')
                             }>
                            <View key={item.key} style={[ { flexDirection: "row" }]}>
                                {/*{alert(item.newM, item.avatar)}*/}
                                {/*<Image style={[styles.av,{borderWidth:0}]} source={{uri: 'https://placeimg.com/140/140/any'}}></Image>*/}
                               
                                <Text style={[styles.text,{ flex:3}]}>
                                    {item.name}
                                </Text>
                                <TouchableOpacity  style={[styles.statusBox,{backgroundColor: statCol(item.status)}]}>
                                    <Text style={[styles.statusText]}>
                                        {item.status}
                                    </Text>
                                </TouchableOpacity>
                                {alert(Math.round(item.acwr * 100) / 100)}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <Modal
                //style={[{width:100}]}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{clickedPerson}</Text>
                        <Text style={styles.modalText}>Projected</Text>
                        <Text style={styles.modalText}>Target</Text>
                        {!isLoading ? (
                        <View>
                            <LineChart
                        data={{
                        //labels: global.data.date.slice(-7),
                        //labels: chartLabels(),
                        labels: graphLabels,
                        //labels: item.labels,
                        datasets: [
                            {
                            data: graphData
                            //data: item.data
                            //data: getDat(clickedEmail)
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
                        bezier
                        style={{
                            marginVertical: 10,
                            borderRadius: 10
                        }}
                        />
                        </View>
                        ) : (
                        <ActivityIndicator size="large" animating={true} color = 'gray' style={{paddingBottom:10}}/>
                        )}
                        
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(!modalVisible)
                                graphData = []
                                graphLabels = []
                                setIsLoading(true)
                            }
                            }
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    text:{
        paddingTop:10,
        paddingLeft:25,
        fontSize: 30,
        fontFamily:'Helvetica',
        justifyContent:'center'
        //color:'white'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "red",
        padding:5
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
        marginHorizontal: 10,
        //marginTop: 5,
        padding: 15,
        //backgroundColor: 'slateblue',
        //fontSize: 50,
        borderBottomColor:"grey",
        borderBottomWidth:0.5,
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
        //borderWidth:2,
        borderRadius:15,
        //borderColor:'red'
        //backgroundColor:'red'
    }
    
});

export default Share;