import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, EdgeInsetsPropType, TextInput, Button, KeyboardAvoidingView} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Paragraph } from 'react-native-paper';
import { color } from 'react-native-elements/dist/helpers';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc} from "firebase/firestore"; 
import { auth, db } from '../Firebase'
import { thisUser } from './CoachHomeNav';


//console.log({year: new Date().getFullYear(), day: new Date().getDate()}.year)
const nowDate = new Date(); 
const date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
//console.log(date)



//var today = moment();
//var day = today.clone().startOf('month');
const customDatesStyles = [
  {
    date:  new Date(),
    // Random colors
    //style: {backgroundColor: '#'+('#00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)},
    style: {backgroundColor: 'lightgrey'},
    textStyle: {color: 'black'}, // sets the font color
    containerStyle: [], // extra styling for day container
    allowDisabled: true, // allow custom style to apply to disabled dates
    info: 'cool'
  }
];


export default class CoachCalendar extends Component {
//function Calendar ({navigation}) {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      info: null,
      workout: 'Todays Workout...',
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.workoutChange = this.workoutChange.bind(this)
  }

  onDateChange(date) {
    const nowDate = new Date(date)
    this.setState({
      selectedStartDate: nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(),
      null: date.info
      //selectedStartDate: new Date(date).setHours(0,0,0,0),
      //selectedStartDate: {year: new Date(date).getFullYear(), day: new Date(date).getDate()}
    });
  }

  workoutChange(text) {
    this.setState({
      workout: text
      //selectedStartDate: new Date(date).setHours(0,0,0,0),
      //selectedStartDate: {year: new Date(date).getFullYear(), day: new Date(date).getDate()}
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

  async addWorkout(link) {
    //const newD = date.replaceAll('/', '.')
    //console.log('thedayandlin'+newD+link)
    //await setDoc(doc(db, "teams", thisUser.teamID, 'workouts', newD), {
    //  link: link
    //});
    setDoc(doc(db, "teams", thisUser.team), {
      workout: link
    })
  }

  render() {
    const { navigation } = this.props;
    const { selectedStartDate, info, workout } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    return (
      <KeyboardAvoidingView
            keyboardVerticalOffset = {10}
            behavior='position'
            //behavior={Platform.OS === "ios" ? "padding" : "height"}
            //style={styles.container}
            style={{flexDirection: "column", alignItems: 'center'}}
            >
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          todayBackgroundColor = 'lightgrey'
          todayTextStyle={{color: 'black'}}
          selectedDayColor="dimgray"
          selectedDayTextColor="white"
          
          //customDatesStyles={customDatesStyles}
        />
        <View style={styles.dateInfoBox}>
            <TouchableOpacity>
              <Text style={styles.datetext}> {this.displayDate(startDate)} </Text>
            </TouchableOpacity>
          <View style={{padding:15}}>
            <TextInput
              style={styles.workoutInput}
              onChangeText={this.workoutChange}
              value={workout}
              clearButtonMode={true}
            />
          </View>
          <Button title='Submit' onPress={() => this.addWorkout(workout)}/>
        </View>
      </View>
      </KeyboardAvoidingView>
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
  dateInfoBox: {
    //backgroundColor: 'black',
    margin:20,
    padding: 10,
    flex:1,
    //marginTop: 10,
  },
  dateInfoBox: {
    borderTopWidth: 1,
    margin:20,
    padding: 10,
    flex:1,
  },
  datetext: {
    color: "black",
    textAlign: "center",
    fontWeight: '800',
    fontSize: 22,
    marginVertical:20,  
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
  workoutInput:{
      padding: 20,
      marginBottom: 5,
      fontSize: 20,
      //fontFamily:'Helvetica',
      fontWeight: '200',
      height:75,
      borderRadius: 5,
      borderColor:'black', 
      borderBottomWidth: 1.5,
  }
});
