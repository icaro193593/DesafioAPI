import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

export default function FavoritasScreen() {
  const [todasMoedas, setTodasMoedas] = useState<Moeda[]>([]);
  const [codigosFavoritos, setCodigosFavoritos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          setTodasMoedas(lista);
        } else {
          setError('Erro ao carregar moedas.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const carregarFavoritas = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_FAVORITAS);
      const listaIds = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      setCodigosFavoritos(listaIds);
    } catch (e) {
      console.log('Erro ao ler favoritas:', e);
    }
  };

  useEffect(() => {
    listarMoedas();
    carregarFavoritas();

    const id = setInterval(() => {
      carregarFavoritas();
    }, 1500);

    return () => clearInterval(id);
  }, []);

  const removerFavorita = async (codigo: string) => {
    try {
      const novasFavoritas = codigosFavoritos.filter((c) => c !== codigo);
      setCodigosFavoritos(novasFavoritas);
      await AsyncStorage.setItem(CHAVE_FAVORITAS, JSON.stringify(novasFavoritas));
    } catch (e) {
      console.log('Erro ao remover favorita:', e);
    }
  };

  const moedasFavoritas = todasMoedas.filter((moeda) =>
    codigosFavoritos.includes(moeda.code)
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centralizado}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.textoStatus}>Carregando favoritas...</Text>
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
      <FlatList
        data={moedasFavoritas}
        keyExtractor={(item) => item.code}
        renderItem={({ item, index }) => (
          <ItemMoeda
            item={item}
            index={index}
            favorita={true}
            aoAlternarFavorita={removerFavorita}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.vazio}>
            Nenhuma moeda favorita salva. Clique na estrela na aba Moedas para adicionar.
          </Text>
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
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  vazio: {
    padding: 24,
    textAlign: 'center',
    color: '#666666',
    fontSize: 15,
  },
});
