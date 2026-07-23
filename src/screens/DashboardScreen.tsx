import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';

import OsmMapView, { MapMarker } from '../components/OsmMapView';
import RequestDetailModal from '../components/RequestDetailModal';
import RequestListItem from '../components/RequestListItem';
import { useIncomingResiduos } from '../hooks/useIncomingResiduos';
import { colors } from '../theme/colors';
import { WasteRequest } from '../types/wasteRequest';

// Centro de Quito: punto por defecto mientras no hay solicitudes.
const CENTRO_POR_DEFECTO = { lat: -0.1807, lng: -78.4678 };

export default function DashboardScreen() {
  const { requests, confirmarRecepcion } = useIncomingResiduos();
  const [seleccionId, setSeleccionId] = useState<string | null>(null);

  const seleccionado = requests.find(r => r.id === seleccionId) ?? null;

  const centro = requests[0] ?? CENTRO_POR_DEFECTO;

  const markers: MapMarker[] = requests.map(r => ({
    id: r.id,
    lat: r.lat,
    lng: r.lng,
    color: r.status === 'pendiente' ? colors.pendiente : colors.confirmado,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Acopio</Text>
        {requests.length > 0 && <Text style={styles.count}>({requests.length})</Text>}
      </View>

      <View style={styles.mapContainer}>
        <OsmMapView
          markers={markers}
          onMarkerPress={setSeleccionId}
          centerLat={centro.lat}
          centerLng={centro.lng}
          zoom={requests.length ? 15 : 12}
        />
      </View>

      <View style={styles.listContainer}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aún no has recibido residuos procesados de Logística.
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: WasteRequest }) => (
              <RequestListItem request={item} onPress={() => setSeleccionId(item.id)} />
            )}
          />
        )}
      </View>

      <RequestDetailModal
        request={seleccionado}
        onClose={() => setSeleccionId(null)}
        onConfirmar={confirmarRecepcion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: (StatusBar.currentHeight ?? 0) + 12,
    backgroundColor: colors.primary,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  count: { fontSize: 14, color: '#ffffffb3', marginLeft: 8 },
  mapContainer: { flex: 3 },
  listContainer: { flex: 2 },
  listContent: { padding: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: colors.textMuted, textAlign: 'center' },
});
