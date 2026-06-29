package com.pitscore.backend.service;

import com.pitscore.backend.dto.EstadioDTO;
import com.pitscore.backend.model.Estadio;
import com.pitscore.backend.repository.EstadioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EstadioServiceTest {

    @Mock
    private EstadioRepository repository;

    @InjectMocks
    private EstadioService service;

    private Estadio estadio;
    private EstadioDTO dto;

    @BeforeEach
    void setUp() {
        estadio = new Estadio();
        estadio.setId(1L);
        estadio.setNome("Maracanã");
        estadio.setCidade("Rio de Janeiro");
        estadio.setPais("Brasil");
        estadio.setCapacidade(78838);

        dto = new EstadioDTO();
        dto.setNome("Maracanã");
        dto.setCidade("Rio de Janeiro");
        dto.setPais("Brasil");
        dto.setCapacidade(78838);
    }

    @Test
    void listarTodos_deveRetornarTodosOsEstadiosConvertidosParaDTO() {
        when(repository.findAll()).thenReturn(List.of(estadio));

        List<EstadioDTO> resultado = service.listarTodos();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getNome()).isEqualTo("Maracanã");
    }

    @Test
    void buscarPorId_deveRetornarEstadio_quandoIdExiste() {
        when(repository.findById(1L)).thenReturn(Optional.of(estadio));

        EstadioDTO resultado = service.buscarPorId(1L);

        assertThat(resultado.getNome()).isEqualTo("Maracanã");
        assertThat(resultado.getCapacidade()).isEqualTo(78838);
    }

    @Test
    void buscarPorId_deveLancarExcecao_quandoIdNaoExiste() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrado");
    }

    @Test
    void criar_deveSalvarEstadio_quandoNomeNaoExisteAinda() {
        when(repository.existsByNomeIgnoreCase("Maracanã")).thenReturn(false);
        when(repository.save(any(Estadio.class))).thenReturn(estadio);

        EstadioDTO resultado = service.criar(dto);

        assertThat(resultado.getNome()).isEqualTo("Maracanã");
        verify(repository).save(any(Estadio.class));
    }

    @Test
    void criar_deveLancarExcecao_quandoNomeJaCadastrado() {
        when(repository.existsByNomeIgnoreCase("Maracanã")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("já cadastrado");
        verify(repository, never()).save(any());
    }

    @Test
    void atualizar_deveAtualizarDados_quandoEstadioExiste() {
        EstadioDTO novosDados = new EstadioDTO();
        novosDados.setNome("Maracanã");
        novosDados.setCidade("Rio de Janeiro");
        novosDados.setPais("Brasil");
        novosDados.setCapacidade(80000);

        when(repository.findById(1L)).thenReturn(Optional.of(estadio));
        when(repository.save(any(Estadio.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EstadioDTO resultado = service.atualizar(1L, novosDados);

        assertThat(resultado.getCapacidade()).isEqualTo(80000);
    }

    @Test
    void atualizar_deveLancarExcecao_quandoEstadioNaoExiste() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.atualizar(99L, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrado");
    }

    @Test
    void deletar_deveRemoverEstadio_quandoIdExiste() {
        when(repository.existsById(1L)).thenReturn(true);

        service.deletar(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void deletar_deveLancarExcecao_quandoIdNaoExiste() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.deletar(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não encontrado");
        verify(repository, never()).deleteById(any());
    }
}
