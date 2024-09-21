import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SavedLists, } from './views/savedLists';
import { NewEditListView } from './views/newEditList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from './database/initializeDatabase';
import { Colors } from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName="shoplist.db" onInit={initializeDatabase}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Listas"
              component={SavedLists}
            />
            <Stack.Screen
              name="Lista"
              component={NewEditListView}
              options={{ title: 'Lista' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
