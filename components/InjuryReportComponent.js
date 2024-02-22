import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InjuryReportComponent = (props) => {
  return (
    <View style={styles.background}>
      <Text style={styles.part}>{props.part}</Text>
      <Text style={styles.sev}>x{props.sev}</Text>
    </View>
  )
}

export default InjuryReportComponent

const styles = StyleSheet.create({
    background: {
        backgroundColor:'#e9e9e9',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        justifyContent: 'space-between',
    },
    part: {
        fontSize: 17,
        fontWeight: '700',
    },
    sev: {
        fontSize: 15,
        fontWeight: '800',
    }
})