import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { WasteRequest } from '../types/wasteRequest';
import StatusBadge from './StatusBadge';

interface Props {
  request: WasteRequest;
  onPress: () => void;
}

export default function RequestListItem({ request, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.tipo}>{request.tipo}</Text>
        <Text style={styles.subtitle}>
          {request.idUsuario} · {request.lat.toFixed(4)}, {request.lng.toFixed(4)}
        </Text>
      </View>
      <StatusBadge status={request.status} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  info: { flex: 1, marginRight: 8 },
  tipo: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
