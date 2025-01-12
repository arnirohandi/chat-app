import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {Bubble, GiftedChat, InputToolbar} from "react-native-gifted-chat";
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from "react-native-maps";

const Chat = ({route, navigation, db, storage, isConnected}) => {
  const [messages, setMessages] = useState([]);
  // Deconstruct parameters, selectedColor is not being used yet
  const {userID, userName, selectedColor} = route.params;
  // Put unsubMessages outside useEffect
  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({title: userName});

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // onSnapshot listener
      unsubMessages = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({
            id: doc.id, ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()) //Convert time
          })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const addMessage = (newMessages) => {
    console.log("onSend", newMessages);
    // Ignore promise returned
    addDoc(collection(db, "messages"), newMessages[0])
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} userName={userName} onSend={addMessage} {...props} />;
  };

  const renderCustomView = (props) => {
    // console.log("This is renderCustomView");
    const {currentMessage} = props;
    // console.log(currentMessage);
    if (currentMessage.location) {
      // console.log("Current location", currentMessage.location);
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => addMessage(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: userName,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height"/> : null}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding"/> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;