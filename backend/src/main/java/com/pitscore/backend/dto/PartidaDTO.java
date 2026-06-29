package com.pitscore.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class PartidaDTO {

    private Long id;

    @NotNull(message = "Data e hora são obrigatórias")
    private LocalDateTime dataHora;

    @NotBlank(message = "Fase é obrigatória")
    private String fase;

    @Min(value = 0, message = "Placar do mandante não pode ser negativo")
    private Integer placarMandante;

    @Min(value = 0, message = "Placar do visitante não pode ser negativo")
    private Integer placarVisitante;

    private String status;

    @NotNull(message = "Seleção mandante é obrigatória")
    private Long idSelecaoMandante;
    private String nomeSelecaoMandante;

    @NotNull(message = "Seleção visitante é obrigatória")
    private Long idSelecaoVisitante;
    private String nomeSelecaoVisitante;

    @NotNull(message = "Estádio é obrigatório")
    private Long idEstadio;
    private String nomeEstadio;

    private Long idGrupo;
    private String nomeGrupo;

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

    public Long getIdSelecaoMandante() { return idSelecaoMandante; }
    public void setIdSelecaoMandante(Long idSelecaoMandante) { this.idSelecaoMandante = idSelecaoMandante; }

    public String getNomeSelecaoMandante() { return nomeSelecaoMandante; }
    public void setNomeSelecaoMandante(String nomeSelecaoMandante) { this.nomeSelecaoMandante = nomeSelecaoMandante; }

    public Long getIdSelecaoVisitante() { return idSelecaoVisitante; }
    public void setIdSelecaoVisitante(Long idSelecaoVisitante) { this.idSelecaoVisitante = idSelecaoVisitante; }

    public String getNomeSelecaoVisitante() { return nomeSelecaoVisitante; }
    public void setNomeSelecaoVisitante(String nomeSelecaoVisitante) { this.nomeSelecaoVisitante = nomeSelecaoVisitante; }

    public Long getIdEstadio() { return idEstadio; }
    public void setIdEstadio(Long idEstadio) { this.idEstadio = idEstadio; }

    public String getNomeEstadio() { return nomeEstadio; }
    public void setNomeEstadio(String nomeEstadio) { this.nomeEstadio = nomeEstadio; }

    public Long getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Long idGrupo) { this.idGrupo = idGrupo; }

    public String getNomeGrupo() { return nomeGrupo; }
    public void setNomeGrupo(String nomeGrupo) { this.nomeGrupo = nomeGrupo; }
}
