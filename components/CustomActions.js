import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useActionSheet} from '@expo/react-native-action-sheet';
import React from "react";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuidv4} from 'uuid';

const CustomActions = ({wrapperStyle, iconTextStyle, onSend, storage, userID, userName}) => {
  const actionSheet = useActionSheet();
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      // Combine metadata and location into a single message
      onSend([{...generateMetadata(), ...{image: imageURL}}]);
    });
  }

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  function generateMetadata() {
    return {
      _id: uuidv4(), // Generate a unique ID for the message
      createdAt: new Date(),
      user: {
        _id: userID, // Use the current user's ID
        name: userName, // Use the current user's name
      },
    };
  }

  const getLocation = async () => {
    // console.log("Getting location...");
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      // console.log("Permissions granted");
      const location = await Location.getCurrentPositionAsync({});
      // console.log("Location: " + location.coords.latitude + "," + location.coords.longitude);
      if (location) {
        // console.log("Sending location...");
        // Location object
        const locationData = {
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        };
        // Combine metadata and location into a single message
        onSend([{...generateMetadata(), ...locationData}]);
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  }

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }


  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;