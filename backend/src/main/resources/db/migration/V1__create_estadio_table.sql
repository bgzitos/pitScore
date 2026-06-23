CREATE TABLE IF NOT EXISTS estadio (
    id            BIGSERIAL    PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    cidade        VARCHAR(100) NOT NULL,
    pais          VARCHAR(100) NOT NULL,
    capacidade    INTEGER      NOT NULL CHECK (capacidade > 0),
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);