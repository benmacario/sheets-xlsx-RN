import React, { useState } from 'react';
import XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';

import { FileSystem } from 'react-native-unimodules';
import { RectButton } from 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, SafeAreaView, ScrollView } from 'react-native';



export default function App() {
  const [data, setData] = useState();
  
  // function picker file
  handleDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      if(res.type !== 'success'){
        return Alert.alert('Não foi possivel carregar o arquivo');
      }

      await FileSystem.readAsStringAsync(`${res.uri}`, {encoding: FileSystem.EncodingType.Base64})
      .then(b64 => XLSX.read(b64, {type: 'base64'}))
      .then(wb => {
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        const dataFile = XLSX.utils.sheet_to_json(ws, {header: 0});
        setData(dataFile);
      });
      
    } catch (err) {
      Alert.alert('Erro ao carregar arquivo!');
    }
  }
  //
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.viewComponent}>
        <RectButton style={styles.button} onPress={handleDocument}>
          <Text style={
            {
              color: '#fff',
              fontSize: 16,
            }}
          >
            IMPORTAR ARQUIVO DE PLANILHA
          </Text>
        </RectButton>
          <ScrollView style={styles.viewData} showsVerticalScrollIndicator={false}>
              {data ?
                data.map(infos => { return(
                  <View key={infos.name}>
                    <Text style={styles.textInfo}>Nome: {infos.name}</Text>
                    <Text style={styles.textInfo}>Sobrenome: {infos.sobrenomes}</Text>
                    <View style={{
                      marginVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E4E4E4"}}
                    />
                  </View>
                )}) : <Text>Clique em IMPORT XLSX</Text>
              }
          </ScrollView>
      </View>
      <StatusBar style="light" backgroundColor= "#075E33"/>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: StatusBar.currentHeight,
    backgroundColor: '#E9F2EF',
  },
  
  viewComponent: {
    top: 60,
    marginBottom: 130,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#0D9D57',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  
  viewData: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  textInfo: {
    fontSize: 16,
    color: '#888',
  }
});
