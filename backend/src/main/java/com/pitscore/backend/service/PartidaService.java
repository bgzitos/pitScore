package com.pitscore.backend.service;

import com.pitscore.backend.dto.PartidaDTO;
import com.pitscore.backend.model.Estadio;
import com.pitscore.backend.model.Grupo;
import com.pitscore.backend.model.Partida;
import com.pitscore.backend.model.Selecao;
import com.pitscore.backend.repository.EstadioRepository;
import com.pitscore.backend.repository.GrupoRepository;
import com.pitscore.backend.repository.PartidaRepository;
import com.pitscore.backend.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PartidaService {

    private static final Set<String> FASES_VALIDAS =
            Set.of("Grupos", "Oitavas", "Quartas", "Semifinal", "Final");
    private static final Set<String> STATUS_VALIDOS =
            Set.of("Agendada", "Em andamento", "Encerrada");
    private static final String STATUS_PADRAO = "Agendada";

    private final PartidaRepository partidaRepository;
    private final SelecaoRepository selecaoRepository;
    private final EstadioRepository estadioRepository;
    private final GrupoRepository grupoRepository;

    public PartidaService(PartidaRepository partidaRepository, SelecaoRepository selecaoRepository,
                           EstadioRepository estadioRepository, GrupoRepository grupoRepository) {
        this.partidaRepository = partidaRepository;
        this.selecaoRepository = selecaoRepository;
        this.estadioRepository = estadioRepository;
        this.grupoRepository = grupoRepository;
    }

    public List<PartidaDTO> listarTodos() {
        return partidaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PartidaDTO buscarPorId(Long id) {
        return toDTO(buscarEntidadePorId(id));
    }

    public PartidaDTO criar(PartidaDTO dto) {
        Partida partida = new Partida();
        aplicarDados(partida, dto);
        return toDTO(partidaRepository.save(partida));
    }

    public PartidaDTO atualizar(Long id, PartidaDTO dto) {
        Partida partida = buscarEntidadePorId(id);
        aplicarDados(partida, dto);
        return toDTO(partidaRepository.save(partida));
    }

    public void deletar(Long id) {
        if (!partidaRepository.existsById(id)) {
            throw new RuntimeException("Partida não encontrada com id: " + id);
        }
        partidaRepository.deleteById(id);
    }

    private void aplicarDados(Partida partida, PartidaDTO dto) {
        if (dto.getIdSelecaoMandante().equals(dto.getIdSelecaoVisitante())) {
            throw new RuntimeException("Seleção mandante e visitante devem ser diferentes");
        }
        if (!FASES_VALIDAS.contains(dto.getFase())) {
            throw new RuntimeException("Fase inválida: " + dto.getFase());
        }
        String status = dto.getStatus() == null || dto.getStatus().isBlank() ? STATUS_PADRAO : dto.getStatus();
        if (!STATUS_VALIDOS.contains(status)) {
            throw new RuntimeException("Status inválido: " + status);
        }

        Selecao mandante = buscarSelecao(dto.getIdSelecaoMandante());
        Selecao visitante = buscarSelecao(dto.getIdSelecaoVisitante());
        Estadio estadio = buscarEstadio(dto.getIdEstadio());
        Grupo grupo = dto.getIdGrupo() != null ? buscarGrupo(dto.getIdGrupo()) : null;

        partida.setDataHora(dto.getDataHora());
        partida.setFase(dto.getFase());
        partida.setPlacarMandante(dto.getPlacarMandante());
        partida.setPlacarVisitante(dto.getPlacarVisitante());
        partida.setStatus(status);
        partida.setSelecaoMandante(mandante);
        partida.setSelecaoVisitante(visitante);
        partida.setEstadio(estadio);
        partida.setGrupo(grupo);
    }

    private Partida buscarEntidadePorId(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida não encontrada com id: " + id));
    }

    private Selecao buscarSelecao(Long id) {
        return selecaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seleção não encontrada com id: " + id));
    }

    private Estadio buscarEstadio(Long id) {
        return estadioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estádio não encontrado com id: " + id));
    }

    private Grupo buscarGrupo(Long id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado com id: " + id));
    }

    private PartidaDTO toDTO(Partida partida) {
        PartidaDTO dto = new PartidaDTO();
        dto.setId(partida.getId());
        dto.setDataHora(partida.getDataHora());
        dto.setFase(partida.getFase());
        dto.setPlacarMandante(partida.getPlacarMandante());
        dto.setPlacarVisitante(partida.getPlacarVisitante());
        dto.setStatus(partida.getStatus());

        dto.setIdSelecaoMandante(partida.getSelecaoMandante().getId());
        dto.setNomeSelecaoMandante(partida.getSelecaoMandante().getNome());
        dto.setIdSelecaoVisitante(partida.getSelecaoVisitante().getId());
        dto.setNomeSelecaoVisitante(partida.getSelecaoVisitante().getNome());
        dto.setIdEstadio(partida.getEstadio().getId());
        dto.setNomeEstadio(partida.getEstadio().getNome());

        if (partida.getGrupo() != null) {
            dto.setIdGrupo(partida.getGrupo().getId());
            dto.setNomeGrupo(partida.getGrupo().getNome());
        }
        return dto;
    }
}
