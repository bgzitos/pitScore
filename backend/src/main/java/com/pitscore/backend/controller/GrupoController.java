package com.pitscore.backend.controller;

import com.pitscore.backend.dto.GrupoDTO;
import com.pitscore.backend.service.GrupoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@CrossOrigin(origins = "http://localhost:3000")
public class GrupoController {

    private final GrupoService service;

    public GrupoController(GrupoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<GrupoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
}
