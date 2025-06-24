import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QRScreen = () => {
  const navigation = useNavigation();
  const [qrValue, setQrValue] = useState(''); // State for QR code value
  const [qrSize, setQrSize] = useState(8); // State for QR code size in mm (default to 8mm)
  const [isControlsVisible, setIsControlsVisible] = useState(true); // State for controls visibility

  // Function to toggle the controls visibility
  const toggleControls = () => {
    setIsControlsVisible(prev => !prev);
  };

  // Function to handle adding QR code to the canvas
  const handleAddQRCode = () => {
    if (qrValue.trim() === '') {
      return; // Prevent adding empty QR code
    }
    navigation.navigate('Home', {
      newQRCode: {
        type: 'qrcode',
        content: qrValue,
        width: qrSize * 10, 
        height: qrSize * 10,
      },
    });
  };

  // Calculate QR code size for preview (convert mm to pixels for display)
  const qrPreviewSize = Math.min(SCREEN_WIDTH * 0.5, qrSize * 10); // Adjust multiplier as needed

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add QR Code</Text>
        <TouchableOpacity onPress={handleAddQRCode}>
          <AntDesign
            name="checkcircle"
            size={30}
            color={qrValue.trim() === '' ? '#d4d4d4' : 'white'}
          />
        </TouchableOpacity>
      </View>

      {/* QR Code Preview */}
      <View style={styles.qrContainer}>
        {qrValue.trim() === '' ? (
          <Text style={styles.emptyText}>QR code is empty!</Text>
        ) : (
          <QRCode
            value={qrValue}
            size={qrPreviewSize} // Dynamically adjust size based on slider
            color="black"
            backgroundColor="white"
          />
        )}
      </View>

      {/* Input and Size Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={toggleControls}>
          <Ionicons name="qr-code-outline" size={24} color="#007BFF" />
          <Text style={styles.addButtonText}>Add QR Code</Text>
          <Ionicons
            name={isControlsVisible ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#007BFF"
          />
        </TouchableOpacity>

        {isControlsVisible && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Input Text"
              placeholderTextColor={'#000'}
              value={qrValue}
              onChangeText={setQrValue}
            />

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Size</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={0.1}
                value={qrSize}
                onValueChange={setQrSize}
                minimumTrackTintColor="#007BFF"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#007BFF"
              />
              <Text style={styles.sliderValue}>{qrSize.toFixed(1)}mm</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: '#F8FAFC',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6F0FA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 15,
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40
  },
  sliderLabel: {
    fontSize: 16,
    color: 'black',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderValue: {
    fontSize: 16,
    color: 'black',
  },
});

export default QRScreen;