package com.pitscore.backend.service;

import com.pitscore.backend.dto.PartidaDTO;
import com.pitscore.backend.model.Estadio;
import com.pitscore.backend.model.Grupo;
import com.pitscore.backend.model.Partida;
import com.pitscore.backend.model.Selecao;
import com.pitscore.backend.repository.EstadioRepository;
import com.pitscore.backend.repository.GrupoRepository;
import com.pitscore.backend.repository.PartidaRepository;
import com.pitscore.backend.repository.SelecaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PartidaServiceTest {

    @Mock
    private PartidaRepository partidaRepository;
    @Mock
    private SelecaoRepository selecaoRepository;
    @Mock
    private EstadioRepository estadioRepository;
    @Mock
    private GrupoRepository grupoRepository;

    @InjectMocks
    private PartidaService service;

    private Selecao mandante;
    private Selecao visitante;
    private Estadio estadio;
    private Grupo grupo;
    private PartidaDTO dto;

    @BeforeEach
    void setUp() {
        mandante = new Selecao();
        mandante.setId(1L);
        mandante.setNome("Brasil");

        visitante = new Selecao();
        visitante.setId(2L);
        visitante.setNome("Argentina");

        estadio = new Estadio();
        estadio.setId(1L);
        estadio.setNome("Maracanã");

        grupo = new Grupo();
        grupo.setId(1L);
        grupo.setNome("Grupo A");

        dto = new PartidaDTO();
        dto.setDataHora(LocalDateTime.of(2026, 6, 15, 16, 0));
        dto.setFase("Grupos");
        dto.setIdSelecaoMandante(1L);
        dto.setIdSelecaoVisitante(2L);
        dto.setIdEstadio(1L);
        dto.setIdGrupo(1L);
    }

    @Test
    void criar_deveSalvarPartida_quandoDadosValidos() {
        when(selecaoRepository.findById(1L)).thenReturn(Optional.of(mandante));
        when(selecaoRepository.findById(2L)).thenReturn(Optional.of(visitante));
        when(estadioRepository.findById(1L)).thenReturn(Optional.of(estadio));
        when(grupoRepository.findById(1L)).thenReturn(Optional.of(grupo));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PartidaDTO resultado = service.criar(dto);

        assertThat(resultado.getNomeSelecaoMandante()).isEqualTo("Brasil");
        assertThat(resultado.getNomeSelecaoVisitante()).isEqualTo("Argentina");
        assertThat(resultado.getStatus()).isEqualTo("Agendada");
        verify(partidaRepository).save(any(Partida.class));
    }

    @Test
    void criar_deveLancarExcecao_quandoMandanteEVisitanteForemIguais() {
        dto.setIdSelecaoVisitante(1L);

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("diferentes");
        verify(partidaRepository, never()).save(any());
    }

    @Test
    void criar_deveLancarExcecao_quandoFaseInvalida() {
        dto.setFase("Fase Inexistente");

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Fase inválida");
        verify(partidaRepository, never()).save(any());
    }

    @Test
    void criar_deveLancarExcecao_quandoSelecaoMandanteNaoExiste() {
        when(selecaoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Seleção não encontrada");
    }

    @Test
    void criar_deveLancarExcecao_quandoEstadioNaoExiste() {
        when(selecaoRepository.findById(1L)).thenReturn(Optional.of(mandante));
        when(selecaoRepository.findById(2L)).thenReturn(Optional.of(visitante));
        when(estadioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Estádio não encontrado");
    }

    @Test
    void criar_devePermitirPartidaSemGrupo_quandoFaseDeMataMata() {
        dto.setFase("Final");
        dto.setIdGrupo(null);
        when(selecaoRepository.findById(1L)).thenReturn(Optional.of(mandante));
        when(selecaoRepository.findById(2L)).thenReturn(Optional.of(visitante));
        when(estadioRepository.findById(1L)).thenReturn(Optional.of(estadio));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PartidaDTO resultado = service.criar(dto);

        assertThat(resultado.getIdGrupo()).isNull();
        verify(grupoRepository, never()).findById(any());
    }

    @Test
    void buscarPorId_deveLancarExcecao_quandoPartidaNaoExiste() {
        when(partidaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrada");
    }

    @Test
    void atualizar_deveAtualizarPlacarEStatus_quandoPartidaExiste() {
        Partida partidaExistente = new Partida();
        partidaExistente.setId(10L);
        partidaExistente.setSelecaoMandante(mandante);
        partidaExistente.setSelecaoVisitante(visitante);
        partidaExistente.setEstadio(estadio);

        dto.setPlacarMandante(2);
        dto.setPlacarVisitante(1);
        dto.setStatus("Encerrada");

        when(partidaRepository.findById(10L)).thenReturn(Optional.of(partidaExistente));
        when(selecaoRepository.findById(1L)).thenReturn(Optional.of(mandante));
        when(selecaoRepository.findById(2L)).thenReturn(Optional.of(visitante));
        when(estadioRepository.findById(1L)).thenReturn(Optional.of(estadio));
        when(grupoRepository.findById(1L)).thenReturn(Optional.of(grupo));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PartidaDTO resultado = service.atualizar(10L, dto);

        assertThat(resultado.getPlacarMandante()).isEqualTo(2);
        assertThat(resultado.getPlacarVisitante()).isEqualTo(1);
        assertThat(resultado.getStatus()).isEqualTo("Encerrada");
    }

    @Test
    void deletar_deveRemoverPartida_quandoIdExiste() {
        when(partidaRepository.existsById(10L)).thenReturn(true);

        service.deletar(10L);

        verify(partidaRepository).deleteById(10L);
    }

    @Test
    void deletar_deveLancarExcecao_quandoIdNaoExiste() {
        when(partidaRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.deletar(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrada");
        verify(partidaRepository, never()).deleteById(any());
    }

    @Test
    void listarTodos_deveRetornarTodasAsPartidas() {
        Partida partida = new Partida();
        partida.setId(1L);
        partida.setSelecaoMandante(mandante);
        partida.setSelecaoVisitante(visitante);
        partida.setEstadio(estadio);
        partida.setGrupo(grupo);
        partida.setFase("Grupos");
        partida.setStatus("Agendada");

        when(partidaRepository.findAll()).thenReturn(List.of(partida));

        List<PartidaDTO> resultado = service.listarTodos();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNomeGrupo()).isEqualTo("Grupo A");
    }
}
