import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TextScreen = ({ navigation }) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(30);
    const [wordSpacing, setWordSpacing] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [bold, setBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fontModalVisible, setFontModalVisible] = useState(false);
    const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
    const [selectedFont, setSelectedFont] = useState('yahei.ttf');
    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
    const [hasBackground, setHasBackground] = useState(true);
    const [isMirroredHorizontally, setIsMirroredHorizontally] = useState(false);
    const [isMirroredVertically, setIsMirroredVertically] = useState(false);

    const rotationValues = [0, 90, 180, 270];
    const fontOptions = [
        { label: 'Yahei', value: 'yahei.ttf' },
        { label: 'Vector', value: 'vector.ttf' },
    ];

    const handleTextChange = (inputText) => setText(inputText);
    const toggleBold = () => setBold(!bold);
    const toggleItalic = () => setIsItalic(!isItalic);
    const handleRotationChange = (value) => {
        setRotation(value);
        setModalVisible(false);
    };
    const handleFontChange = (font) => {
        setSelectedFont(font);
        setFontModalVisible(false);
    };
    const handleFontSizeChange = (size) => {
        setFontSize(size);
        setFontSizeModalVisible(false);
    };
    const handleWordSpacingChange = (spacingValue) => setWordSpacing(spacingValue);
    const toggleToolbar = () => setIsToolbarCollapsed(!isToolbarCollapsed);
    const toggleBackground = () => setHasBackground(!hasBackground);
    const toggleMirrorHorizontal = () => setIsMirroredHorizontally(!isMirroredHorizontally);
    const toggleMirrorVertical = () => setIsMirroredVertically(!isMirroredVertically);

    const handleAddText = () => {
        if (!text.trim()) {
            alert('Please enter some text');
            return;
        }

        const textData = {
            text: text.trim(),
            fontSize,
            rotation,
            bold,
            isItalic,
            selectedFont,
            wordSpacing,
            hasBackground,
            isMirroredHorizontally,
            isMirroredVertically,
        };

        console.log('TextScreen: Sending text data to Home:', textData);
        navigation.navigate('Home', { newText: textData });
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add text</Text>
                <TouchableOpacity onPress={handleAddText}>
                    <AntDesign name="checkcircle" size={30} color={text === '' ? '#d4d4d4' : 'white'} />
                </TouchableOpacity>
            </View>
            <View style={[styles.textArea, { height: isToolbarCollapsed ? 600 : 350 }]}>
                <View style={styles.textContainer}>
                    <View
                        style={[
                            styles.textBackground,
                            {
                                backgroundColor: hasBackground ? '#FFF' : '#000',
                                transform: [
                                    { rotate: `${rotation}deg` },
                                    { scaleX: isMirroredHorizontally ? -1 : 1 },
                                    { scaleY: isMirroredVertically ? -1 : 1 },
                                ],
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                {
                                    fontSize,
                                    fontWeight: bold ? 'bold' : 'normal',
                                    fontStyle: isItalic ? 'italic' : 'normal',
                                    fontFamily: selectedFont,
                                    letterSpacing: wordSpacing,
                                    color: hasBackground ? '#000' : '#FFF',
                                },
                            ]}
                        >
                            {text || 'Sample Text'}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.sectionHeader} onPress={toggleToolbar}>
                    <Ionicons name="text" size={20} color="#007BFF" />
                    <Text style={styles.sectionTitle}>Text attributes</Text>
                    <Ionicons
                        name={isToolbarCollapsed ? 'chevron-down' : 'chevron-up'}
                        size={20}
                        color="#007BFF"
                    />
                </TouchableOpacity>
                {!isToolbarCollapsed && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={text}
                                onChangeText={handleTextChange}
                                placeholder="Please Press Input"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={styles.controlRow}>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setFontModalVisible(true)}
                            >
                                <Text style={styles.dropdownText}>{selectedFont}</Text>
                                <Ionicons name="chevron-down" size={20} color="#999" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.dropdownText}>Rotation: {rotation}°</Text>
                                <Ionicons name="chevron-down" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.control}>
                            <Text style={styles.controlLabel}>Font Size: {fontSize}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={5}
                                maximumValue={50}
                                step={1}
                                value={fontSize}
                                onValueChange={handleFontSizeChange}
                                minimumTrackTintColor="#007BFF"
                                maximumTrackTintColor="#D3D3D3"
                                thumbTintColor="#007BFF"
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={toggleBold}
                                style={[styles.styleButton, { backgroundColor: bold ? '#007BFF' : '#D3D3D3' }]}
                            >
                                <Text style={[styles.buttonText, { color: bold ? '#FFF' : '#000' }]}>B</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleItalic}
                                style={[styles.styleButton, { backgroundColor: isItalic ? '#007BFF' : '#D3D3D3' }]}
                            >
                                <Text style={[styles.buttonText, { fontStyle: 'italic', color: isItalic ? '#FFF' : '#000' }]}>I</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleBackground}
                                style={[styles.styleButton, { backgroundColor: hasBackground ? '#D3D3D3' : '#007BFF' }]}
                            >
                                <Foundation name="background-color" size={25} color={hasBackground ? '#000' : '#FFF'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleMirrorHorizontal}
                                style={[styles.styleButton, { backgroundColor: isMirroredHorizontally ? '#007BFF' : '#D3D3D3' }]}
                            >
                                <Octicons name="mirror" size={20} color={isMirroredHorizontally ? '#FFF' : '#000'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleMirrorVertical}
                                style={[styles.styleButton, { backgroundColor: isMirroredVertically ? '#007BFF' : '#D3D3D3' }]}
                            >
                                <Octicons name="mirror" size={20} color={isMirroredVertically ? '#FFF' : '#000'} style={{ transform: [{ rotate: '90deg' }] }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.control}>
                            <Text style={styles.controlLabel}>Word Spacing: {wordSpacing} mm</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={10}
                                step={1}
                                value={wordSpacing}
                                onValueChange={handleWordSpacingChange}
                                minimumTrackTintColor="#007BFF"
                                maximumTrackTintColor="#D3D3D3"
                                thumbTintColor="#007BFF"
                            />
                        </View>
                    </>
                )}
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={rotationValues}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => handleRotationChange(item)}>
                                    <Text style={styles.modalText}>{item}°</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={fontModalVisible} transparent={true} animationType="fade" onRequestClose={() => setFontModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={fontOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => handleFontChange(item.value)}>
                                    <Text style={styles.modalText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setFontModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#007BFF' },
    headerText: { fontSize: 20, color: 'white', fontWeight: 'bold' },
    textArea: { alignItems: 'center', justifyContent: 'center', marginVertical: 20, width: SCREEN_WIDTH },
    textContainer: { width: SCREEN_WIDTH * 0.8, height: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    textBackground: { padding: 10, borderRadius: 5 },
    text: { fontSize: 30, textAlign: 'center' },
    controlsContainer: { padding: 15, backgroundColor: '#F8FAFC' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E6F0FA', padding: 10, borderRadius: 5 },
    sectionTitle: { fontSize: 16, color: '#333' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    input: { flex: 1, height: 40, borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, paddingLeft: 10, fontSize: 16, backgroundColor: '#FFF' },
    controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
    control: { marginVertical: 10 },
    controlLabel: { fontSize: 16, color: '#333' },
    dropdownButton: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#D3D3D3', marginHorizontal: 5 },
    dropdownText: { fontSize: 16, color: '#333', marginRight: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    styleButton: { padding: 10, borderRadius: 5, width: 50, alignItems: 'center' },
    buttonText: { fontSize: 18 },
    slider: { width: '100%', marginTop: 10 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 },
    modalItem: { padding: 10, marginVertical: 5, backgroundColor: '#007BFF', borderRadius: 5 },
    modalText: { color: 'white', fontSize: 16, textAlign: 'center' },
    closeButton: { padding: 10, backgroundColor: '#FF5733', borderRadius: 5, marginTop: 20 },
    closeButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
});

export default TextScreen;