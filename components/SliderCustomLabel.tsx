import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const width = 50;

function LabelBase(props)
{
    const { position, value } = props;

    return (
        <View
            style={[
                styles.sliderLabel,
                {
                    left: position - width / 2,
                },
            ]}>
            <Text style={styles.sliderLabelText}>{value}</Text>
        </View>
    );
}

function LabelBaseTwo(props)
{
    const { position, value } = props;

    return (
        <View
            style={[
                styles.sliderLabelTwo,
                {
                    left: position - width / 2,
                },
            ]}>
            <Text style={styles.sliderLabelText}>{value}</Text>
        </View>
    );
}

export default function SliderCustomLabel(textTransformer: (value: number) => string)
{
    return function (props)
    {
        const {
            oneMarkerValue,
            twoMarkerValue,
            oneMarkerLeftPosition,
            twoMarkerLeftPosition,
        } = props;

        //oneMarkerLeftPosition.top = oneMarkerLeftPosition.top - 60

        console.log({props, oneMarkerLeftPosition, twoMarkerLeftPosition});

        return (
            <View>
                <LabelBase
                    position={oneMarkerLeftPosition}
                    value={textTransformer(oneMarkerValue)}
                />
                {twoMarkerValue ? 
                    <LabelBaseTwo
                        position={twoMarkerLeftPosition}
                        value={textTransformer(twoMarkerValue)}
                    /> : null
                }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    sliderLabel: {
        position: 'absolute',
        justifyContent: 'center',
        top: -30,
        //bottom: 5, 
        width: width + 10,
        height: width,
    },
    sliderLabelTwo: {
        position: 'absolute',
        justifyContent: 'center',
        top: 30,
        //bottom: 5, 
        width: width + 10,
        height: width,
    },
    sliderLabelText: {
        textAlign: 'center',
        lineHeight: width,
        flex: 1,
    },
});