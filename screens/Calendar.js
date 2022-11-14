import React, { Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Button, ScrollView, FlatList} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'
import {db} from "./Firebase";
import {collection, addDoc, query, where, getDoc, deleteDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { thisUser } from './homeNav';

//console.log({year: new Date().getFullYear(), day: new Date().getDate()}.year)
const nowDate = new Date(); 
const date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
//const isFocused = useIsFocused()
//console.log(date)

const pickCol = (s) =>{
  if (0.9 <= s && s <= 1.3) {
      return 'limegreen'
    } else if (1.3 < s && s <= 1.5) {
        return 'gold'
    } else {
      return 'red'
    }
}

let customDatesStyles = [];
let DATA = []

/*while(day.add(1, 'day').isSame(today, 'month')) {
  customDatesStyles.push({
    date: day.clone(),
    // Random colors
    style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
    textStyle: {color: 'black'}, // sets the font color
    containerStyle: [], // extra styling for day container
    allowDisabled: true, // allow custom style to apply to disabled dates
  });
}*/

export default class Calendar extends Component {
//function Calendar ({navigation}) {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      info: null,
      modalVisible: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
    if (global.data.date.length == 0){
      customDatesStyles = []
    }
    for (let i = 0; i < global.data.date.length; i++) {
      customDatesStyles.push({
        date: new Date(global.data.date[i]),
        // Random colors
        style: {backgroundColor: pickCol(global.data.acwr[i])},
        textStyle: {color: 'white'}, // sets the font color
        containerStyle: [], // extra styling for day container
        allowDisabled: true, // allow custom style to apply to disabled dates
      });
    }  
  }

  async getInj(date){
    const docSnap = await getDoc(doc(db, "users", thisUser.email, 'injury', date.toString()))
    console.log(docSnap.data().data)
    DATA = docSnap.data().data
  }
  

  onDateChange(date) {
    const nowDate = new Date(date)
    this.setState({
      //selectedStartDate: new Date(date).toDateString(),
      selectedStartDate: nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(),
      null: date.info,
      //selectedStartDate: {year: new Date(date).getFullYear(), day: new Date(date).getDate()}
    });
    if (global.data.date.length == 0){
      customDatesStyles = []
    }
    for (let i = 0; i < global.data.date.length; i++) {
      customDatesStyles.push({
        date: new Date(global.data.date[i]),
        // Random colors
        style: {backgroundColor: pickCol(global.data.acwr[i])},
        textStyle: {color: 'white'}, // sets the font color
        containerStyle: [], // extra styling for day container
        allowDisabled: true, // allow custom style to apply to disabled dates
      });
    }

    nowDate.setHours(0, 0, 0, 0)
    console.log(nowDate+'trolldate')
    this.getInj(nowDate)
  }


  setModalVisible(bool){
    this.setState({
      modalVisible: bool
    });
  }
  
  isInThePast(date) {
    const today = new Date();
  
    // 👇️ OPTIONAL!
    // This line sets the hour of the current date to midnight
    // so the comparison only returns `true` if the passed in date
    // is at least yesterday
    //today.setHours(0, 0, 0, 0);
    
    //console.log(date)
    //console.log(today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate())
    //console.log(new Date(date) < new Date(test))
    const test = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()
    return new Date(date) <= new Date(test);
  }

  displayDate(date){
    console.log(date)
    if (date == ''){
      return ''
    }
    const dateStr = new Date(date).toDateString(); // 'Fri Apr 10 2020'
    const dateStrArr = dateStr.split(' '); // ['Fri', 'Apr', '10', '2020']
    const year = [dateStrArr[3]]
    year.unshift(',')
    //dateStrArr.splice(1,2).push[', ']
    //const str = dateStrArr.splice.join(' ')
    return dateStrArr.splice(1,2).join(' ') + year.join(' ')
  }
  

  render() {
    const { navigation } = this.props;
    const { selectedStartDate, info, modalVisible} = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    const Item = ({ title }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
    const EditButton = ({showButton}) => (
      /*<View style={styles.editButton}>
        {showButton && 
          <TouchableOpacity onPress={() => 
            navigation.navigate('Report', {date: startDate})
          }>
              <MaterialIcons name='edit' size={35} color="white">
              </MaterialIcons>
          </TouchableOpacity>
        }
      </View>*/
      <View style = {{flex:1}}>
        {showButton && 
          <TouchableOpacity style = {styles.button} onPress = {() => navigation.navigate('Report', {date: startDate})}>
          <Text style = {styles.buttontext}>
            Edit  <Feather name="edit-2" size={16} color="black" />
          </Text>
        </TouchableOpacity>
        }
      </View>
    )
    const displayButton = false

    const renderItem = ({ item }) => (
      <Item title={item.part} />
    );

    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          todayBackgroundColor = 'black'
          todayTextStyle={{color: 'white'}}
          selectedDayColor="lightgray"
          selectedDayTextColor="black"
          customDatesStyles={customDatesStyles}
          //scrollable={true}
        />
        <View style={styles.dateInfoBox}>
            <TouchableOpacity onPress = {() => this.setModalVisible(!modalVisible)}>
              <Text style={styles.datetext}>{ this.displayDate(startDate) }</Text>
            </TouchableOpacity>
          <View style={styles.infobox}>
            <Text style={styles.boxsubheading}>Time:</Text>
            <Text style={styles.boxText}>{ global.data.time[global.data.date.indexOf(startDate)] }</Text>
          </View>
          <View style={styles.infobox}>
            <Text style={styles.boxsubheading}>Perceived Load:</Text>
            <Text style={styles.boxText}>{ global.data.percieved[global.data.date.indexOf(startDate)]}</Text>
          </View>
          <View style={styles.infobox}>
            <Text style={styles.boxsubheading}>ACWR:</Text>
            <Text style={styles.boxText}>{ Math.round(global.data.acwr[global.data.date.indexOf(startDate)]* 100) / 100 }</Text>
          </View>
          <EditButton showButton={this.isInThePast(startDate)} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
          this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
              <View style={[styles.modalView]}>
                <Text style={styles.modalTitle}>Qualitative Day Statistics</Text>
              <Text style={styles.modalheading}>Description</Text>
                  <Text style={{paddingBottom:10, fontSize: 15, fontWeight:'300'}}>
                    {global.data.desc[global.data.date.indexOf(startDate)]}
                    </Text>
                    <Text style={styles.modalheading}>Comments</Text>
                  <Text style={{paddingBottom:10, fontSize: 15, fontWeight:'300'}}>
                    {global.data.com[global.data.date.indexOf(startDate)]}
                    </Text>
                    <Text style={styles.modalheading}>Goals</Text>
                  <Text style={{paddingBottom:10, fontSize: 15, fontWeight:'300'}}>
                    {global.data.goals[global.data.date.indexOf(startDate)]}
                    </Text>
                  <View style={{height:50}}>
                  <Text style={styles.modalheading}>Injury Watch</Text>
                  <View style={styles.flatliststyle}>
                    <FlatList
                          data={DATA}
                          renderItem={renderItem}
                          keyExtractor={item => item.part}
                      />
                      </View>
                </View>
                <View style={styles.buttoncontainer}>
                  <Button
                      style={[styles.buttonClose]}
                      onPress={() => {this.setModalVisible(!modalVisible), DATA = []}}
                      color = 'red'
                      title = 'Close'
                  />
                </View>
              </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection:'column'
    //marginTop: 10,
  },
  modalView: {
    margin: 5,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    padding: 20,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    flex: 1,
    marginTop: 120,
  },
  buttoncontainer: {
    marginTop: 35,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '800',
    paddingBottom: 10,
  },
  modalheading: {
    fontWeight: '700',
    paddingVertical: 5,
  },
  flatliststyle: {
    height: 100,
  },
  dateInfo: {
    backgroundColor: 'black',
    margin:20,
    padding: 10,
    flex:1,
    //marginTop: 10,
    flexDirection:'column',
  },
  datetext: {
    color: "black",
    textAlign: "center",
    fontWeight: '800',
    fontSize: 22,
    marginVertical:20,  
  },
  boxsubheading : {
    fontWeight: '700',
    fontSize: 18,
  },
  dateInfoBox: {
    borderTopWidth: 1,
    margin:20,
    padding: 10,
    flex:1,
  },
  editButton:{
    flex:1,
    //backgroundColor: 'white',
    //flexDirection:'column',
    justifyContent: 'flex-end',
    alignSelf:'flex-end'
  },
  boxText:{
    color: 'white',
    margin: 3,
    fontSize: 15
  },
  infobox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 26,
    paddingVertical:17,
    borderTopWidth: 0.5,
  },
  boxText:{
    color: 'black',
    fontWeight: '800',
    textAlign: "left",
    fontSize: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    padding: 13,
    marginHorizontal: 25,
},
buttontext: {
    color: "black",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
}
});

//export default Calendar