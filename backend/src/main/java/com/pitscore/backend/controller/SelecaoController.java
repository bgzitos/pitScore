package com.pitscore.backend.controller;

import com.pitscore.backend.dto.SelecaoDTO;
import com.pitscore.backend.service.SelecaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/selecoes")
@CrossOrigin(origins = "http://localhost:3000")
public class SelecaoController {

    private final SelecaoService service;

    public SelecaoController(SelecaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SelecaoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SelecaoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }
}
