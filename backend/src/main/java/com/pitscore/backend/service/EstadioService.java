package com.pitscore.backend.service;

import com.pitscore.backend.dto.EstadioDTO;
import com.pitscore.backend.model.Estadio;
import com.pitscore.backend.repository.EstadioRepository;
import com.pitscore.backend.repository.PartidaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadioService {

    private final EstadioRepository repository;
    private final PartidaRepository partidaRepository;

    public EstadioService(EstadioRepository repository, PartidaRepository partidaRepository) {
        this.repository = repository;
        this.partidaRepository = partidaRepository;
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
        if (repository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new RuntimeException("Estádio já cadastrado com o nome: " + dto.getNome());
        }
        return toDTO(repository.save(toEntity(dto)));
    }

    public EstadioDTO atualizar(Long id, EstadioDTO dto) {
        Estadio estadio = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estádio não encontrado com id: " + id));

        if (!estadio.getNome().equalsIgnoreCase(dto.getNome()) &&
                repository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new RuntimeException("Já existe um estádio com o nome: " + dto.getNome());
        }

        estadio.setNome(dto.getNome());
        estadio.setCidade(dto.getCidade());
        estadio.setPais(dto.getPais());
        estadio.setCapacidade(dto.getCapacidade());
        return toDTO(repository.save(estadio));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estádio não encontrado com id: " + id);
        }
        if (partidaRepository.existsByEstadioId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Estádio não pode ser excluído pois está vinculado a uma ou mais partidas.");
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