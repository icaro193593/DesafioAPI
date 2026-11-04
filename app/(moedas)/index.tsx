import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemMoeda, { Moeda } from '../../components/ItemMoeda';
import MeuBotao from '../../components/MeuBotao';

const API_KEY = 'f8c78fefcc15b2af25a3fbd6';
const CODES_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;
const CHAVE_FAVORITAS = 'moedas_favoritas';

export default function MoedasScreen() {
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritas, setFavoritas] = useState<string[]>([]);
  const [busca, setBusca] = useState<string>('');

  const listarMoedas = () => {
    setIsLoading(true);
    setError(null);

    fetch(CODES_URL)
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.result === 'success' && Array.isArray(dados.supported_codes)) {
          const lista: Moeda[] = dados.supported_codes.map(
            ([code, name]: [string, string]) => ({
              code,
              name,
            })
          );
          setMoedas(lista);
        } else {
          setError('Erro ao carregar dados da API.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const carregarFavoritas = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_FAVORITAS);
      const listaIds = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      setFavoritas(listaIds);
    } catch (e) {
      console.log('Erro ao ler favoritas:', e);
    }
  };

  useEffect(() => {
    listarMoedas();
    carregarFavoritas();

    const id = setInterval(() => {
      carregarFavoritas();
    }, 2000);

    return () => clearInterval(id);
  }, []);

  const alternarFavorita = async (codigo: string) => {
    try {
      const jaFavorita = favoritas.includes(codigo);
      const novasFavoritas = jaFavorita
        ? favoritas.filter((c) => c !== codigo)
        : [...favoritas, codigo];

      setFavoritas(novasFavoritas);
      await AsyncStorage.setItem(CHAVE_FAVORITAS, JSON.stringify(novasFavoritas));
    } catch (e) {
      console.log('Erro ao salvar favorita:', e);
    }
  };

  const moedasFiltradas = moedas.filter((item) => {
    const termo = busca.toLowerCase();
    return (
      item.code.toLowerCase().includes(termo) ||
      item.name.toLowerCase().includes(termo)
    );
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centralizado}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.textoStatus}>Carregando moedas...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centralizado}>
        <Text style={styles.textoErro}>Erro: {error}</Text>
        <MeuBotao titulo="Tentar Novamente" clique={listarMoedas} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topo}>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar moeda (ex: USD, Real)..."
          style={styles.input}
        />
      </View>

      <FlatList
        data={moedasFiltradas}
        keyExtractor={(item) => item.code}
        renderItem={({ item, index }) => (
          <ItemMoeda
            item={item}
            index={index}
            favorita={favoritas.includes(item.code)}
            aoAlternarFavorita={alternarFavorita}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.vazio}>Nenhuma moeda encontrada.</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centralizado: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoStatus: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  textoErro: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  topo: {
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
  vazio: {
    padding: 20,
    textAlign: 'center',
    color: '#666666',
  },
});
