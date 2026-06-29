package com.pitscore.backend.service;

import com.pitscore.backend.dto.GrupoDTO;
import com.pitscore.backend.model.Grupo;
import com.pitscore.backend.repository.GrupoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrupoService {

    private final GrupoRepository repository;

    public GrupoService(GrupoRepository repository) {
        this.repository = repository;
    }

    public List<GrupoDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private GrupoDTO toDTO(Grupo grupo) {
        GrupoDTO dto = new GrupoDTO();
        dto.setId(grupo.getId());
        dto.setNome(grupo.getNome());
        return dto;
    }
}
