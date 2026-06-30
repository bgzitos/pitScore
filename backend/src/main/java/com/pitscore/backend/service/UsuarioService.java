package com.pitscore.backend.service;

import com.pitscore.backend.dto.LoginDTO;
import com.pitscore.backend.dto.LoginRespostaDTO;
import com.pitscore.backend.dto.UsuarioCadastroDTO;
import com.pitscore.backend.dto.UsuarioRespostaDTO;
import com.pitscore.backend.model.Sessao;
import com.pitscore.backend.model.Usuario;
import com.pitscore.backend.repository.SessaoRepository;
import com.pitscore.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UsuarioService {

    // RF002: depois de 5 tentativas erradas, bloqueia por 1 minuto
    private static final int MAX_TENTATIVAS = 5;
    private static final long MINUTOS_DE_BLOQUEIO = 1;

    private final UsuarioRepository usuarioRepository;
    private final SessaoRepository sessaoRepository;

    // RNF005: a senha precisa ser salva com bcrypt, fator de custo 12
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public UsuarioService(UsuarioRepository usuarioRepository, SessaoRepository sessaoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.sessaoRepository = sessaoRepository;
    }

    // RF001 - Cadastrar Usuário
    public UsuarioRespostaDTO cadastrar(UsuarioCadastroDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado: " + dto.getEmail());
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil("USUARIO");

        usuario = usuarioRepository.save(usuario);

        return toRespostaDTO(usuario);
    }

    // RF002 - Realizar Login
    public LoginRespostaDTO login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.getEmail());

        if (usuario == null) {
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        // verifica se a conta está bloqueada por excesso de tentativas
        if (usuario.getBloqueadoAte() != null) {
            if (usuario.getBloqueadoAte().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Conta bloqueada. Tente novamente em alguns instantes");
            } else {
                // o bloqueio já passou, libera de novo
                usuario.setBloqueadoAte(null);
                usuario.setTentativasFalhas(0);
            }
        }

        boolean senhaCorreta = passwordEncoder.matches(dto.getSenha(), usuario.getSenha());

        if (!senhaCorreta) {
            int tentativas = usuario.getTentativasFalhas() + 1;
            usuario.setTentativasFalhas(tentativas);

            if (tentativas >= MAX_TENTATIVAS) {
                usuario.setBloqueadoAte(LocalDateTime.now().plusMinutes(MINUTOS_DE_BLOQUEIO));
                usuario.setTentativasFalhas(0);
            }

            usuarioRepository.save(usuario);
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        // login deu certo, zera as tentativas
        usuario.setTentativasFalhas(0);
        usuario.setBloqueadoAte(null);
        usuarioRepository.save(usuario);

        // cria uma sessão nova pro usuário
        Sessao sessao = new Sessao();
        sessao.setToken(UUID.randomUUID().toString());
        sessao.setUsuarioId(usuario.getId());
        sessao.setAtiva(true);
        sessao.setExpiraEm(LocalDateTime.now().plusHours(24));
        sessaoRepository.save(sessao);

        UsuarioRespostaDTO usuarioDto = toRespostaDTO(usuario);

        LoginRespostaDTO resposta = new LoginRespostaDTO();
        resposta.setToken(sessao.getToken());
        resposta.setUsuario(usuarioDto);
        return resposta;
    }

    // RF003 - Realizar Logout
    public void logout(String token) {
        Sessao sessao = sessaoRepository.findByTokenAndAtivaTrue(token);

        if (sessao == null) {
            throw new RuntimeException("Sessão inválida ou já encerrada");
        }

        sessao.setAtiva(false);
        sessao.setEncerradaEm(LocalDateTime.now());
        sessaoRepository.save(sessao);
    }

    private UsuarioRespostaDTO toRespostaDTO(Usuario usuario) {
        UsuarioRespostaDTO dto = new UsuarioRespostaDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setPerfil(usuario.getPerfil());
        dto.setCriadoEm(usuario.getCriadoEm());
        return dto;
    }
}