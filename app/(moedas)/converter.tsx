import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moeda } from '../../components/ItemMoeda';
import MeuBotao from '../../components/MeuBotao';
import ModalSeletorMoeda from '../../components/ModalSeletorMoeda';

const API_KEY = 'f8c78fefcc15b2af25a3fbd6';
const CODES_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;

type ResultadoConversao = {
  amount: number;
  baseCode: string;
  targetCode: string;
  conversionRate: number;
  conversionResult: number;
};

export default function ConverterScreen() {
  const [moedaOrigem, setMoedaOrigem] = useState<string>('USD');
  const [moedaDestino, setMoedaDestino] = useState<string>('BRL');
  const [valor, setValor] = useState<string>('100');

  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [modalOrigemAberto, setModalOrigemAberto] = useState<boolean>(false);
  const [modalDestinoAberto, setModalDestinoAberto] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoConversao | null>(null);

  useEffect(() => {
    fetch(CODES_URL)
      .then((res) => res.json())
      .then((dados) => {
        if (dados.result === 'success' && Array.isArray(dados.supported_codes)) {
          const lista: Moeda[] = dados.supported_codes.map(
            ([code, name]: [string, string]) => ({ code, name })
          );
          setMoedas(lista);
        }
      })
      .catch((err) => console.log('Erro ao carregar moedas:', err));
  }, []);

  const converter = () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Digite um valor numérico válido.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${moedaOrigem}/${moedaDestino}/${valorNumerico}`;

    fetch(url)
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.result === 'success') {
          setResultado({
            amount: valorNumerico,
            baseCode: dados.base_code,
            targetCode: dados.target_code,
            conversionRate: dados.conversion_rate,
            conversionResult: dados.conversion_result,
          });
        } else {
          setError('Não foi possível converter.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Conversor de Moedas</Text>

      <Text style={styles.rotulo}>Moeda de Origem:</Text>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => setModalOrigemAberto(true)}
      >
        <Text style={styles.seletorTexto}>{moedaOrigem} (Toque para alterar)</Text>
      </TouchableOpacity>

      <Text style={styles.rotulo}>Moeda de Destino:</Text>
      <TouchableOpacity
        style={styles.seletor}
        onPress={() => setModalDestinoAberto(true)}
      >
        <Text style={styles.seletorTexto}>{moedaDestino} (Toque para alterar)</Text>
      </TouchableOpacity>

      <Text style={styles.rotulo}>Valor a converter:</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        placeholder="Digite o valor..."
        keyboardType="numeric"
        style={styles.input}
      />

      <MeuBotao
        titulo="Converter"
        clique={converter}
        disabled={isLoading}
      />

      {isLoading && (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loading} />
      )}

      {error && <Text style={styles.erro}>{error}</Text>}

      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.itemResultado}>
            Valor de origem: {resultado.amount.toFixed(2)} {resultado.baseCode}
          </Text>
          <Text style={styles.resultadoTexto}>
            Valor de destino: {resultado.conversionResult.toFixed(2)} {resultado.targetCode}
          </Text>
          <Text style={styles.taxaTexto}>
            Taxa de conversão: 1 {resultado.baseCode} = {resultado.conversionRate} {resultado.targetCode}
          </Text>
        </View>
      )}

      <ModalSeletorMoeda
        visivel={modalOrigemAberto}
        titulo="Selecionar Moeda de Origem"
        moedas={moedas}
        moedaSelecionada={moedaOrigem}
        aoSelecionar={(codigo) => {
          setMoedaOrigem(codigo);
          setModalOrigemAberto(false);
        }}
        aoFechar={() => setModalOrigemAberto(false)}
      />

      <ModalSeletorMoeda
        visivel={modalDestinoAberto}
        titulo="Selecionar Moeda de Destino"
        moedas={moedas}
        moedaSelecionada={moedaDestino}
        aoSelecionar={(codigo) => {
          setMoedaDestino(codigo);
          setModalDestinoAberto(false);
        }}
        aoFechar={() => setModalDestinoAberto(false)}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  seletor: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    marginBottom: 14,
  },
  seletorTexto: {
    fontSize: 16,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loading: {
    marginTop: 16,
  },
  erro: {
    color: '#EF4444',
    fontSize: 15,
    marginTop: 12,
  },
  resultado: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  itemResultado: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 6,
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  taxaTexto: {
    fontSize: 15,
    color: '#333333',
  },
});
