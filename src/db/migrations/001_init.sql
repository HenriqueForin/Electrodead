CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  role VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS membros (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  data_nasc DATE,
  cpf VARCHAR(11) UNIQUE,
  telefone VARCHAR(11) UNIQUE,
  endereco TEXT,
  funcao VARCHAR(50),
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instrumentos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  modelo VARCHAR(100),
  estado VARCHAR(20) NOT NULL DEFAULT 'ok' CHECK (estado IN ('danificado', 'reparado', 'ok')),
  info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membro_instrumento (
  membro_id BIGINT NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
  instrumento_id BIGINT NOT NULL REFERENCES instrumentos(id) ON DELETE CASCADE,
  PRIMARY KEY (membro_id, instrumento_id)
);

CREATE TABLE IF NOT EXISTS reparos (
  id BIGSERIAL PRIMARY KEY,
  instrumento_id BIGINT NOT NULL REFERENCES instrumentos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  data_reparo DATE NOT NULL DEFAULT CURRENT_DATE,
  custo NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (custo >= 0)
);

CREATE TABLE IF NOT EXISTS eventos (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  local VARCHAR(255),
  valor_recebido NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (valor_recebido >= 0)
);

CREATE TABLE IF NOT EXISTS ingressos (
  id BIGSERIAL PRIMARY KEY,
  evento_id BIGINT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('vip', 'comum')),
  meta INT NOT NULL DEFAULT 0 CHECK (meta >= 0),
  quantd_vendida INT NOT NULL DEFAULT 0 CHECK (quantd_vendida >= 0),
  preco NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (preco >= 0)
);

CREATE TABLE IF NOT EXISTS orcamentos (
  id BIGSERIAL PRIMARY KEY,
  evento_id BIGINT REFERENCES eventos(id) ON DELETE SET NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('credito', 'debito')),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT,
  quantia NUMERIC(10, 2) NOT NULL CHECK (quantia >= 0)
);

CREATE TABLE IF NOT EXISTS presencas (
  id BIGSERIAL PRIMARY KEY,
  membro_id BIGINT NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
  data_presenca DATE NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('show', 'ensaio', 'reuniao')),
  presente BOOLEAN NOT NULL DEFAULT TRUE,
  observacao TEXT
);

CREATE INDEX IF NOT EXISTS idx_membros_nome ON membros(nome);
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data);
CREATE INDEX IF NOT EXISTS idx_presencas_membro_data ON presencas(membro_id, data_presenca);
CREATE INDEX IF NOT EXISTS idx_orcamentos_data ON orcamentos(data);

INSERT INTO roles (role)
VALUES ('admin'), ('membro'), ('gerente')
ON CONFLICT (role) DO NOTHING;
