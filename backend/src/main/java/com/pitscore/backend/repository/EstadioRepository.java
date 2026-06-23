package com.pitscore.backend.repository;

import com.pitscore.backend.model.Estadio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadioRepository extends JpaRepository<Estadio, Long> {

    boolean existsByNomeIgnoreCase(String nome);
}