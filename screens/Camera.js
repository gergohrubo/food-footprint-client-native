import React from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions'
import Toolbar from './Toolbar';
import styles from './Camera.styles';

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    capture: null,
    flashMode: Camera.Constants.FlashMode.off,
    capturing: null,
    cameraType: Camera.Constants.Type.back,
    hasCameraPermission: null,
  };

  setFlashMode = (flashMode) => this.setState({ flashMode });
  setCameraType = (cameraType) => this.setState({ cameraType });
  handleCaptureIn = () => this.setState({ capturing: true });

  handleCaptureOut = () => {
    if (this.state.capturing) {
      this.camera.stopRecording();
    }
  };

  handleCapture = async () => {
    const options = { quality: 0.00001, base64: true }
    const photoData = await this.camera.takePictureAsync(options);
    this.setState({ capturing: false, capture: photoData })
    try {
      const data = new FormData()
      data.append('image', {
        uri: this.state.capture.uri,
        type: 'image/jpeg',
        name: 'newimage.jpg'
      })
      console.log(data)
      const response = await fetch('http://318eb5da.ngrok.io/image', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      const responseData = await response.json()
      console.log('the response body', responseData)
    } catch (error) {
      console.error(error)
    }
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const hasCameraPermission = (camera.status === 'granted');

    this.setState({ hasCameraPermission });
  };
  render() {
    const { hasCameraPermission, flashMode, cameraType, capturing, capture } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    return (
      <React.Fragment>
        <View>
          <Camera
            type={cameraType}
            flashMode={flashMode}
            style={styles.preview}
            ref={camera => this.camera = camera}
          />
        </View>
        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          onCapture={this.handleCapture}
        />
      </React.Fragment>
    );
  };
};