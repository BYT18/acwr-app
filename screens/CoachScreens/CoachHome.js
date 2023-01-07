import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Button, Text, View, SafeAreaView, Platform, TouchableOpacity, Pressable, FlatList, RefreshControl, Dimensions, ScrollView, ActivityIndicator, Modal} from 'react-native';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from '../Firebase';
import { useIsFocused } from '@react-navigation/native'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
import { getAuth } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import { thisUser } from '../homeNav';
import { athletes, athList } from './CoachHomeNav';
import ACWREntry from '../../components/ACWREntry';
import DateTimePicker from '@react-native-community/datetimepicker';



var goals = [];
var graphLabels = []
var graphData = []
var datecomments = []
var datedescriptions = []
var datedata = []
var arrayofdates = []
var today = new Date();
var filteredindices = [];
var sortedindices = [];
var indices = [];
var filteredacwr = [];
var filtereddates = [];
var filteredcomments = [];
var filtereddescriptions = [];

var startDate = null
const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75)

function CoachHome({navigation, route}) {
    //console.log(athletes[2].email)
  const [carInd, setCarInd] = useState(0);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [clickedPerson, setClickedPerson] = React.useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [open, setOpen] = useState(false)
  const [dotSelected, setDotSelected] = useState();
  const [date, setDate] = useState();
  const [startdate, setstartDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
  const [acwr, setACWR] = useState();
  const [commentsDate, setCommentsDate] = useState([]);
  const [descriptionsDate, setDescriptionsDate] = useState([]);
  const [athleteName, setAthleteName] = useState();
  const [enddate, setenddate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(true);
  const [endOpen, setEndOpen] = useState(false);

  const resetOnChange = () => {
    filteredindices=[]
    filteredacwr=[]
    filteredcomments=[]
    filtereddates=[]
    sortedindices=[]
    indices=[]
  }

  const onStartChange = (event, selectedDate) => {
    resetOnChange()
    const currentDate = selectedDate;
    setstartDate(selectedDate)
  };

  const onEndChange = (event, selectedDate) => {
    resetOnChange()
    const currentDate = selectedDate;
    setenddate(selectedDate)
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  
  const renderLabel = (label, foc) => {
    if (value || foc) {
      return (
        <Text style={[styles.label, foc && { color: 'blue' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };
  
  const isFocused = useIsFocused()
  useEffect(() => {
    graphData = graphData
    graphLabels = graphLabels
    global.data = global.data
    arrayofdates = getDatesBetween(startdate, enddate)
    filterDatabyDate()
    console.log(filtereddates)
    console.log(graphLabels)
    console.log(filteredacwr)
  }, [
    //isFocused, 
    graphData, 
    filteredacwr,
    graphLabels, startdate, enddate
    ]);


    const getLab = async(email) => {
        const docRef = doc(db, "users", email, 'data', 'acwr');
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data().dates + 'datasss')
        graphLabels = chartLabels(docSnap.data().dates)
        return docSnap.data().dates
    }

    const getDat = async(email) => {
        const docRef = doc(db, "users", email, 'data', 'acwr');
        const docSnap = await getDoc(docRef);
        graphData = docSnap.data().values
        datedata = docSnap.data().dates
        // console.log(datedata)
        datedescriptions = docSnap.data().description
        datecomments = docSnap.data().comments
        // console.log(datecomments)
        setIsLoading(false)
        return docSnap.data().values
    }

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
        var displayName = user.displayName;
    }

    const data = [
      {
        labels: chartLabels(),
        data: global.data.acwr.slice(-7)
      },
      {
        labels: allTimeLabels(global.data.acwr.length),
        data: global.data.acwr
      },
    ];

    const resetDotData = () => {
        setAthleteName(null)
        setDate(null)
        setACWR(null)
        setCommentsDate(null)
        setDescriptionsDate(null)
    }
    
    const fetchDotData = (index) => {
        setDotSelected(!dotSelected)
        setACWR(graphData[indices[index]].toFixed(2));
        setDate(datedata[indices[index]]);
        // console.log(datecomments)
        setCommentsDate(datecomments[indices[index]])
        setDescriptionsDate(datedescriptions[indices[index]])
        //indices[index] gives the index of the original array
    }


    function getDatesBetween(date_start, date_end) {
      // Create an array to hold the dates
      const dates = [];
  
      // Set the current date to the start date
      let currentDate = date_start;
    
      // Loop until the current date is the same as the end date
      while (currentDate <= date_end) {
        // Add the current date to the array of dates
        dates.push(currentDate.toLocaleDateString('zh-Hans-CN'));
    
        // Advance the current date by one day
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }
    
      // Return the array of dates
      return dates;
    }

    function cmp(a, b) {
      return a[1].localeCompare(b[1]);
  }



    const filterDatabyDate = () => {
      let i = 0;
      while (i <= datedata.length) {
        if (arrayofdates.includes(datedata[i])){
          // console.log(i)
          filteredindices.push([i,datedata[i]])

        }
        i++
      };
      sortedindices = filteredindices.sort(cmp)
      for(var x=0, len=sortedindices.length; x < len; x++){
        indices.push(sortedindices[x][0])
        filtereddates.push(sortedindices[x][1])
        console.log(sortedindices)
    }
    getGraphDatabyIndex()
    }

    const getGraphDatabyIndex = () => {
      for(var x=0, len=indices.length; x < len; x++){
        filteredacwr.push(graphData[indices[x]])
    } 
    }

    // filterDatabyDate()

    const fetchAthleteChange = (item) => {
        resetDotData() //this function resets the dot datas
        resetOnChange() //this function resets the filter array
        filterDatabyDate()
        setAthleteName(item.name)
        setValue(item.value);
        setIsFocus(false);
        getLab(item.email)
        getDat(item.email)
        graphData = []
        graphLabels = []
        setIsLoading(true)
    }

    // const fetchACWR = (index) => {
    //     // setDateComments(comments)
    //     setACWR(graphData[index]);

    // }

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
          bezier
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
              return 'yellow'
          } else {
            return 'red'
          }
    }

  
    return (
        <SafeAreaView style={[styles.container, {flexDirection: "column"}]}>
          <ScrollView>
          <View style={styles.container}>
        
      </View>
            <View style={{flex: 2, justifyContent:'space-between'}}>
                {/* <Text style = {[styles.titleText]}>Athlete Data</Text> */}
           
                <Text style={[{fontWeight: "700", fontSize: 28, paddingHorizontal: 20, paddingTop: 30}]}>Athlete Data</Text>
                <View style={[{fontWeight: "700", fontSize: 28, paddingHorizontal: 20, paddingTop: 30, flex: 1, flex: 'row', }]}>
                <Text style={[{fontWeight: "600", fontSize: 18, paddingHorizontal: 10}]}>From</Text>
                <View>
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={startdate}
                              mode={"date"}
                              onChange={onStartChange}
                            />
                        </View>
                </View>

                <View style={[{fontWeight: "700", fontSize: 28, paddingHorizontal: 20, paddingTop: 30, flex: 1, flex: 'row', }]}>
                <Text style={[{fontWeight: "600", fontSize: 18, paddingHorizontal: 10}]}>To</Text>
                <View>
                <DateTimePicker
                              testID="dateTimePicker"
                              value={enddate}
                              mode={"date"}
                              onChange={onEndChange}
                            />
                        </View>
                </View>
           

               
                    <View style={[{flex:1, paddingTop: 16, paddingBottom: 8}]}>
                        {/* {renderLabel('Select athlete', isFocus)} */}


                        
                

                        <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue', paddingHorizontal: 20, }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={athletes}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="name"
                        placeholder={!isFocus ? 'Select Athlete' : 'Please select an athlete'}
                        searchPlaceholder="Search athlete..."
                        //value={emi}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          resetOnChange()
                            fetchAthleteChange(item)
                            // console.log(item.email)
                            // setValue(item.value);
                            // setIsFocus(false);
                            // getLab(item.email)
                            // getDat(item.email)
                        }}
                        renderLeftIcon={() => (
                            <MaterialIcons
                            style={styles.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="person"
                            size={20}
                            />
                        )}
                        />
                        <View style={{flex:1,}}>

                 
                        </View> 
                    </View>
                </View>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.subheadingText}>{clickedPerson}</Text>
                        {!isLoading && filteredacwr?.length > 0? (
                        <View>
                            <Text style={[styles.subheading, {textAlign: 'center'}]}>{athleteName}</Text>
                            <LineChart
                            onDataPointClick={({index}) => {
                                fetchDotData(index);
                              }}
                        data={{
                        datasets: [
                            {
                            data: filteredacwr
                          
                            }
                        ]
                        }}
                        verticalLabelRotation={-80}
                        width={Dimensions.get("window").width - 30} // from react-native
                        height={300}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                     
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 69, 196, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 39, 89, ${opacity})`,
                        style: {
                            borderRadius: 1,
                        },
                        propsForDots: {
                            r: "3",
                            strokeWidth: "6",
                            stroke: "#001f59"
                        }
                        }}
                        // bezier
                        style={{
                            borderRadius: 1
                        }}
                        />
                        {/* <TouchableOpacity
                            style={[{ opacity: 1 }, {backgroundColor: 'white', borderRadius: 8, height:35, flex:1, paddingTop: 4, borderWidth: 2, marginHorizontal: 20, marginBottom: 30}]}
                            onPress={() => {
                                //setModalVisible(!modalVisible)
                                // graphData = []
                                // graphLabels = []
                                // setIsLoading(true)
                            }
                            }
                        >
                            <Text style={styles.buttontext}>Close Athlete Graph</Text>
                        </TouchableOpacity> */}

                <Text style={styles.finetext}>Select data point to view more information.</Text>
<ScrollView style={styles.dateInfoBox}>
                    <View style={styles.infobox}>
                    <Text style={styles.datetext}>Date</Text><Text style={styles.datetext}>{date}</Text>
        
          </View>
          <View style={styles.infobox}>
            <Text style={styles.boxsubheading}>ACWR</Text>
            <Text style={[styles.boxText, {color: pickCol(Math.round(global.data.acwr[global.data.acwr.length - 1] * 100) / 100)}]}>
                                {acwr}
                            </Text>
          </View>
          <View style={styles.commentsbox}>
            <Text style={styles.boxsubheading}>Comments</Text>
            <Text>{ commentsDate }</Text>
          </View>
          <View style={styles.commentsbox}>
            <Text style={styles.boxsubheading}>Descriptions</Text>
            <Text>{ descriptionsDate }</Text>
          </View>
          </ScrollView>



                        </View>
    
                        ) : (
                            <>
                            <Text style={styles.subheadingText2}>No data to display.</Text>
                            {/* <ActivityIndicator size="large" animating={true} color = 'gray' style={{paddingBottom:10}}/> */}
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
            <ACWREntry />
        </SafeAreaView>
    );
}

async function openLink() {
  const querySnapshot = await getDoc(doc(db, "teams", thisUser.team));
  // console.log("Document data:", querySnapshot.data().workout);
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
    titleText: {
        padding: 10,
        paddingTop: 30,
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    subheadingText: {
        padding: 10,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    valuetext: {
        paddingVertical: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 10,
    },
    subheadingText2: {
        padding: 20,
        marginTop: 100,
        marginBottom: 50,
        fontSize: 16,
        fontWeight: "500",
        textAlign: 'center',
    },
    roundButton1: {
        //justifyContent: 'center',
        //alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    roundbuttontext1: {
        fontSize: 18,
        fontWeight: '700',
        marginVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    buttontext: {
        fontSize: 18,
        fontWeight: "600",
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
    datetext: {
        color: "black",
        textAlign: "center",
        fontWeight: '800',
        fontSize: 22,
        marginVertical:20,  
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
    commentsText: {
        fontSize: 18,
        // paddingLeft: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    dropdown: {
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    placeholder: {
        fontSize: 18,
        fontWeight: "600",
    },
    centersubheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingLeft: 10,
        paddingRight: 10,
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
        fontSize: 30,
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
  boxsubheading : {
    fontWeight: '700',
    fontSize: 18,
  },
  dateInfoBox: {
    marginHorizontal:20,
    padding: 10,
    flex:1,
  },
  infobox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 26,
    paddingVertical:17,
    borderBottomWidth: 0.5,
  },
  commentsbox: {
    justifyContent: 'space-between',
    marginHorizontal: 26,
    paddingVertical:17,
    // borderTopWidth: 0.5,
  },
  boxText:{
    color: 'black',
    fontWeight: '800',
    textAlign: "left",
    fontSize: 20,
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
      padding: 10,
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
    finetext: {
        fontSize: 10,
        marginHorizontal: 55,
        
    }
});



export default CoachHome;