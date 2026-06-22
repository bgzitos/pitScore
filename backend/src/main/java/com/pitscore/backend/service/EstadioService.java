package com.pitscore.backend.service;

import com.pitscore.backend.dto.EstadioDTO;
import com.pitscore.backend.model.Estadio;
import com.pitscore.backend.repository.EstadioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadioService {

    private final EstadioRepository repository;

    public EstadioService(EstadioRepository repository) {
        this.repository = repository;
    }

    public List<EstadioDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EstadioDTO buscarPorId(Long id) {
        Estadio estadio = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estádio não encontrado com id: " + id));
        return toDTO(estadio);
    }

    public EstadioDTO criar(EstadioDTO dto) {
        Estadio estadio = toEntity(dto);
        return toDTO(repository.save(estadio));
    }

    public EstadioDTO atualizar(Long id, EstadioDTO dto) {
        Estadio estadio = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estádio não encontrado com id: " + id));
        estadio.setNome(dto.getNome());
        estadio.setCidade(dto.getCidade());
        estadio.setPais(dto.getPais());
        estadio.setCapacidade(dto.getCapacidade());
        return toDTO(repository.save(estadio));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Estádio não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }

    private EstadioDTO toDTO(Estadio estadio) {
        EstadioDTO dto = new EstadioDTO();
        dto.setId(estadio.getId());
        dto.setNome(estadio.getNome());
        dto.setCidade(estadio.getCidade());
        dto.setPais(estadio.getPais());
        dto.setCapacidade(estadio.getCapacidade());
        return dto;
    }

    private Estadio toEntity(EstadioDTO dto) {
        Estadio estadio = new Estadio();
        estadio.setNome(dto.getNome());
        estadio.setCidade(dto.getCidade());
        estadio.setPais(dto.getPais());
        estadio.setCapacidade(dto.getCapacidade());
        return estadio;
    }
}