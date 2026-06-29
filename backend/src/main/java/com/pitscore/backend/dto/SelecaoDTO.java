package com.pitscore.backend.dto;

public class SelecaoDTO {

    private Long id;
    private String nome;
    private String pais;
    private String bandeira;
    private Long idGrupo;
    private String nomeGrupo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }

    public String getBandeira() { return bandeira; }
    public void setBandeira(String bandeira) { this.bandeira = bandeira; }

    public Long getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Long idGrupo) { this.idGrupo = idGrupo; }

    public String getNomeGrupo() { return nomeGrupo; }
    public void setNomeGrupo(String nomeGrupo) { this.nomeGrupo = nomeGrupo; }
}
