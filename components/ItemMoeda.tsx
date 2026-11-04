import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type Moeda = {
  code: string;
  name: string;
};

type Props = {
  item: Moeda;
  index?: number;
  favorita: boolean;
  aoAlternarFavorita: (codigo: string) => void;
};

export default function ItemMoeda(props: Props) {
  return (
    <View style={styles.linha}>
      <View style={styles.textos}>
        <Text style={styles.codigo}>{props.item.code}</Text>
        <Text style={styles.nome}>{props.item.name}</Text>
      </View>

      <TouchableOpacity onPress={() => props.aoAlternarFavorita(props.item.code)}>
        <MaterialIcons
          name="star-rate"
          size={26}
          color={props.favorita ? '#f7931a' : '#cccccc'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  textos: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  codigo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
    width: 60,
  },
  nome: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
  },
});
