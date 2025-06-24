import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import debounce from 'lodash/debounce';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BarCodeScreen = () => {
  const navigation = useNavigation();
  const [barcodeValue, setBarcodeValue] = useState('HELLO123');
  const [displayBarcodeValue, setDisplayBarcodeValue] = useState('HELLO123');
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const [barcodeWidth, setBarcodeWidth] = useState(50);
  const [barcodeHeight, setBarcodeHeight] = useState(10);
  const [isFormatModalVisible, setFormatModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  const [isToolsVisible, setIsToolsVisible] = useState(true);

  const formatOptions = [
    { label: 'CODE39', value: 'CODE39' },
    { label: 'CODE128', value: 'CODE128' },
    { label: 'EAN8', value: 'EAN8' },
    { label: 'EAN13', value: 'EAN13' },
    { label: 'UPCA', value: 'UPCA' },
    { label: 'ITF (2of5)', value: 'ITF' },
  ];

  // Sanitize input based on the selected format
  const sanitizeInput = (value) => {
    let sanitizedValue = typeof value === 'string' ? value : '';
    switch (barcodeFormat) {
      case 'CODE39':
        sanitizedValue = sanitizedValue.toUpperCase().replace(/[^A-Z0-9\-.\s$\/+%*]/g, '');
        break;
      case 'CODE128':
        sanitizedValue = sanitizedValue.replace(/[^\x20-\x7E]/g, '');
        break;
      case 'EAN8':
      case 'EAN13':
      case 'UPCA':
      case 'ITF':
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '');
        break;
      default:
        sanitizedValue = sanitizedValue;
    }
    return sanitizedValue;
  };

  // Validate barcode input based on the selected format
  const validateBarcodeInput = (value) => {
    if (!value.trim()) {
      setErrorMessage('Barcode is empty!');
      setIsValidInput(false);
      return false;
    }

    let isValid = false;
    switch (barcodeFormat) {
      case 'CODE39':
        if (!/^[A-Z0-9\-.\s$\/+%*]+$/.test(value)) {
          setErrorMessage('CODE39 supports A-Z, 0-9, and symbols: - . $ / + % *');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      case 'CODE128':
        if (!/^[\x20-\x7E]+$/.test(value)) {
          setErrorMessage('CODE128 supports printable ASCII characters (space to ~)');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      case 'EAN8':
        if (!/^\d{8}$/.test(value)) {
          setErrorMessage('EAN8 requires exactly 8 digits');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      case 'EAN13':
        if (!/^\d{13}$/.test(value)) {
          setErrorMessage('EAN13 requires exactly 13 digits');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      case 'UPCA':
        if (!/^\d{12}$/.test(value)) {
          setErrorMessage('UPCA requires exactly 12 digits');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      case 'ITF':
        if (!/^\d+$/.test(value) || value.length % 2 !== 0) {
          setErrorMessage('ITF requires an even number of digits');
        } else {
          setErrorMessage('');
          isValid = true;
        }
        break;
      default:
        setErrorMessage('Unknown barcode format');
        isValid = false;
    }

    setIsValidInput(isValid);
    return isValid;
  };

  // Debounced validation to prevent rapid updates
  const debouncedValidate = useCallback(
    debounce((value) => {
      const sanitizedValue = sanitizeInput(value);
      setDisplayBarcodeValue(sanitizedValue);
      validateBarcodeInput(sanitizedValue);
    }, 300),
    [barcodeFormat]
  );

  const handleAddBarcode = () => {
    if (!validateBarcodeInput(barcodeValue)) {
      return;
    }
    navigation.navigate('Home', {
      newBarcode: {
        type: 'barcode',
        content: barcodeValue,
        format: barcodeFormat,
        width: barcodeWidth * 2,
        height: barcodeHeight * 5, 
      },
    });
  };

  const handleFormatChange = (format) => {
    setBarcodeFormat(format);
    setFormatModalVisible(false);
    const sanitizedValue = sanitizeInput(barcodeValue);
    setBarcodeValue(sanitizedValue);
    setDisplayBarcodeValue(sanitizedValue);
    validateBarcodeInput(sanitizedValue);
  };

  const handleInputChange = (text) => {
    setBarcodeValue(text);
    debouncedValidate(text);
  };

  const toggleToolsVisibility = () => {
    setIsToolsVisible((prev) => !prev);
  };

  // Calculate barcode size for preview with refined scaling
  const barcodePreviewWidth = !isNaN(barcodeWidth)
    ? Math.min(SCREEN_WIDTH * 0.8, barcodeWidth * 1.5) // Refined scaling factor
    : SCREEN_WIDTH * 0.8;
  const barcodePreviewHeight = !isNaN(barcodeHeight)
    ? Math.min(SCREEN_WIDTH * 0.2, barcodeHeight * 3) // Refined scaling factor
    : SCREEN_WIDTH * 0.2;

  // Ensure width and height are valid numbers
  const width = !isNaN(barcodePreviewWidth) ? barcodePreviewWidth : 200;
  const height = !isNaN(barcodePreviewHeight) ? barcodePreviewHeight : 50;

  // Debug log to check values
  useEffect(() => {
    console.log('barcodeWidth:', barcodeWidth);
    console.log('barcodeHeight:', barcodeHeight);
    console.log('barcodePreviewWidth:', barcodePreviewWidth);
    console.log('barcodePreviewHeight:', barcodePreviewHeight);
    console.log('width:', width);
    console.log('height:', height);
    console.log('barcodeValue:', barcodeValue);
    console.log('displayBarcodeValue:', displayBarcodeValue);
    console.log('barcodeFormat:', barcodeFormat);
    console.log('isValidInput:', isValidInput);
    console.log('errorMessage:', errorMessage);
    console.log('isToolsVisible:', isToolsVisible);
  }, [barcodeWidth, barcodeHeight, barcodePreviewWidth, barcodePreviewHeight, width, height, barcodeValue, displayBarcodeValue, barcodeFormat, isValidInput, errorMessage, isToolsVisible]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Barcode</Text>
        <TouchableOpacity onPress={handleAddBarcode}>
          <AntDesign
            name="checkcircle"
            size={30}
            color={barcodeValue.trim() === '' || !isValidInput ? '#d4d4d4' : 'white'}
          />
        </TouchableOpacity>
      </View>

      {/* Barcode Preview */}
      <View style={[styles.barcodeContainer, { flex: isToolsVisible ? 1 : 2 }]}>
        {barcodeValue.trim() === '' || !isValidInput ? (
          <Text style={styles.emptyText}>{errorMessage || 'Barcode is empty!'}</Text>
        ) : (
          <View>
            {(() => {
              try {
                return (
                  <Barcode
                    value={displayBarcodeValue || ''}
                    format={barcodeFormat}
                    width={width}
                    maxWidth={SCREEN_WIDTH * 0.8}
                    height={height}
                    text={displayBarcodeValue || ''}
                    textStyle={styles.barcodeText}
                    style={styles.barcode}
                    lineColor="#000000"
                    background="#FFFFFF"
                  />
                );
              } catch (error) {
                console.error('Error rendering barcode:', error);
                return <Text style={styles.emptyText}>Error rendering barcode</Text>;
              }
            })()}
          </View>
        )}
      </View>

      {/* Input and Size Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={toggleToolsVisibility}>
          <Ionicons name="barcode-outline" size={24} color="#007BFF" />
          <Text style={styles.addButtonText}>Add Barcode</Text>
          <Ionicons
            name={isToolsVisible ? 'chevron-down' : 'chevron-up'}
            size={24}
            color="#007BFF"
          />
        </TouchableOpacity>

        {isToolsVisible && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Input Text"
              placeholderTextColor={'#000'}
              value={barcodeValue}
              onChangeText={handleInputChange}
            />

            {/* Barcode Format Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Encode</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setFormatModalVisible(true)}
              >
                <Text style={styles.dropdownText}>{barcodeFormat}</Text>
                <Ionicons name="chevron-down" size={20} color="#007BFF" />
              </TouchableOpacity>
            </View>

            {/* Width Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Width</Text>
              <Slider
                style={styles.slider}
                minimumValue={20} // Increased minimum to ensure barcode renders properly
                maximumValue={100}
                step={0.1}
                value={barcodeWidth}
                onValueChange={(value) => setBarcodeWidth(Number(value))}
                minimumTrackTintColor="#007BFF"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#007BFF"
              />
              <Text style={styles.sliderValue}>{barcodeWidth.toFixed(1)}mm</Text>
            </View>

            {/* Height Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Height</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={50}
                step={0.1}
                value={barcodeHeight}
                onValueChange={(value) => setBarcodeHeight(Number(value))}
                minimumTrackTintColor="#007BFF"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#007BFF"
              />
              <Text style={styles.sliderValue}>{barcodeHeight.toFixed(1)}mm</Text>
            </View>
          </>
        )}
      </View>

      {/* Format Selection Modal */}
      <Modal
        visible={isFormatModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFormatModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={formatOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleFormatChange(item.value)}
                >
                  <Text style={styles.modalText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFormatModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  barcodeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barcode: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  barcodeText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
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
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    color: 'black',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    width: 150,
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  modalText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BarCodeScreen;