CREATE TABLE IF NOT EXISTS selecao (
    id_selecao    BIGSERIAL    PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL UNIQUE,
    pais          VARCHAR(100) NOT NULL,
    bandeira      VARCHAR(255),
    id_grupo      BIGINT       NOT NULL REFERENCES grupo(id_grupo),
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO selecao (nome, pais, id_grupo) VALUES
    ('Brasil', 'Brasil', 1), ('Argentina', 'Argentina', 1), ('França', 'França', 1), ('Inglaterra', 'Inglaterra', 1),
    ('Espanha', 'Espanha', 2), ('Alemanha', 'Alemanha', 2), ('Portugal', 'Portugal', 2), ('Holanda', 'Holanda', 2),
    ('Itália', 'Itália', 3), ('Bélgica', 'Bélgica', 3), ('Croácia', 'Croácia', 3), ('Uruguai', 'Uruguai', 3),
    ('Marrocos', 'Marrocos', 4), ('Japão', 'Japão', 4), ('Coreia do Sul', 'Coreia do Sul', 4), ('México', 'México', 4),
    ('Estados Unidos', 'Estados Unidos', 5), ('Canadá', 'Canadá', 5), ('Senegal', 'Senegal', 5), ('Gana', 'Gana', 5),
    ('Nigéria', 'Nigéria', 6), ('Egito', 'Egito', 6), ('Argélia', 'Argélia', 6), ('Tunísia', 'Tunísia', 6),
    ('Camarões', 'Camarões', 7), ('Austrália', 'Austrália', 7), ('Arábia Saudita', 'Arábia Saudita', 7), ('Catar', 'Catar', 7),
    ('Irã', 'Irã', 8), ('Equador', 'Equador', 8), ('Colômbia', 'Colômbia', 8), ('Chile', 'Chile', 8),
    ('Paraguai', 'Paraguai', 9), ('Peru', 'Peru', 9), ('Suíça', 'Suíça', 9), ('Dinamarca', 'Dinamarca', 9),
    ('Polônia', 'Polônia', 10), ('Sérvia', 'Sérvia', 10), ('Turquia', 'Turquia', 10), ('Ucrânia', 'Ucrânia', 10),
    ('Costa Rica', 'Costa Rica', 11), ('Jamaica', 'Jamaica', 11), ('Panamá', 'Panamá', 11), ('Nova Zelândia', 'Nova Zelândia', 11),
    ('China', 'China', 12), ('Iraque', 'Iraque', 12), ('Honduras', 'Honduras', 12), ('Trinidad e Tobago', 'Trinidad e Tobago', 12);
