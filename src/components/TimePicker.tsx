import {TimerPicker} from 'react-native-timer-picker';
import LinearGradient from 'react-native-linear-gradient';
import {useState} from 'react';
import {View} from 'react-native';
import React from 'react';
export const TimePicker = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState<string | null>(null);

  return (
    <View
      style={{
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TimerPicker
        padWithNItems={3}
        minuteLabel="min"
        secondLabel="sec"
        LinearGradient={LinearGradient}
        styles={{
          theme: 'light',
          pickerItem: {
            fontSize: 34,
          },
          pickerLabel: {
            fontSize: 26,
            right: -20,
          },
          pickerLabelContainer: {
            width: 60,
          },
          pickerItemContainer: {
            width: 150,
          },
        }}
      />
    </View>
  );
};
