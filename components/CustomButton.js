import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({disabled, text, onPress}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      { disabled === false ? 
    <View style={styles.button}>
      <Text style={styles.buttontext}>{ text }</Text>
    </View> : null}
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: 'black',
        margin: 32,
        padding: 13,
    },
    buttontext: {
        color: "white",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    }
})