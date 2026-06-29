CREATE TABLE IF NOT EXISTS partida (
    id_partida           BIGSERIAL    PRIMARY KEY,
    data_hora            TIMESTAMP    NOT NULL,
    fase                 VARCHAR(30)  NOT NULL
        CHECK (fase IN ('Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final')),
    placar_mandante      INTEGER
        CHECK (placar_mandante IS NULL OR placar_mandante >= 0),
    placar_visitante     INTEGER
        CHECK (placar_visitante IS NULL OR placar_visitante >= 0),
    status               VARCHAR(20)  NOT NULL DEFAULT 'Agendada'
        CHECK (status IN ('Agendada', 'Em andamento', 'Encerrada')),
    id_selecao_mandante  BIGINT       NOT NULL REFERENCES selecao(id_selecao),
    id_selecao_visitante BIGINT       NOT NULL REFERENCES selecao(id_selecao),
    id_estadio           BIGINT       NOT NULL REFERENCES estadio(id),
    id_grupo             BIGINT       REFERENCES grupo(id_grupo),
    criado_em            TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em        TIMESTAMP    NOT NULL DEFAULT NOW(),
    CHECK (id_selecao_mandante <> id_selecao_visitante)
);
