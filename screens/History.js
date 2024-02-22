//Spelled perceived wrong as percieved 

import React, { useLayoutEffect, useState, useRef, Component} from 'react';
import { StyleSheet, Pressable, Text, View, ScrollView, RefreshControl, TouchableOpacity, FlatList, VirtualizedList} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
//import { getAuth, signOut } from "firebase/auth";
//import { auth } from './Firebase';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Item = ({ date, acwr, time, percieved }) => (
    <View style={styles.item}>
      <Text style={styles.title}> Date: {date}</Text>
      <Text style={styles.title}> Time: {time}</Text>
      <Text style={styles.title}> Percieved: {percieved}</Text>
      <Text style={styles.title}> ACWR: {acwr}</Text>
    </View>
  );
  

const History = ({navigation}) => {
    //const test = data.daily[0]
    console.log('value',global.data)


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);
  
    const renderItem = ({ item }) => (
        <Item 
            date={item}
            acwr = {global.data.acwr[global.data.date.indexOf(item)]} 
            time = {global.data.time[global.data.date.indexOf(item)]} 
            percieved = {global.data.percieved[global.data.date.indexOf(item)]} 
        />
    );
    

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }
        >
            <FlatList
        data={global.data.date}
        //data={[{ acwr: 'Title Text', key: 'item1' }]}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
            {/*<Text style={styles.baseText}>
            Time
            {global.data.acute.map((item, key)=>(
                <Text key={key}> { item } </Text>)
            )}
            </Text>
            <Text style={styles.baseText}>
            Percieved
            {global.data.percieved.map((item, key)=>(
                <Text key={key}> { item } </Text>)
            )}
            </Text>
            <Text style={styles.baseText}>
            ACWR
            {global.data.acwr.map((item, key)=>(
                <Text key={key}> { item } </Text>)
            )}
            </Text>*/}
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      baseText: {
        fontFamily: "Cochin"
      },
      titleText: {
        fontSize: 20,
        fontWeight: "bold"
      },
      item: {
        backgroundColor: 'hotpink',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 15,
      },
    });    

export default History;