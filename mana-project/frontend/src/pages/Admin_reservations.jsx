import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";

const API_URL = "/api/reservations";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("TODAS");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });
      setReservations(response.data);
    } catch (error) {
      console.error("Error al cargar reservaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axios.patch(`${API_URL}/${id}/status`, { estado: newStatus }, {
        withCredentials: true,
      });
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, estado: newStatus } : r)
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado");
    } finally {
      setUpdating(null);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reservación?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la reservación");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    try {
      // Manejar diferentes formatos de fecha
      let date;
      if (dateStr.includes('T')) {
        // Formato ISO: 2025-12-09T00:00:00.000Z
        date = new Date(dateStr);
      } else {
        // Formato simple: 2025-12-09
        date = new Date(dateStr + 'T00:00:00');
      }

      if (isNaN(date.getTime())) return 'Fecha inválida';

      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Sin hora';
    try {
      // Puede venir como "14:30:00" o "14:30"
      const timeParts = timeStr.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1] || '00';

      if (isNaN(hours)) return 'Hora inválida';

      if (hours >= 12) {
        return `${hours === 12 ? 12 : hours - 12}:${minutes} PM`;
      }
      return `${hours}:${minutes} AM`;
    } catch (error) {
      return 'Hora inválida';
    }
  };

  const getStatusConfig = (estado) => {
    const configs = {
      PENDIENTE: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        icon: <AlertCircle size={14} />
      },
      CONFIRMADA: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        icon: <CheckCircle size={14} />
      },
      CANCELADA: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        icon: <XCircle size={14} />
      },
      COMPLETADA: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        icon: <CheckCircle size={14} />
      }
    };
    return configs[estado] || configs.PENDIENTE;
  };

  const filteredReservations = reservations.filter(r => {
    const matchesFilter = filter === "TODAS" || r.estado === filter;
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.telefono.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: reservations.length,
    pendientes: reservations.filter(r => r.estado === "PENDIENTE").length,
    confirmadas: reservations.filter(r => r.estado === "CONFIRMADA").length,
    completadas: reservations.filter(r => r.estado === "COMPLETADA").length
  };

  const getDetailFields = (reservation) => {
    const tipo = reservation.tipo_reserva;
    if (!tipo) return [];

    if (tipo === "Cumpleaños") {
      return [
        { label: "Tipo", value: tipo },
        { label: "Decoración", value: reservation.decoracion },
        { label: "Pastel", value: reservation.pastel },
        { label: "Edad homenajeado", value: reservation.edad_homenajeado },
      ];
    }

    if (tipo === "Negocios") {
      return [
        { label: "Tipo", value: tipo },
        { label: "Empresa", value: reservation.empresa },
        { label: "Proyector", value: reservation.requiere_proyector ? "Sí" : "No" },
        { label: "WiFi", value: reservation.requiere_wifi ? "Sí" : "No" },
        { label: "Zona privada", value: reservation.zona_privada ? "Sí" : "No" },
      ];
    }

    if (tipo === "Fiesta") {
      return [
        { label: "Tipo", value: tipo },
        { label: "Música", value: reservation.musica },
        { label: "Decoración", value: reservation.decoracion },
        { label: "Zona privada", value: reservation.zona_privada ? "Sí" : "No" },
      ];
    }

    if (tipo === "Reunion Familiar") {
      return [
        { label: "Tipo", value: tipo },
        { label: "Zona privada", value: reservation.zona_privada ? "Sí" : "No" },
        { label: "Observaciones", value: reservation.observaciones },
      ];
    }

    return [{ label: "Tipo", value: tipo }];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-100">
          <p className="text-yellow-600 text-sm">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.pendientes}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-green-600 text-sm">Confirmadas</p>
          <p className="text-3xl font-bold text-green-700">{stats.confirmadas}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
          <p className="text-blue-600 text-sm">Completadas</p>
          <p className="text-3xl font-bold text-blue-700">{stats.completadas}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="TODAS">Todas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="COMPLETADA">Completadas</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchReservations}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
          <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No hay reservaciones {filter !== "TODAS" ? `con estado ${filter}` : ""}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const statusConfig = getStatusConfig(reservation.estado);
            const isUpdating = updating === reservation.id;

            return (
              <div
                key={reservation.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User size={18} className="text-gray-400" />
                        {reservation.nombre}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        {statusConfig.icon}
                        {reservation.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-amber-600" />
                        {formatDate(reservation.fecha)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-amber-600" />
                        {formatTime(reservation.hora)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} className="text-amber-600" />
                        {reservation.personas} {reservation.personas === 1 ? 'persona' : 'personas'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-amber-600" />
                        {reservation.telefono}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} />
                      {reservation.email}
                    </div>

                    {getDetailFields(reservation).length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-2">Detalle de reserva</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {getDetailFields(reservation)
                            .filter((item) => item.value !== null && item.value !== undefined && item.value !== "")
                            .map((item) => (
                              <div key={`${reservation.id}-${item.label}`} className="text-gray-700">
                                <span className="font-semibold">{item.label}:</span> {item.value}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {reservation.estado === "PENDIENTE" && (
                      <>
                        <button
                          onClick={() => updateStatus(reservation.id, "CONFIRMADA")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateStatus(reservation.id, "CANCELADA")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                          Cancelar
                        </button>
                      </>
                    )}

                    {reservation.estado === "CONFIRMADA" && (
                      <button
                        onClick={() => updateStatus(reservation.id, "COMPLETADA")}
                        disabled={isUpdating}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Completar
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${reservation.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-sm font-medium transition"
                    >
                      <Phone size={14} />
                      WhatsApp
                    </a>

                    <button
                      onClick={() => deleteReservation(reservation.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                    >
                      <XCircle size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
