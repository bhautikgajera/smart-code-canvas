import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Dimensions, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Svg, { G, Text as SvgText, Line, Rect } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Constants for canvas dimensions
const CANVAS_HEIGHT = 150;
const DIVISION_WIDTH = 10;
const CANVAS_WIDTH = 300 * DIVISION_WIDTH;

const HomeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [elements, setElements] = useState([]);
    const NORMALIZED_SCALE_FACTOR = 1;
    const [canvasScale, setCanvasScale] = useState(1 / NORMALIZED_SCALE_FACTOR);
    const [baseScale, setBaseScale] = useState(1 / NORMALIZED_SCALE_FACTOR);
    const [selectedElement, setSelectedElement] = useState(null);
    const [showRulers, setShowRulers] = useState(true);
    const panResponderRef = React.useRef({ dx: 0, dy: 0 });

    const [headerHeight, setHeaderHeight] = useState(0);
    const [toolbarHeight, setToolbarHeight] = useState(0);
    const start_y = headerHeight + toolbarHeight;
    const canvasAreaHeight = (CANVAS_HEIGHT + 20) * canvasScale;

    // Debug logs for layout measurements
    useEffect(() => {
        console.log('Header Height:', headerHeight);
        console.log('Toolbar Height:', toolbarHeight);
        console.log('Start Y:', start_y);
        console.log('Canvas Area Height:', canvasAreaHeight);
    }, [headerHeight, toolbarHeight, start_y, canvasAreaHeight]);

    // Handle new elements (text or QR code) from other screens
    useEffect(() => {
        if (route.params?.newText) {
            console.log('Received new text:', route.params.newText);
            const padding = 15;
            const fontSize = route.params.newText.fontSize || 16;
            const textContent = route.params.newText.text || 'Sample Text';
            const textWidth = (textContent.length * (fontSize / 2)) + (route.params.newText.wordSpacing || 0) * (textContent.length - 1);

            const newText = {
                type: 'text',
                content: textContent,
                x: 150,
                y: padding + fontSize,
                fontSize: fontSize,
                rotation: route.params.newText.rotation || 0,
                bold: route.params.newText.bold || false,
                italic: route.params.newText.isItalic || false,
                fontFamily: route.params.newText.selectedFont || 'default',
                letterSpacing: route.params.newText.wordSpacing || 0,
                backgroundColor: route.params.newText.hasBackground ? '#FFF' : '#000',
                textColor: route.params.newText.hasBackground ? '#000' : '#FFF',
                isMirroredHorizontally: route.params.newText.isMirroredHorizontally || false,
                isMirroredVertically: route.params.newText.isMirroredVertically || false,
            };

            // Ensure text stays within canvas bounds
            const effectiveWidth = textWidth + padding * 2;
            newText.x = Math.max(padding, Math.min(newText.x, CANVAS_WIDTH - effectiveWidth));
            newText.y = Math.max(padding + fontSize, Math.min(newText.y, CANVAS_HEIGHT - fontSize));

            setElements(prevElements => {
                const updatedElements = [...prevElements, newText];
                console.log('Updated elements:', updatedElements);
                return updatedElements;
            });
            navigation.setParams({ newText: null });
        } else if (route.params?.newQRCode) {
            console.log('Received new QR code:', route.params.newQRCode);
            const padding = 15;
            const newQRCode = {
                type: 'qrcode',
                content: route.params.newQRCode.content,
                x: 150, // Default position
                y: 75,  // Default position
                width: route.params.newQRCode.width,
                height: route.params.newQRCode.height,
                rotation: 0, // Default rotation (can be made configurable later)
                isMirroredHorizontally: false, // Default (can be made configurable later)
                isMirroredVertically: false,   // Default (can be made configurable later)
            };

            // Ensure QR code stays within canvas bounds
            newQRCode.x = Math.max(padding, Math.min(newQRCode.x, CANVAS_WIDTH - newQRCode.width));
            newQRCode.y = Math.max(padding, Math.min(newQRCode.y, CANVAS_HEIGHT - newQRCode.height));

            setElements(prevElements => {
                const updatedElements = [...prevElements, newQRCode];
                console.log('Updated elements:', updatedElements);
                return updatedElements;
            });
            navigation.setParams({ newQRCode: null });
        }
    }, [route.params?.newText, route.params?.newQRCode]);

    const generateRulerTicks = (orientation, scale, start_y) => {
        const ticks = [];
        const tickSpacing = 10;
        const longTickSpacing = 50;
        const length = orientation === 'x' ? CANVAS_WIDTH : 1000;
        const rulerWidth = 20;

        for (let i = 0; i <= length; i += tickSpacing) {
            const isLongTick = i % longTickSpacing === 0;
            const tickSize = isLongTick ? 15 : 7;
            let pos;

            if (orientation === 'x') {
                pos = i * scale;
                ticks.push(
                    <Line
                        key={i}
                        x1={pos}
                        y1={rulerWidth}
                        x2={pos}
                        y2={rulerWidth - tickSize}
                        stroke="black"
                        strokeWidth={1}
                    />
                );
            } else {
                pos = start_y + (i * scale);
                ticks.push(
                    <Line
                        key={i}
                        x1={rulerWidth}
                        y1={pos}
                        x2={rulerWidth - tickSize}
                        y2={pos}
                        stroke="black"
                        strokeWidth={1}
                    />
                );
            }
        }
        return ticks;
    };

    const renderElement = (element, index) => {
        const padding = 10;
        const borderRadius = 5;
        const scaledPadding = padding * canvasScale;
        const style = {
            position: 'absolute',
            left: element.x * canvasScale,
            top: element.y * canvasScale, // Adjusted to use y directly
            width: element.width * canvasScale,
            height: element.height * canvasScale,
            padding: scaledPadding,
            transform: [
                { rotate: `${element.rotation || 0}deg` },
                { scaleX: element.isMirroredHorizontally ? -1 : 1 },
                { scaleY: element.isMirroredVertically ? -1 : 1 },
            ],
        };

        switch (element.type) {
            case 'text':
                return (
                    <View key={index} style={style}>
                        {element.backgroundColor && (
                            <View
                                style={[
                                    StyleSheet.absoluteFill,
                                    {
                                        backgroundColor: element.backgroundColor,
                                        borderRadius: borderRadius * canvasScale,
                                    },
                                ]}
                            />
                        )}
                        <Text
                            style={{
                                fontSize: element.fontSize * canvasScale,
                                fontWeight: element.bold ? 'bold' : 'normal',
                                fontStyle: element.italic ? 'italic' : 'normal',
                                letterSpacing: element.letterSpacing * canvasScale,
                                fontFamily: element.fontFamily,
                                color: element.textColor,
                            }}
                        >
                            {element.content}
                        </Text>
                    </View>
                );
            case 'barcode':
                return (
                    <View key={index} style={style}>
                        <Barcode
                            value={element.content}
                            format="CODE128"
                            width={element.width * canvasScale}
                            height={element.height * canvasScale}
                        />
                    </View>
                );
            case 'qrcode':
                return (
                    <View key={index} style={style}>
                        <QRCode
                            value={element.content}
                            size={Math.min(element.width * canvasScale, element.height * canvasScale)} // Use the smaller dimension to keep it square
                            color="black"
                            backgroundColor="white"
                        />
                    </View>
                );
            case 'image':
                return (
                    <View key={index} style={style}>
                        <Image
                            source={{ uri: element.uri }}
                            style={{ width: element.width * canvasScale, height: element.height * canvasScale }}
                            resizeMode="contain"
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;
            const adjustedX = locationX / canvasScale;
            const adjustedY = locationY / canvasScale;

            const touchedElement = elements.find((element) => {
                if (element.type === 'text') {
                    const textWidth = (element.content.length * (element.fontSize / 2)) + (element.letterSpacing * (element.content.length - 1));
                    const textHeight = element.fontSize;
                    const padding = 5;

                    let boundingBox = {
                        x: element.x,
                        y: element.y - textHeight - padding,
                        width: textWidth + padding * 2,
                        height: textHeight + padding * 2,
                    };

                    if (element.rotation === 90 || element.rotation === 270) {
                        boundingBox = {
                            x: element.x - (textHeight + padding * 2) / 2,
                            y: element.y - (textWidth + padding * 2) / 2,
                            width: textHeight + padding * 2,
                            height: textWidth + padding * 2,
                        };
                    }

                    if (element.isMirroredHorizontally) {
                        boundingBox.x = element.x - boundingBox.width;
                    }
                    if (element.isMirroredVertically) {
                        boundingBox.y = element.y - boundingBox.height;
                    }

                    return (
                        adjustedX >= boundingBox.x &&
                        adjustedX <= boundingBox.x + boundingBox.width &&
                        adjustedY >= boundingBox.y &&
                        adjustedY <= boundingBox.y + boundingBox.height
                    );
                } else if (element.type === 'qrcode') {
                    const padding = 5;
                    let boundingBox = {
                        x: element.x,
                        y: element.y,
                        width: element.width + padding * 2,
                        height: element.height + padding * 2,
                    };

                    if (element.rotation === 90 || element.rotation === 270) {
                        boundingBox = {
                            x: element.x - (element.height + padding * 2) / 2,
                            y: element.y - (element.width + padding * 2) / 2,
                            width: element.height + padding * 2,
                            height: element.width + padding * 2,
                        };
                    }

                    if (element.isMirroredHorizontally) {
                        boundingBox.x = element.x - boundingBox.width;
                    }
                    if (element.isMirroredVertically) {
                        boundingBox.y = element.y - boundingBox.height;
                    }

                    return (
                        adjustedX >= boundingBox.x &&
                        adjustedX <= boundingBox.x + boundingBox.width &&
                        adjustedY >= boundingBox.y &&
                        adjustedY <= boundingBox.y + boundingBox.height
                    );
                }
                return false;
            });

            if (touchedElement) {
                setSelectedElement(touchedElement);
                panResponderRef.current = { dx: 0, dy: 0 };
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            if (selectedElement) {
                const updatedElements = elements.map((element) => {
                    if (element === selectedElement) {
                        const deltaX = (gestureState.dx - panResponderRef.current.dx) / canvasScale;
                        const deltaY = (gestureState.dy - panResponderRef.current.dy) / canvasScale;

                        let newX = element.x + deltaX;
                        let newY = element.y + deltaY;

                        let effectiveWidth, effectiveHeight;
                        if (element.type === 'text') {
                            const textWidth = (element.content.length * (element.fontSize / 2)) + (element.letterSpacing * (element.content.length - 1));
                            const textHeight = element.fontSize;
                            const padding = 5;
                            effectiveWidth = textWidth + padding * 2;
                            effectiveHeight = textHeight + padding * 2;

                            if (element.rotation === 90 || element.rotation === 270) {
                                effectiveWidth = textHeight + padding * 2;
                                effectiveHeight = textWidth + padding * 2;
                            }
                        } else if (element.type === 'qrcode') {
                            const padding = 5;
                            effectiveWidth = element.width + padding * 2;
                            effectiveHeight = element.height + padding * 2;

                            if (element.rotation === 90 || element.rotation === 270) {
                                effectiveWidth = element.height + padding * 2;
                                effectiveHeight = element.width + padding * 2;
                            }
                        }

                        newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - effectiveWidth));
                        newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - effectiveHeight));

                        return { ...element, x: newX, y: newY };
                    }
                    return element;
                });
                setElements(updatedElements);
                panResponderRef.current = { dx: gestureState.dx, dy: gestureState.dy };
            }
        },
        onPanResponderRelease: () => {
            setSelectedElement(null);
            panResponderRef.current = { dx: 0, dy: 0 };
        },
    });

    const onPinchGestureEvent = (event) => {
        const normalizedScale = (baseScale * event.nativeEvent.scale) * NORMALIZED_SCALE_FACTOR;
        setCanvasScale(Math.max(0.5, Math.min(normalizedScale, 2.0)));
    };

    const onPinchHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            setBaseScale(Math.max(0.5, Math.min(canvasScale, 2.0)));
        }
    };

    const resetCanvasScale = () => {
        setCanvasScale(1 / NORMALIZED_SCALE_FACTOR);
        setBaseScale(1 / NORMALIZED_SCALE_FACTOR);
    };

    const toggleRulers = () => {
        setShowRulers(prev => !prev);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#d3d3d3' }}>
            {/* Header Component */}
            <View
                onLayout={(event) => {
                    const height = event.nativeEvent.layout.height;
                    setHeaderHeight(height);
                    console.log('Header onLayout Height:', height);
                }}
                style={{ backgroundColor: '#F8FAFC' }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 }}>
                    <TouchableOpacity>
                        <Ionicons name="menu" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity>
                            <AntDesign name="folderopen" size={26} color="black" style={{ paddingHorizontal: 5 }} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="save-outline" size={26} color="black" style={{ paddingHorizontal: 15 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 7, borderRadius: 5, borderWidth: 2, borderColor: 'skyblue' }}>
                            <Text style={{ color: 'skyblue', fontSize: 14 }}>CONNECT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'start', paddingBottom: 10, marginLeft: 30 }}>
                    <Image
                        source={require('../../assets/RNJET_logo.png')}
                        style={{ width: 150, height: 50, resizeMode: 'contain' }}
                    />
                </View>
            </View>

            {/* Toolbar */}
            <View
                onLayout={(event) => {
                    const height = event.nativeEvent.layout.height;
                    setToolbarHeight(height);
                    console.log('Toolbar onLayout Height:', height);
                }}
                style={styles.toolbar}
            >
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="remove-circle-outline" size={24} color="black" />
                    <Text style={styles.toolbarText}>Withdraw</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="trash-outline" size={24} color="black" />
                    <Text style={styles.toolbarText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="pencil-outline" size={24} color="black" />
                    <Text style={styles.toolbarText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="copy-outline" size={24} color="black" />
                    <Text style={styles.toolbarText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.toolbarText}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton} onPress={toggleRulers}>
                    <Ionicons name="resize" size={24} color="black" />
                    <Text style={styles.toolbarText}>Scaleplate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton} onPress={resetCanvasScale}>
                    <MaterialIcons name="zoom-out-map" size={24} color="black" />
                    <Text style={styles.toolbarText}>{Math.round((canvasScale * NORMALIZED_SCALE_FACTOR) * 100)}%</Text>
                </TouchableOpacity>
            </View>

            {/* Canvas Area */}
            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}
            >
                <View style={styles.canvasContainer}>
                    {/* Left Vertical Ruler */}
                    {showRulers && (
                        <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: 20 }}>
                            <Svg height={490} width="20">
                                {generateRulerTicks('y', canvasScale, 0)}
                            </Svg>
                        </View>
                    )}

                    {/* Canvas Wrapper with White Background */}
                    <View style={[styles.canvasWrapper, { height: canvasAreaHeight }]}>
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={{ width: CANVAS_WIDTH * canvasScale }}
                            style={{ flex: 1 }}
                        >
                            <View style={{ flexDirection: 'column' }}>
                                {/* Horizontal Ruler */}
                                {showRulers && (
                                    <Svg height="20" width={CANVAS_WIDTH * canvasScale}>
                                        {generateRulerTicks('x', canvasScale)}
                                    </Svg>
                                )}
                                {/* Canvas */}
                                <View
                                    style={{
                                        width: CANVAS_WIDTH * canvasScale,
                                        height: CANVAS_HEIGHT * canvasScale,
                                        backgroundColor: '#FFF',
                                    }}
                                    {...panResponder.panHandlers}
                                >
                                    {elements.map(renderElement)}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </PinchGestureHandler>

            {/* Footer Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('TextScreen')} style={styles.button}>
                    <Ionicons name="text-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Text</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('QRScreen')} style={styles.button}>
                    <Ionicons name="qr-code-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>QR Code</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('BarCodeScreen')} style={styles.button}>
                    <Ionicons name="barcode-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Barcode</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={styles.button}>
                    <Ionicons name="image-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={styles.button}>
                    <Ionicons name="time-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Time</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={styles.button}>
                    <Ionicons name="list-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Number</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    canvasContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC'
    },
    canvasWrapper: {
        backgroundColor: '#ffffff',
        marginLeft: 25,
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
    },
    toolbarButton: {
        alignItems: 'center',
    },
    toolbarText: {
        fontSize: 12,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#F8FAFC',
    },
    button: {
        padding: 9,
        backgroundColor: '#F9F6EE',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 12,
    },
});

export default HomeScreen;