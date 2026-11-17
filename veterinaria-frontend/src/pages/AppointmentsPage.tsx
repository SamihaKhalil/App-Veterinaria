import { useEffect, useState } from "react";
import { AppointmentCard } from "../components/AppointmentCard";
import { AppointmentForm } from "../components/AppointmentForm";
import { StatCard } from "../components/StatCard";

import {
  actualizarEstado, obtenerCitas, crearCita, actualizarCita, eliminarCita,
} from "../services/citasApi";

import type { Cita, DatosCita, EstadoCita } from "../types";

type Filtro = "todas" | EstadoCita;

export function AppointmentsPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCitas() {
      try {
        setCargando(true);
        setCitas(await obtenerCitas());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocurrió un error.");
      } finally {
        setCargando(false);
      }
    }

    void cargarCitas();
  }, []);

  async function confirmarCita(id: number) {
    if (ocupado) return;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      const actualizada = await actualizarEstado(id, "confirmada");
      setCitas((actuales) =>
        actuales.map((cita) => (cita.id === id ? actualizada : cita)),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al confirmar.");
    } finally {
      setOcupado(false);
    }
  }

  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [mensaje, setMensaje] = useState("");


  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);
  const [ocupado, setOcupado] = useState(false);

  function abrirFormulario(cita: Cita | null = null) {
    setError("");
    setMensaje("");
    setCitaEditando(cita);
    setFormularioAbierto(true);
  }

  async function guardarCita(datos: DatosCita) {
    if (ocupado) return;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      const guardada = citaEditando
        ? await actualizarCita(citaEditando.id, datos)
        : await crearCita(datos);
      setCitas((actuales) => citaEditando
        ? actuales.map((cita) => cita.id === guardada.id ? guardada : cita)
        : [...actuales, guardada]);
      setFiltro("todas");
      setMensaje(citaEditando ? "Cita actualizada correctamente." : "Cita registrada correctamente.");
      setFormularioAbierto(false);
      setCitaEditando(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al guardar la cita.");
    } finally {
      setOcupado(false);
    }
  }

  async function borrarCita(cita: Cita) {
    if (ocupado || !window.confirm(`¿Eliminar la cita de ${cita.mascota}?`)) return;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      await eliminarCita(cita.id);
      setCitas((actuales) => actuales.filter((actual) => actual.id !== cita.id));
      setMensaje("Cita eliminada correctamente.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar la cita.");
    } finally {
      setOcupado(false);
    }
  }

  const citasFiltradas =
    filtro === "todas" ? citas : citas.filter((cita) => cita.estado === filtro);

  const pendientes = citas.filter((c) => c.estado === "solicitada").length;
  const confirmadas = citas.filter((c) => c.estado === "confirmada").length;

 
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">Agenda de citas</h2>
          <p className="mt-1 text-slate-600">
            Consulta y administra las citas del día.
          </p>
        </div>
        <button disabled={cargando || ocupado} onClick={() => abrirFormulario()} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
          + Nueva cita
        </button>
      </section>

      {formularioAbierto && (
        <AppointmentForm key={citaEditando?.id ?? "nueva"} cita={citaEditando}
          guardando={ocupado} onGuardar={guardarCita}
          onCancelar={() => setFormularioAbierto(false)} />
      )}

      {error && <p role="alert" className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-red-800">{error}</p>}
      {cargando && <p role="status" className="mt-6 text-slate-600">Cargando citas…</p>}

      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Citas de hoy"
          valor={citas.length}
          color="text-teal-700"
        />
        <StatCard
          titulo="Pendientes"
          valor={pendientes}
          color="text-amber-600"
        />
        <StatCard
          titulo="Confirmadas"
          valor={confirmadas}
          color="text-green-600"
        />
      </section>

      <section className="mt-8">
        <label
          htmlFor="filtro"
          className="mb-2 block font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 sm:w-64"
        >
          <option value="todas">Todas</option>
          <option value="solicitada">Solicitadas</option>
          <option value="confirmada">Confirmadas</option>
          <option value="atendida">Atendidas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </section>

      {mensaje && (
        <p
          aria-live="polite"
          className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-green-800"
        >
          {mensaje}
        </p>
      )}

      <section className="mt-6 grid gap-4">
        {citasFiltradas.length > 0 ? (
          citasFiltradas.map((cita) => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onConfirmar={confirmarCita}
              ocupado={ocupado || formularioAbierto}
              onEditar={abrirFormulario}
              onEliminar={borrarCita}
            />
          ))
        ) : !cargando && !error ? (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            No se encontraron citas con ese estado.
          </p>
        ) : null}
      </section>
    </main>
  );
}