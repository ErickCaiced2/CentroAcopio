import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { RequestStatus } from '../types/wasteRequest';

const LABELS: Record<RequestStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
};

const COLORS: Record<RequestStatus, string> = {
  pendiente: colors.pendiente,
  confirmado: colors.confirmado,
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  const color = COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}1F` }]}>
      <Text style={[styles.text, { color }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
