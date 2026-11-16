import type { Cita, DatosCita, EstadoCita } from "../types";

const API_URL = "http://localhost:3000/api/citas";

async function comprobarRespuesta(respuesta: Response): Promise<void> {
  if (respuesta.ok) return;
  const resultado = await respuesta.json().catch(() => null);
  throw new Error(resultado?.mensaje ?? "No fue posible completar la operación.");
}

export async function obtenerCitas(): Promise<Cita[]> {
  const respuesta = await fetch(API_URL);
  await comprobarRespuesta(respuesta);
  return respuesta.json();
}

async function guardarCita(ruta: string, method: string, datos: Partial<DatosCita>): Promise<Cita> {
  const respuesta = await fetch(ruta, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  await comprobarRespuesta(respuesta);
  const resultado = await respuesta.json();
  return resultado.cita;
}

export function crearCita(datos: DatosCita): Promise<Cita> {
  return guardarCita(API_URL, "POST", datos);
}

export function actualizarCita(id: number, datos: DatosCita): Promise<Cita> {
  return guardarCita(`${API_URL}/${id}`, "PUT", datos);
}

export function actualizarEstado(id: number, estado: EstadoCita): Promise<Cita> {
  return guardarCita(`${API_URL}/${id}/estado`, "PATCH", { estado });
}

export async function eliminarCita(id: number): Promise<void> {
  const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  await comprobarRespuesta(respuesta);
}
