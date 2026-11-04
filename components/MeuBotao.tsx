import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export type MeuBotaoProps = {
  titulo: string;
  clique: () => void;
  style?: any;
  disabled?: boolean;
};

export default function MeuBotao(props: MeuBotaoProps) {
  return (
    <TouchableOpacity
      style={[styles.botao, props.style]}
      onPress={props.clique}
      disabled={props.disabled}
    >
      <Text style={styles.texto}>{props.titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
