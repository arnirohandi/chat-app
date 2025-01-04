import {Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';

// Firebase
import {getAuth, signInAnonymously} from "firebase/auth";

const image = require('./../assets/background.png');
const Start = ({navigation}) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const auth = getAuth();

  // Sign in anonymously implementation
  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", {userID: result.user.uid, userName: name, selectedColor: backgroundColor});
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.top}>
          <Text style={styles.title}>Chat App</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.content}>
            <View style={styles.nameContainer}>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Your Name'
              />
            </View>
            <View style={styles.colorContainer}>
              <Text style={styles.colorText}>Choose Background Color:</Text>
              <View style={styles.colorOptions}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      {backgroundColor: color, borderWidth: backgroundColor === color ? 2 : 0},
                    ]}
                    onPress={() => setBackgroundColor(color)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={signInUser}>
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    padding: '6%', // To get 88% container
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '56%',
  },
  title: {
    fontSize: 45,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  bottom: {
    backgroundColor: 'white',
    height: '44%',
  },
  content: {
    flex: 1,
    padding: '6%', // To get 88% container
  },
  nameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderWidth: 1,
    width: '100%',
  },
  colorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 10
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    // color: '#FFFFFF',
  }
});

export default Start;