import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { WasteRequest } from '../types/wasteRequest';
import StatusBadge from './StatusBadge';

interface Props {
  request: WasteRequest | null;
  onClose: () => void;
  onConfirmar: (id: string) => void;
}

export default function RequestDetailModal({ request, onClose, onConfirmar }: Props) {
  if (!request) return null;

  const fecha = new Date(request.receivedAt);
  const fechaTexto = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString().slice(0, 5)}`;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.tipo}>{request.tipo}</Text>
            <StatusBadge status={request.status} />
          </View>
          <Text style={styles.subtitle}>
            Solicitud {request.id} · {request.idUsuario}
          </Text>

          <InfoRow label="Coordenadas" value={`${request.lat.toFixed(6)}, ${request.lng.toFixed(6)}`} />
          <InfoRow label="Recibido" value={fechaTexto} />

          {request.status === 'pendiente' ? (
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                onConfirmar(request.id);
                onClose();
              }}>
              <Text style={styles.confirmButtonText}>Confirmar recepción en planta</Text>
            </Pressable>
          ) : (
            <View style={styles.confirmedBanner}>
              <Text style={styles.confirmedBannerText}>
                Recepción confirmada en el centro de acopio.
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}: </Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipo: { fontSize: 20, fontWeight: 'bold', color: colors.textDark },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 16 },
  infoRow: { flexDirection: 'row', marginVertical: 4 },
  infoLabel: { fontSize: 14, color: colors.textDark },
  infoValue: { fontSize: 14, color: colors.textDark, fontWeight: '600' },
  confirmButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  confirmedBanner: {
    marginTop: 24,
    backgroundColor: `${colors.confirmado}1F`,
    borderRadius: 12,
    padding: 14,
  },
  confirmedBannerText: { color: colors.confirmado, fontWeight: '600', textAlign: 'center' },
});
