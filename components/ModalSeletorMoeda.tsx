import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moeda } from './ItemMoeda';

type Props = {
  visivel: boolean;
  titulo: string;
  moedas: Moeda[];
  moedaSelecionada: string;
  aoSelecionar: (codigo: string) => void;
  aoFechar: () => void;
};

export default function ModalSeletorMoeda(props: Props) {
  const [busca, setBusca] = useState('');

  const moedasFiltradas = props.moedas.filter((moeda) => {
    const termo = busca.toLowerCase();
    return (
      moeda.code.toLowerCase().includes(termo) ||
      moeda.name.toLowerCase().includes(termo)
    );
  });

  return (
    <Modal
      visible={props.visivel}
      onRequestClose={props.aoFechar}
      animationType="slide"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>{props.titulo}</Text>
          <Button title="Fechar" onPress={props.aoFechar} color="#EF4444" />
        </View>

        <View style={styles.buscaContainer}>
          <TextInput
            style={styles.input}
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar moeda..."
          />
        </View>

        <FlatList
          data={moedasFiltradas}
          keyExtractor={(item) => item.code}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                props.aoSelecionar(item.code);
                props.aoFechar();
              }}
            >
              <Text style={styles.codigo}>{item.code}</Text>
              <Text style={styles.nome}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  buscaContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  codigo: {
    fontWeight: 'bold',
    width: 60,
    fontSize: 15,
    color: '#000000',
  },
  nome: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
  },
});
