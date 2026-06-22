package com.pitscore.backend.controller;

import com.pitscore.backend.dto.EstadioDTO;
import com.pitscore.backend.service.EstadioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estadios")
@CrossOrigin(origins = "http://localhost:3000")
public class EstadioController {

    private final EstadioService service;

    public EstadioController(EstadioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EstadioDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<EstadioDTO> criar(@Valid @RequestBody EstadioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstadioDTO> atualizar(@PathVariable Long id, @Valid @RequestBody EstadioDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}