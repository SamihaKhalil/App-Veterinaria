import type { Cita } from '../types';
import { StatusBadge } from './StatusBadge';

type Props = {
  cita: Cita;
  ocupado: boolean;
  onConfirmar: (id: number) => void;
  onEditar: (cita: Cita) => void;
  onEliminar: (cita: Cita) => void;
};

export function AppointmentCard({ cita, ocupado, onConfirmar, onEditar, onEliminar }: Props) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{cita.mascota}</h3>
            <StatusBadge estado={cita.estado} />
          </div>
          <p className="mt-2 text-sm text-slate-600">Cliente: {cita.cliente}</p>
          <p className="text-sm text-slate-600">{cita.servicio} · {cita.fecha?.slice(0, 10)} · {cita.hora}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cita.estado === 'solicitada' && (
            <button disabled={ocupado} onClick={() => onConfirmar(cita.id)}
              className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
              Confirmar cita
            </button>
          )}
          <button disabled={ocupado} onClick={() => onEditar(cita)}
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:opacity-50">
            Editar
          </button>
          <button disabled={ocupado} onClick={() => onEliminar(cita)}
            className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-700 disabled:opacity-50">
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
