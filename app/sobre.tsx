import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MeuBotao from '../components/MeuBotao';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Sobre o Aplicativo</Text>
      <Text style={styles.texto}>
        Este aplicativo foi desenvolvido para a atividade de Consumo de API em React Native.
      </Text>

      <View style={styles.separator} />

      <Text style={styles.subtitulo}>Tecnologias Utilizadas:</Text>
      <Text style={styles.item}>• React Native e Expo Router (Drawer + Tabs)</Text>
      <Text style={styles.item}>• Consumo da ExchangeRate-API com fetch()</Text>
      <Text style={styles.item}>• Persistência local com AsyncStorage</Text>
      <Text style={styles.item}>• Listagem com FlatList e estados com useState / useEffect</Text>

      <View style={styles.separator} />

      <MeuBotao
        titulo="Ir para Moedas"
        clique={() => router.push('/(moedas)')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  item: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 6,
  },
});
