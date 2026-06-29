package com.pitscore.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partida")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false, length = 30)
    private String fase;

    @Column(name = "placar_mandante")
    private Integer placarMandante;

    @Column(name = "placar_visitante")
    private Integer placarVisitante;

    @Column(nullable = false, length = 20)
    private String status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_selecao_mandante", nullable = false)
    private Selecao selecaoMandante;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_selecao_visitante", nullable = false)
    private Selecao selecaoVisitante;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_estadio", nullable = false)
    private Estadio estadio;

    @ManyToOne
    @JoinColumn(name = "id_grupo")
    private Grupo grupo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getFase() { return fase; }
    public void setFase(String fase) { this.fase = fase; }

    public Integer getPlacarMandante() { return placarMandante; }
    public void setPlacarMandante(Integer placarMandante) { this.placarMandante = placarMandante; }

    public Integer getPlacarVisitante() { return placarVisitante; }
    public void setPlacarVisitante(Integer placarVisitante) { this.placarVisitante = placarVisitante; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Selecao getSelecaoMandante() { return selecaoMandante; }
    public void setSelecaoMandante(Selecao selecaoMandante) { this.selecaoMandante = selecaoMandante; }

    public Selecao getSelecaoVisitante() { return selecaoVisitante; }
    public void setSelecaoVisitante(Selecao selecaoVisitante) { this.selecaoVisitante = selecaoVisitante; }

    public Estadio getEstadio() { return estadio; }
    public void setEstadio(Estadio estadio) { this.estadio = estadio; }

    public Grupo getGrupo() { return grupo; }
    public void setGrupo(Grupo grupo) { this.grupo = grupo; }
}
