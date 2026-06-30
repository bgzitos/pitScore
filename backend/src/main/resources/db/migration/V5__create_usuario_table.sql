CREATE TABLE IF NOT EXISTS usuario (
    id                BIGSERIAL    PRIMARY KEY,
    nome              VARCHAR(100) NOT NULL,
    email             VARCHAR(100) NOT NULL UNIQUE,
    senha             VARCHAR(255) NOT NULL,
    perfil            VARCHAR(20)  NOT NULL DEFAULT 'USUARIO',
    tentativas_falhas INTEGER      NOT NULL DEFAULT 0,
    bloqueado_ate     TIMESTAMP,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);