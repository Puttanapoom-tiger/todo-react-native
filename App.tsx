import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({route, navigation}: any) {
  console.log(route, navigation);

  const {submittedText, submittedCount} = route.params || {};
  const [items, setItems] = useState<{text: string; count: number}[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCount, setNewCount] = useState('');

  useEffect(() => {
    if (submittedText && typeof submittedCount === 'number') {
      setItems(prevItems => [
        ...prevItems,
        {text: submittedText, count: submittedCount},
      ]);
    }
  }, [submittedText, submittedCount]);

  const handleDelete = (index: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setItems(prevItems => prevItems.filter((_, i) => i !== index)),
        },
      ],
      {cancelable: true},
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Confirm Clear All',
      'Are you sure you want to clear all data?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setItems([]),
        },
      ],
      {cancelable: true},
    );
  };

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setNewText(items[index].text);
    setNewCount(items[index].count.toString());
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (editIndex !== null) {
      const parsedCount = parseInt(newCount, 10);
      if (!isNaN(parsedCount) && parsedCount >= 0 && parsedCount <= 99) {
        setItems(prevItems =>
          prevItems.map((item, i) =>
            i === editIndex ? {text: newText, count: parsedCount} : item,
          ),
        );
        setModalVisible(false);
      } else {
        Alert.alert('Invalid Input', 'Please enter a number between 0 and 99');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textcount}>{items.length}</Text>
      <Text style={styles.textcount}>Count</Text>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => navigation.navigate('Add')}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.listItemContainer}>
              <Text style={styles.listview}>
                {item.text} {item.count}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(index)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.flatList}
        />
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={newText}
            onChangeText={setNewText}
            placeholder="Enter new text"
          />
          <TextInput
            style={styles.input}
            value={newCount}
            onChangeText={text => {
              const parsed = parseInt(text, 10);
              if (isNaN(parsed) || parsed < 0 || parsed > 99) {
                setNewCount('');
              } else {
                setNewCount(text);
              }
            }}
            placeholder="Enter new count"
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleEdit} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

function Add({navigation}: any) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const increment = () => {
    if (count + 20 > 100) {
      Alert.alert('Limit Reached', 'can’t increment > 100', [
        {text: 'OK', onPress: () => setCount(99)},
      ]);
    } else {
      setCount(count + 20);
    }
  };

  const decrement = () => {
    if (count - 20 < 0) {
      Alert.alert('Limit Reached', 'can’t decrement < 0', [
        {text: 'OK', onPress: () => setCount(0)},
      ]);
    } else {
      setCount(count - 20);
    }
  };

  const handleTextChange = (newText: string) => {
    const regex = /^[a-zA-Z]*$/;
    if (regex.test(newText)) {
      setText(newText);
    } else {
      Alert.alert('Invalid Input', 'Please enter only letters');
    }
  };

  const handleSubmit = () => {
    if (text) {
      navigation.navigate('Home', {
        submittedText: text,
        submittedCount: count,
      });
    } else {
      Alert.alert('No Input', 'Please enter some text before submitting.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textcount}>{count}</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Enter text here"
      />

      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'purple'}]}
        onPress={increment}>
        <Text style={styles.buttonText}>Increment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'red'}]}
        onPress={decrement}>
        <Text style={styles.buttonText}>Decrement</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#DFA006'}]}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add" component={Add} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textcount: {
    fontSize: 80,
  },
  button: {
    width: 300,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    width: 300,
    marginBottom: 20,
  },
  listContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 10,
    width: 320,
    marginTop: 20,
  },
  listview: {
    padding: 10,
    fontSize: 18,
    color: '#000000',
    borderWidth: 4,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  flatList: {
    flexGrow: 0,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalContainer: {
    top: '50%',
    left: '45%',
    transform: [{translateX: -150}, {translateY: -150}],
    backgroundColor: 'white',
    padding: 20,
    width: 350,
    height: 500,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
