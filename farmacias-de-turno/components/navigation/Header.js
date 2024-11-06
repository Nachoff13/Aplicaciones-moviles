import React from 'react';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

export default function Header() {
  return (
    <ThemedView>
      <ThemedText
        type="title"
        style={{
          marginVertical: 10,
        }}
      >
        Farmacias de Turno
      </ThemedText>
    </ThemedView>
  );
}
