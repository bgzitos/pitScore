CREATE TABLE IF NOT EXISTS grupo (
    id_grupo BIGSERIAL    PRIMARY KEY,
    nome     VARCHAR(20)  NOT NULL UNIQUE
);

INSERT INTO grupo (nome) VALUES
    ('Grupo A'), ('Grupo B'), ('Grupo C'), ('Grupo D'),
    ('Grupo E'), ('Grupo F'), ('Grupo G'), ('Grupo H'),
    ('Grupo I'), ('Grupo J'), ('Grupo K'), ('Grupo L');
