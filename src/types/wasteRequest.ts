export type RequestStatus = 'pendiente' | 'confirmado';

/** Contrato recibido de App 2 (Logística): { id_usuario, tipo, lat, lng } */
export interface ResiduoJson {
  id_usuario: string;
  tipo: string;
  lat: number;
  lng: number;
}

export interface WasteRequest {
  id: string;
  idUsuario: string;
  tipo: string;
  lat: number;
  lng: number;
  receivedAt: number;
  status: RequestStatus;
}

export function wasteRequestFromResiduoJson(json: ResiduoJson): WasteRequest {
  return {
    id: `CA-${Date.now().toString(36).toUpperCase()}`,
    idUsuario: json.id_usuario,
    tipo: json.tipo,
    lat: json.lat,
    lng: json.lng,
    receivedAt: Date.now(),
    status: 'pendiente',
  };
}
