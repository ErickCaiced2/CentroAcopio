import { NativeModules } from 'react-native';

interface IntentModuleNative {
  getInitialResiduo(): Promise<string | null>;
  clearResiduoExtra(): void;
}

const { IntentModule } = NativeModules as { IntentModule?: IntentModuleNative };

/**
 * Consulta el extra `residuo_json` del Intent que abrió (o reabrió) la
 * Activity. Devuelve `null` si la app no fue lanzada por App 2 (Logística)
 * o si el módulo nativo no está disponible (p. ej. en tests con Jest).
 */
export async function obtenerResiduoInicial(): Promise<string | null> {
  if (!IntentModule) return null;
  return IntentModule.getInitialResiduo();
}

/** Evita volver a procesar el mismo residuo en la próxima consulta. */
export function limpiarResiduoExtra(): void {
  IntentModule?.clearResiduoExtra();
}
