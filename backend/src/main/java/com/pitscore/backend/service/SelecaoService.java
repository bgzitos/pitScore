package com.pitscore.backend.service;

import com.pitscore.backend.dto.SelecaoDTO;
import com.pitscore.backend.model.Selecao;
import com.pitscore.backend.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SelecaoService {

    private final SelecaoRepository repository;

    public SelecaoService(SelecaoRepository repository) {
        this.repository = repository;
    }

    public List<SelecaoDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SelecaoDTO buscarPorId(Long id) {
        Selecao selecao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seleção não encontrada com id: " + id));
        return toDTO(selecao);
    }

    private SelecaoDTO toDTO(Selecao selecao) {
        SelecaoDTO dto = new SelecaoDTO();
        dto.setId(selecao.getId());
        dto.setNome(selecao.getNome());
        dto.setPais(selecao.getPais());
        dto.setBandeira(selecao.getBandeira());
        dto.setIdGrupo(selecao.getGrupo().getId());
        dto.setNomeGrupo(selecao.getGrupo().getNome());
        return dto;
    }
}
