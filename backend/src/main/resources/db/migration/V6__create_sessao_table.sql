CREATE TABLE IF NOT EXISTS sessao (
    id           BIGSERIAL    PRIMARY KEY,
    token        VARCHAR(36)  NOT NULL UNIQUE,
    usuario_id   BIGINT       NOT NULL REFERENCES usuario(id),
    ativa        BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em    TIMESTAMP    NOT NULL DEFAULT NOW(),
    expira_em    TIMESTAMP    NOT NULL,
    encerrada_em TIMESTAMP
);