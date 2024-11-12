import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Task from './components/Task/task';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const response = await fetch('http://192.168.0.6:8080/todos/1');
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    setTodos(data);
  }

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
          : todo
      )
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
    
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={todos}
            keyExtractor={(todo) => todo.id.toString()}
            renderItem={({ item }) => (
              <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} />
            )}
            ListHeaderComponent={
              <Text style={styles.title}>Tareas de Hoy</Text>
            }
            contentContainerStyle={styles.contentContainerStyle}
          />
          <StatusBar style="auto" />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainerStyle: {
    padding: 15,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 15,
  },
});
