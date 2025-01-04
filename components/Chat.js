import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {GiftedChat} from "react-native-gifted-chat";
// Firebase
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";

const Chat = ({route, navigation, db}) => {
  const [messages, setMessages] = useState([]);
  // Deconstruct parameters, selectedColor is not being used yet
  const {userID, userName, selectedColor} = route.params;

  useEffect(() => {
    navigation.setOptions({title: userName});

    // onSnapshot listener
    const unsubMessages = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({
          id: doc.id, ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()) //Convert time
        })
      });
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  const addMessage = (newMessage) => {
    // console.log("addMessage", newMessage);
    // Ignore promise returned
    addDoc(collection(db, "messages"), newMessage[0])
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
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