import { useState } from "react";
import type { FormEvent } from "react";
import type { Cita, DatosCita, EstadoCita } from "../types";

type Props = {
  cita: Cita | null;
  guardando: boolean;
  onGuardar: (datos: DatosCita) => Promise<void>;
  onCancelar: () => void;
};

export function AppointmentForm({ cita, guardando, onGuardar, onCancelar }: Props) {
  const [datos, setDatos] = useState<DatosCita>({
    mascota: cita?.mascota ?? "",
    cliente: cita?.cliente ?? "",
    servicio: cita?.servicio ?? "",
    fecha: cita?.fecha?.slice(0, 10) ?? "",
    hora: cita?.hora?.slice(0, 5) ?? "",
    estado: cita?.estado ?? "solicitada",
  });

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guardando) return;
    void onGuardar({
      ...datos,
      mascota: datos.mascota.trim(),
      cliente: datos.cliente.trim(),
      servicio: datos.servicio.trim(),
    });
  }

  return (
    <form onSubmit={enviar} aria-labelledby="titulo-formulario"
      className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 id="titulo-formulario" className="mb-4 text-xl font-bold">
        {cita ? "Editar cita" : "Nueva cita"}
      </h3>
      <fieldset disabled={guardando} className="grid gap-4 sm:grid-cols-2">
        {(["mascota", "cliente", "servicio", "fecha", "hora"] as const).map((campo) => (
          <label key={campo} className="block font-semibold text-slate-700">
            {{ mascota: "Mascota", cliente: "Cliente", servicio: "Servicio", fecha: "Fecha", hora: "Hora" }[campo]}
            <input required name={campo}
              type={campo === "fecha" ? "date" : campo === "hora" ? "time" : "text"}
              pattern={campo === "fecha" || campo === "hora" ? undefined : ".*\\S.*"}
              value={datos[campo]}
              onChange={(event) => setDatos({ ...datos, [campo]: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" />
          </label>
        ))}
        <label className="block font-semibold text-slate-700">
          Estado
          <select value={datos.estado}
            onChange={(event) => setDatos({ ...datos, estado: event.target.value as EstadoCita })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal">
            <option value="solicitada">Solicitada</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
            {guardando ? "Guardando…" : "Guardar cita"}
          </button>
          <button type="button" onClick={onCancelar} className="rounded-xl border border-slate-300 px-5 py-3">
            Cancelar
          </button>
        </div>
      </fieldset>
    </form>
  );
}
