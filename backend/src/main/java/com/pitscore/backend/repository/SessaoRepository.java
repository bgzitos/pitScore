package com.pitscore.backend.repository;

import com.pitscore.backend.model.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao, Long> {

    Sessao findByTokenAndAtivaTrue(String token);
}