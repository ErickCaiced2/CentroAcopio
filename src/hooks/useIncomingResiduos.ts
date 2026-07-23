import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { limpiarResiduoExtra, obtenerResiduoInicial } from '../native/intentModule';
import {
  ResiduoJson,
  WasteRequest,
  wasteRequestFromResiduoJson,
} from '../types/wasteRequest';

/**
 * Mantiene la lista de residuos recibidos de App 2 (Logística).
 *
 * Revisa el Intent activo al montar y cada vez que la app vuelve a
 * foreground (launchMode="singleTask" hace que Android reutilice esta
 * Activity y actualice su Intent en vez de abrir una instancia nueva).
 */
export function useIncomingResiduos() {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const procesandoRef = useRef(false);

  const revisarIntentActivo = useCallback(async () => {
    if (procesandoRef.current) return;
    procesandoRef.current = true;
    try {
      const residuoJson = await obtenerResiduoInicial();
      if (residuoJson) {
        const json = JSON.parse(residuoJson) as ResiduoJson;
        setRequests(prev => [wasteRequestFromResiduoJson(json), ...prev]);
        limpiarResiduoExtra();
      }
    } finally {
      procesandoRef.current = false;
    }
  }, []);

  useEffect(() => {
    revisarIntentActivo();

    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') revisarIntentActivo();
    };
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [revisarIntentActivo]);

  const confirmarRecepcion = useCallback((id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'confirmado' } : r)),
    );
  }, []);

  return { requests, confirmarRecepcion };
}
