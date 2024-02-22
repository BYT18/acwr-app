import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const InNav = (props) => {
  return (
    <View>
        <TouchableOpacity style={styles.navbutton} onPress = {props.onPress}>
        {/* <Image
        style={{
            width=50,
          }}
        source={props.image}
      /> */}
     
         <Text style={styles.buttontext}>{props.text}</Text>
     </TouchableOpacity>
    </View>
  )
}

export default InNav

const styles = StyleSheet.create({
    navbutton:{
        backgroundColor: '#000',
        justifyContent: 'center',
        //marginRight: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        height: 60,
        marginHorizontal: 10,
        marginVertical: 10,
      },
    buttontext: {
        color: "white",
        //textAlign: "left",
        fontWeight: "700",
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "600",
        fontSize: 18,
        textAlign: 'center',
    },
})