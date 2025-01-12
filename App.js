import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Start from "./components/Start";
import Chat from "./components/Chat";
import {initializeApp} from "firebase/app";
import {getFirestore, disableNetwork, enableNetwork} from "firebase/firestore";
import {useNetInfo} from "@react-native-community/netinfo";
import {Alert} from "react-native";
import {useEffect} from "react";
import {getStorage} from "firebase/storage";

const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCO0yFm5LvT4ny9BnatnyM0KnOZHr7382c",
    authDomain: "chat-app-8abe5.firebaseapp.com",
    projectId: "chat-app-8abe5",
    storageBucket: "chat-app-8abe5.firebasestorage.app",
    messagingSenderId: "77759981223",
    appId: "1:77759981223:web:57e9210f15ff5f7f7b5d82"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialize Firebase Storage
  const storage = getStorage(app);

  // Get connection status
  const connectionStatus = useNetInfo();

  useEffect(() => {
    // console.log("Connection + " + connectionStatus.isConnected);
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;