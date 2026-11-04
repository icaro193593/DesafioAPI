import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MeuBotao from '../components/MeuBotao';

export default function InicioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Conversor de Moedas</Text>
      <Text style={styles.descricao}>
        Aplicativo para consultar a lista de moedas mundiais, salvar moedas favoritas e converter valores em tempo real usando a ExchangeRate-API.
      </Text>

      <View style={styles.separator} />

      <Text style={styles.subtitulo}>Funcionalidades:</Text>
      <Text style={styles.item}>• Listagem de todas as moedas suportadas</Text>
      <Text style={styles.item}>• Marcação de moedas favoritas com AsyncStorage</Text>
      <Text style={styles.item}>• Conversão de valores entre duas moedas</Text>

      <View style={styles.botoes}>
        <MeuBotao
          titulo="Ver Moedas"
          clique={() => router.push('/(moedas)')}
        />
        <MeuBotao
          titulo="Sobre o App"
          clique={() => router.push('/sobre')}
          style={styles.botaoSecundario}
        />
      </View>
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
  descricao: {
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
  botoes: {
    marginTop: 24,
    gap: 12,
  },
  botaoSecundario: {
    backgroundColor: '#555555',
  },
});
