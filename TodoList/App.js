import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
const TodoType = {
  Work: 'Work',
  Travel: 'Travel',
}

const STORAGE_KEY = '@todos'


export default function App() {
  const [type, setType] = useState(TodoType.Work);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  
  const addToDo = async () => {
    if (text === '') return;
    const newToDo = Object.assign({}, toDos, { [Date.now()]: { text, type } })
    setToDos(newToDo);
    await saveToDo(newToDo);
    setText('');
  }
  
  const saveToDo = async (targetToDo) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(targetToDo))
      } catch (e) {
        console.log(e);
      }
  }
  
  const deleteToDo = async (key) => {
    Alert.alert('Delete To Do', 'Are you sure?', [{ text: "No" }, {
      text: 'Yes', onPress: async () => {
        const newToDos = { ...toDos };
        delete newToDos[key];
    
        setToDos(newToDos)
        await saveToDo(newToDos);
      } }])
  
    
  }
  
  const loadToDo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      setToDos(jsonValue != null ? JSON.parse(jsonValue) : {})
    } catch(e) {
      console.log(e); 
    }
  }
  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
    console.log('Done.')
  }
  useEffect(() => {
    loadToDo();
  }, [])
  console.log(toDos);
  // clearAll();
  return (
    <View style={styles.container}>
      <StatusBar style='auto'></StatusBar>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {setType(TodoType.Work)}}>
          <Text style={{...styles.btnText, color : type === TodoType.Work ? 'white' : theme.grey }}>{TodoType.Work}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{setType(TodoType.Travel)}}>
          <Text style={{ ...styles.btnText, color: type === TodoType.Travel ? 'white' : theme.grey }}>{TodoType.Travel}</Text>
        </TouchableOpacity> 
      </View>
      <View>
        <TextInput
          onSubmitEditing={() => { addToDo() }}
          returnKeyType='done'
          onChangeText={(payload) => setText(payload)}
          value={text}
          placeholder={type === TodoType.Work ? 'Add a To Do' : 'Where do you want to go?'}
          style={styles.input} />
      </View>
      <ScrollView>
        {Object.keys(toDos).filter((key) => toDos[key] && toDos[key].type === type).map((key) => (
          <View style={styles.todo} key={key}>
            <Text style={styles.todoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => { deleteToDo(key) }}>
              <FontAwesome name="trash-o" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ) )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    marginTop: 100,
    justifyContent: 'space-around',
  },

  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: theme.grey,
  },

  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginVertical: 15,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  todoText:{
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }

});
