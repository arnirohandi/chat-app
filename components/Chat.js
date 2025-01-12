import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {GiftedChat, InputToolbar} from "react-native-gifted-chat";
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({route, navigation, db, isConnected}) => {
  const [messages, setMessages] = useState([]);
  // Deconstruct parameters, selectedColor is not being used yet
  const {userID, userName, selectedColor} = route.params;
  // Put unsubMessages outside useEffect
  let unsubMessages;

  useEffect(() => {
    if (isConnected === true) {
      navigation.setOptions({title: userName});

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

  const addMessage = (newMessage) => {
    // console.log("addMessage", newMessage);
    // Ignore promise returned
    addDoc(collection(db, "messages"), newMessage[0])
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => addMessage(messages)}
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