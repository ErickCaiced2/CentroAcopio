import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color: string;
}

interface Props {
  markers: MapMarker[];
  onMarkerPress: (id: string) => void;
  centerLat: number;
  centerLng: number;
  zoom: number;
}

/**
 * Mapa interactivo basado en Leaflet + OpenStreetMap dentro de un WebView.
 * Se evita cualquier SDK con API key (Google Maps) para no requerir
 * facturación en Google Cloud, igual que en App 1 y App 2.
 */
export default function OsmMapView({ markers, onMarkerPress, centerLat, centerLng, zoom }: Props) {
  const html = useMemo(() => buildHtml(markers, centerLat, centerLng, zoom), [
    markers,
    centerLat,
    centerLng,
    zoom,
  ]);

  const handleMessage = (event: WebViewMessageEvent) => {
    onMarkerPress(event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        style={styles.webview}
      />
    </View>
  );
}

function buildHtml(markers: MapMarker[], centerLat: number, centerLng: number, zoom: number): string {
  const markersJs = markers
    .map(
      m => `
      L.circleMarker([${m.lat}, ${m.lng}], {
        radius: 10,
        color: '${m.color}',
        fillColor: '${m.color}',
        fillOpacity: 0.9,
        weight: 2
      }).addTo(map).on('click', function () {
        window.ReactNativeWebView.postMessage('${m.id}');
      });`,
    )
    .join('\n');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([${centerLat}, ${centerLng}], ${zoom});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    ${markersJs}
  </script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  webview: { flex: 1 },
});
