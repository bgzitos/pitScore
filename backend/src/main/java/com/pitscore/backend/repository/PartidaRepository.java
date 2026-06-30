package com.pitscore.backend.repository;

import com.pitscore.backend.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {

    boolean existsByEstadioId(Long estadioId);
}
