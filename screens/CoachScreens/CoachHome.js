import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Button, Text, View, SafeAreaView, Platform, TouchableOpacity, Pressable, FlatList, RefreshControl, Dimensions, ScrollView} from 'react-native';
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

var goals = []
var graphLabels = []
var graphData = []
const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75)

function CoachHome({navigation, route}) {
    console.log(athletes)
  const [carInd, setCarInd] = useState(0);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [clickedPerson, setClickedPerson] = React.useState('');
  
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
    global.data = global.data
  }, [isFocused]);

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
            <View style={{flex: 2, justifyContent:'space-between'}}>
                <Text style = {[styles.titleText]}>Athletes</Text>
                    <View style={[{flex:1, paddingTop: 16, paddingBottom: 8}]}>
                        {renderLabel('Select athlete', isFocus)}
                        <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={athletes}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="name"
                        placeholder={!isFocus ? 'Athlete' : '...'}
                        searchPlaceholder="Search..."
                        //value={displayName}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
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

                  {/*<Carousel
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
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={1}
                            />    */}
                        </View> 
                    </View>
                </View>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{clickedPerson}</Text>
                        <Text style={styles.modalText}>Projected</Text>
                        <Text style={styles.modalText}>Target</Text>
                       
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
                        
                        
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                //setModalVisible(!modalVisible)
                                graphData = []
                                graphLabels = []
                                //setIsLoading(true)
                            }
                            }
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

async function openLink() {
  const querySnapshot = await getDoc(doc(db, "teams", thisUser.team));
  console.log("Document data:", querySnapshot.data().workout);
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
});



export default CoachHome;