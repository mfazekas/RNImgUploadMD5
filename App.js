/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  CameraRoll,
  Image,
} from 'react-native';

import RNFS from 'react-native-fs';


type Props = {};
class TestView extends Component<Props> {
  _downloadImage = async () => {
    let testJpgURL = 'https://upload.wikimedia.org/wikipedia/en/5/58/Penny_test.jpg';
    let testJpgPath = RNFS.LibraryDirectoryPath + '/test.jpg'

    let download = RNFS.downloadFile({
      fromUrl: testJpgURL,
      toFile: testJpgPath,
    });
    await download.promise;
    let testJpgUrl = `file://${testJpgPath}`;
    this.setState({downloadedUrl: testJpgUrl})
    let hashOnIOS = await RNFS.hash(testJpgPath, "md5");
    let fileInfo = await RNFS.stat(testJpgPath);
    let lengthOnIOS = fileInfo.size;
    this.setState({hashOnIOS, lengthOnIOS});
  };

  checksumImage = async(imageUriToChecksum) => {
    const imageUploadURL = 'https://md5-hash.herokuapp.com/files.json';
    const xhr = new XMLHttpRequest();
    this.setState({ checksumResponse: 'downloading...' });
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      this.setState({ checksumResponse: xhr.responseText });
    };
    xhr.open('PUT', imageUploadURL);
    xhr.send({ uri: imageUriToChecksum, type: 'image/jpeg' });
  }

  constructor(props){
      super(props);
      this.state = {}
    }


  displayImage = (imageUrl) => {
    this.setState({imageUrlToDisplay: imageUrl});
  }

  render() {
    let testImage = require('./images/test.jpg');
    console.log("testImage", testImage, "uri", testImage.uri, "url", testImage.url);
    return (
      <View>
        <Button title="Download image" onPress={this._downloadImage} />
        {this.state.downloadedUrl &&
          <View>
            <Text>Downloaded file path: {this.state.downloadedUrl}</Text>
              {this.state.hashOnIOS &&
                <View>
                  <Text>Hash on disk: {this.state.hashOnIOS}, length: {this.state.lengthOnIOS}</Text>
                </View>
              }
            <Button title="Display image" onPress={() => this.displayImage(this.state.downloadedUrl)} />
            <Button title="Remote checksum image" onPress={() => this.checksumImage(this.state.downloadedUrl)} />
          </View>}
        {this.state.imageUrlToDisplay &&
          <View>
            <Image source={{url: this.state.imageUrlToDisplay}} style={{width: 100, height: 100, borderWidth: 1}} />
          </View>
        }
        {this.state.checksumResponse &&
          <View>
            <Text>Response from server:</Text>
            <Text>{this.state.checksumResponse}</Text>
          </View>}
      </View>
    )
  }
};

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.instructions}>0.) Make sure app is freshly started</Text>
          <Text style={styles.instructions}>1.) Press download image</Text>
          <Text style={styles.instructions}>2.) Press remote checksum image</Text>
          <Text style={styles.instructions}>3.) Press display image</Text>
          <Text style={styles.instructions}>4.) Press checksum image (note the checksum will be different)</Text>
        </View>
        <TestView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
