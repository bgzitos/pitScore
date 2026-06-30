import json
import os
import urllib.error
import urllib.request

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.environ.get("PITSCORE_BASE_URL", "http://localhost:3000")
API_URL = os.environ.get("PITSCORE_API_URL", "http://localhost:8080/api/estadios")
# base do backend (ex: http://localhost:8081)
API_BASE = "/".join(API_URL.split("/")[:3])

SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "..", "screenshots")
RESULTADOS_PATH = os.path.join(os.path.dirname(__file__), "..", "resultados.json")

NOME_TESTE = "Estadio Teste Selenium"
EMAIL_TESTE = "selenium@pitscore.com"
SENHA_TESTE = "senha1234"

resultados = []


# ── Utilitários ──────────────────────────────────────────────────────────────

def tirar_print(driver, caso_id):
    driver.save_screenshot(os.path.join(SCREENSHOT_DIR, f"{caso_id}.png"))


def registrar(caso_id, passou, mensagem):
    resultados.append({
        "caso": caso_id,
        "status": "Aprovado" if passou else "Reprovado",
        "mensagem": mensagem,
    })
    print(f"[{caso_id}] {'APROVADO' if passou else 'REPROVADO'} - {mensagem}")


def _requisicao_json(url, metodo="GET", dados=None):
    corpo = json.dumps(dados).encode() if dados else None
    cabecalhos = {"Content-Type": "application/json"} if corpo else {}
    req = urllib.request.Request(url, data=corpo, headers=cabecalhos, method=metodo)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def criar_usuario_teste():
    """Cria o usuário de teste se ainda não existir."""
    try:
        _requisicao_json(
            f"{API_BASE}/api/usuarios",
            metodo="POST",
            dados={"nome": "Selenium User", "email": EMAIL_TESTE, "senha": SENHA_TESTE},
        )
    except urllib.error.HTTPError as e:
        if e.code == 409:
            pass  # já existe — ok
        else:
            print(f"Aviso ao criar usuário de teste: {e}")
    except urllib.error.URLError as e:
        print(f"Aviso: backend inacessível ao criar usuário: {e}")


def limpar_estadio_teste():
    """Remove estádio de teste deixado por execuções anteriores."""
    try:
        estadios = _requisicao_json(API_URL)
        for estadio in estadios:
            if estadio["nome"] == NOME_TESTE:
                req = urllib.request.Request(f"{API_URL}/{estadio['id']}", method="DELETE")
                urllib.request.urlopen(req)
    except urllib.error.URLError as e:
        print(f"Aviso: não foi possível limpar dados anteriores: {e}")


def novo_driver():
    opcoes = Options()
    opcoes.add_argument("--headless=new")
    opcoes.add_argument("--no-sandbox")
    opcoes.add_argument("--window-size=1280,900")
    return webdriver.Chrome(options=opcoes)


# ── Helpers de navegação ─────────────────────────────────────────────────────

def fazer_login(driver, wait):
    """Faz login e aguarda o navbar aparecer."""
    driver.get(BASE_URL)
    wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(EMAIL_TESTE)
    driver.find_element(By.NAME, "senha").send_keys(SENHA_TESTE)
    driver.find_element(By.XPATH, "//button[contains(text(),'Entrar')]").click()
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "navbar")))


def ir_para_admin_estadios(driver, wait):
    """Navega até Admin > Estádios."""
    driver.get(BASE_URL)
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "navbar")))
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(@class,'nav-btn') and contains(text(),'Admin')]")
    )).click()
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(@class,'sidebar-btn') and contains(text(),'Estádios')]")
    )).click()
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "data-table")))


def abrir_modal_novo(driver, wait):
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(@class,'btn-new')]")
    )).click()
    wait.until(EC.presence_of_element_located((By.NAME, "nome")))


def preencher_formulario(driver, wait, nome, cidade, pais, capacidade):
    wait.until(EC.presence_of_element_located((By.NAME, "nome"))).send_keys(nome)
    driver.find_element(By.NAME, "cidade").send_keys(cidade)
    driver.find_element(By.NAME, "pais").send_keys(pais)
    driver.find_element(By.NAME, "capacidade").send_keys(capacidade)


def salvar_modal(driver):
    driver.find_element(By.XPATH, "//button[contains(@class,'btn-save')]").click()


# ── Casos de teste ────────────────────────────────────────────────────────────

def ct_001_cadastrar_com_dados_validos(driver, wait):
    ir_para_admin_estadios(driver, wait)
    abrir_modal_novo(driver, wait)
    preencher_formulario(driver, wait, NOME_TESTE, "Brasilia", "Brasil", "72788")
    salvar_modal(driver)

    ok = False
    msg_falha = "com texto 'cadastrado com sucesso' não foi exibido após salvar"
    try:
        wait.until(EC.presence_of_element_located((By.XPATH,
            "//div[contains(@class,'toast') and contains(text(),'cadastrado com sucesso')]"
        )))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-001")
    registrar("CT-001", ok,
              f"'cadastrado com sucesso' exibido para '{NOME_TESTE}'" if ok else msg_falha)


def ct_002_cadastrar_com_campos_obrigatorios_vazios(driver, wait):
    ir_para_admin_estadios(driver, wait)
    abrir_modal_novo(driver, wait)
    salvar_modal(driver)

    mensagens_esperadas = ["Nome é obrigatório", "Cidade é obrigatória", "Capacidade é obrigatória"]

    ausentes = []

    def todas_mensagens_presentes(d):
        ausentes.clear()
        for m in mensagens_esperadas:
            if not d.find_elements(By.XPATH, f"//*[contains(@class,'form-error') and contains(text(),'{m}')]"):
                ausentes.append(m)
        return len(ausentes) == 0

    ok = False
    try:
        wait.until(todas_mensagens_presentes)
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-002")
    registrar("CT-002", ok,
              "Mensagens de validação exibidas: " + ", ".join(f"'{m}'" for m in mensagens_esperadas)
              if ok else "Mensagens ausentes: " + ", ".join(f"'{m}'" for m in ausentes))


def ct_003_cadastrar_com_nome_duplicado(driver, wait):
    ir_para_admin_estadios(driver, wait)
    abrir_modal_novo(driver, wait)
    preencher_formulario(driver, wait, NOME_TESTE, "Brasilia", "Brasil", "72788")
    salvar_modal(driver)

    ok = False
    msg_falha = f"Mensagem de nome duplicado não exibida ao tentar cadastrar '{NOME_TESTE}' novamente"
    try:
        wait.until(EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(),'já cadastrado')]")
        ))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-003")
    registrar("CT-003", ok,
              f"Erro 'já cadastrado' exibido ao repetir nome '{NOME_TESTE}'" if ok else msg_falha)


def ct_004_consultar_listagem(driver, wait):
    ir_para_admin_estadios(driver, wait)
    linha_xpath = (
        f"//tr[td[text()='{NOME_TESTE}']]"
        "[td[text()='Brasilia']]"
        "[td[text()='Brasil']]"
        "[td[text()='72788']]"
    )
    ok = False
    msg_falha = f"Linha com nome='{NOME_TESTE}', cidade='Brasilia', país='Brasil', capacidade='72788' não encontrada na tabela"
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, linha_xpath)))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-004")
    registrar("CT-004", ok,
              f"'{NOME_TESTE}' listado com todos os dados corretos na tabela" if ok else msg_falha)


def ct_005_alterar_capacidade(driver, wait):
    ir_para_admin_estadios(driver, wait)
    linha = wait.until(EC.presence_of_element_located(
        (By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]")
    ))
    linha.find_element(By.XPATH, ".//button[@title='Editar']").click()

    campo_capacidade = wait.until(EC.presence_of_element_located((By.NAME, "capacidade")))
    campo_capacidade.clear()
    campo_capacidade.send_keys("80000")
    salvar_modal(driver)

    ok = False
    msg_falha = f"Capacidade de '{NOME_TESTE}' não foi atualizada para 80000 na listagem (toast 'alterado com sucesso' ou linha com novo valor não encontrados)"
    try:
        wait.until(EC.presence_of_element_located((By.XPATH,
            "//div[contains(@class,'toast') and contains(text(),'alterado com sucesso')]"
        )))
        wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//tr[td[text()='{NOME_TESTE}']][td[text()='80000']]")
        ))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-005")
    registrar("CT-005", ok,
              f"Capacidade de '{NOME_TESTE}' atualizada para 80000 e refletida na tabela" if ok else msg_falha)


def ct_006_excluir_estadio(driver, wait):
    ir_para_admin_estadios(driver, wait)
    linha = wait.until(EC.presence_of_element_located(
        (By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]")
    ))
    linha.find_element(By.XPATH, ".//button[@title='Excluir']").click()
    wait.until(EC.alert_is_present())
    driver.switch_to.alert.accept()

    ok = False
    msg_falha = f"'{NOME_TESTE}' ainda presente na tabela após exclusão (toast 'excluído com sucesso' ou remoção da linha não detectados)"
    try:
        wait.until(EC.presence_of_element_located((By.XPATH,
            "//div[contains(@class,'toast') and contains(text(),'excluído com sucesso')]"
        )))
        wait.until(lambda d: not d.find_elements(
            By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]"
        ))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-006")
    registrar("CT-006", ok,
              f"'{NOME_TESTE}' removido com sucesso e não aparece mais na tabela" if ok else msg_falha)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    print("Preparando ambiente de teste...")
    criar_usuario_teste()
    limpar_estadio_teste()

    driver = novo_driver()
    wait = WebDriverWait(driver, 15)
    try:
        print("Fazendo login...")
        fazer_login(driver, wait)

        ct_001_cadastrar_com_dados_validos(driver, wait)
        ct_002_cadastrar_com_campos_obrigatorios_vazios(driver, wait)
        ct_003_cadastrar_com_nome_duplicado(driver, wait)
        ct_004_consultar_listagem(driver, wait)
        ct_005_alterar_capacidade(driver, wait)
        ct_006_excluir_estadio(driver, wait)
    finally:
        driver.quit()

    with open(RESULTADOS_PATH, "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    aprovados = sum(1 for r in resultados if r["status"] == "Aprovado")
    print(f"\nResumo: {aprovados}/{len(resultados)} aprovados")
    for r in resultados:
        print(f"  {r['caso']}: {r['status']}")


if __name__ == "__main__":
    main()
