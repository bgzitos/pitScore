package com.pitscore.backend.repository;

import com.pitscore.backend.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelecaoRepository extends JpaRepository<Selecao, Long> {
}
