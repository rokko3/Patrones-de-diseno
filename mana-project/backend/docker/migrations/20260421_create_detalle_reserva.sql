CREATE TABLE IF NOT EXISTS detalle_reserva (
  id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  tipo_reserva ENUM('Reunion Familiar','Cumpleaños','Negocios','Fiesta') NOT NULL,
  decoracion VARCHAR(150) DEFAULT NULL,
  pastel VARCHAR(150) DEFAULT NULL,
  edad_homenajeado INT DEFAULT NULL,
  empresa VARCHAR(150) DEFAULT NULL,
  requiere_proyector TINYINT(1) DEFAULT 0,
  requiere_wifi TINYINT(1) DEFAULT 0,
  musica VARCHAR(150) DEFAULT NULL,
  zona_privada TINYINT(1) DEFAULT 0,
  observaciones TEXT,
  PRIMARY KEY (id),
  UNIQUE KEY uk_detalle_reserva_id (reserva_id),
  KEY idx_detalle_tipo_reserva (tipo_reserva),
  CONSTRAINT fk_detalle_reserva_reserva
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
