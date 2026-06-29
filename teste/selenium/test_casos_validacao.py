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
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "..", "screenshots")
RESULTADOS_PATH = os.path.join(os.path.dirname(__file__), "..", "resultados.json")
NOME_TESTE = "Estadio Teste Selenium"

resultados = []


def tirar_print(driver, caso_id):
    driver.save_screenshot(os.path.join(SCREENSHOT_DIR, f"{caso_id}.png"))


def registrar(caso_id, passou, mensagem):
    resultados.append({
        "caso": caso_id,
        "status": "Aprovado" if passou else "Reprovado",
        "mensagem": mensagem,
    })
    print(f"[{caso_id}] {'APROVADO' if passou else 'REPROVADO'} - {mensagem}")


def limpar_estadio_teste():
    try:
        with urllib.request.urlopen(API_URL) as resposta:
            estadios = json.loads(resposta.read())
        for estadio in estadios:
            if estadio["nome"] == NOME_TESTE:
                requisicao = urllib.request.Request(f"{API_URL}/{estadio['id']}", method="DELETE")
                urllib.request.urlopen(requisicao)
    except urllib.error.URLError as erro:
        print(f"Aviso: não foi possível limpar dados de execuções anteriores: {erro}")


def novo_driver():
    opcoes = Options()
    opcoes.add_argument("--headless=new")
    opcoes.add_argument("--no-sandbox")
    opcoes.add_argument("--window-size=1280,900")
    return webdriver.Chrome(options=opcoes)


def preencher_formulario(driver, wait, nome, cidade, pais, capacidade):
    wait.until(EC.presence_of_element_located((By.NAME, "nome"))).send_keys(nome)
    driver.find_element(By.NAME, "cidade").send_keys(cidade)
    driver.find_element(By.NAME, "pais").send_keys(pais)
    driver.find_element(By.NAME, "capacidade").send_keys(capacidade)


def ct_001_cadastrar_com_dados_validos(driver, wait):
    driver.get(BASE_URL)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Novo Estádio']"))).click()
    preencher_formulario(driver, wait, NOME_TESTE, "Brasilia", "Brasil", "72788")
    driver.find_element(By.XPATH, "//button[text()='Salvar']").click()

    ok = False
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//p[contains(text(),'cadastrado com sucesso')]")))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-001")
    registrar("CT-001", ok, "Mensagem de sucesso exibida" if ok else "Mensagem de sucesso não encontrada")


def ct_002_cadastrar_com_campos_obrigatorios_vazios(driver, wait):
    driver.get(BASE_URL)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Novo Estádio']"))).click()
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Salvar']"))).click()

    mensagens_esperadas = ["Nome é obrigatório", "Cidade é obrigatória", "Capacidade é obrigatória"]

    def todas_mensagens_presentes(d):
        return all(d.find_elements(By.XPATH, f"//span[contains(text(),'{m}')]") for m in mensagens_esperadas)

    ok = False
    try:
        wait.until(todas_mensagens_presentes)
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-002")
    registrar("CT-002", ok, "Mensagens de validação exibidas" if ok else "Mensagens de validação ausentes")


def ct_003_cadastrar_com_nome_duplicado(driver, wait):
    driver.get(BASE_URL)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Novo Estádio']"))).click()
    preencher_formulario(driver, wait, NOME_TESTE, "Brasilia", "Brasil", "72788")
    driver.find_element(By.XPATH, "//button[text()='Salvar']").click()

    ok = False
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//p[contains(text(),'já cadastrado')]")))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-003")
    registrar("CT-003", ok, "Mensagem de nome duplicado exibida" if ok else "Mensagem de nome duplicado não encontrada")


def ct_004_consultar_listagem(driver, wait):
    driver.get(BASE_URL)
    linha_xpath = (
        f"//tr[td[text()='{NOME_TESTE}']][td[text()='Brasilia']]"
        "[td[text()='Brasil']][td[text()='72788']]"
    )
    ok = False
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, linha_xpath)))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-004")
    registrar("CT-004", ok, "Estádio listado com os dados cadastrados" if ok else "Estádio não encontrado na listagem")


def ct_005_alterar_capacidade(driver, wait):
    driver.get(BASE_URL)
    linha = wait.until(EC.presence_of_element_located((By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]")))
    linha.find_element(By.XPATH, ".//button[text()='Editar']").click()

    campo_capacidade = wait.until(EC.presence_of_element_located((By.NAME, "capacidade")))
    campo_capacidade.clear()
    campo_capacidade.send_keys("80000")
    driver.find_element(By.XPATH, "//button[text()='Salvar']").click()

    ok = False
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//p[contains(text(),'alterado com sucesso')]")))
        tirar_print(driver, "CT-005")
        wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//tr[td[text()='{NOME_TESTE}']][td[text()='80000']]")
        ))
        ok = True
    except Exception:
        tirar_print(driver, "CT-005")
    registrar("CT-005", ok, "Capacidade atualizada e refletida na listagem" if ok else "Atualização não refletida na listagem")


def ct_006_excluir_estadio(driver, wait):
    driver.get(BASE_URL)
    linha = wait.until(EC.presence_of_element_located((By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]")))
    linha.find_element(By.XPATH, ".//button[text()='Excluir']").click()
    wait.until(EC.alert_is_present())
    driver.switch_to.alert.accept()

    ok = False
    try:
        wait.until(EC.presence_of_element_located((By.XPATH, "//p[contains(text(),'excluído com sucesso')]")))
        wait.until_not(EC.presence_of_element_located((By.XPATH, f"//tr[td[text()='{NOME_TESTE}']]")))
        ok = True
    except Exception:
        pass
    tirar_print(driver, "CT-006")
    registrar("CT-006", ok, "Estádio removido da listagem" if ok else "Estádio ainda presente na listagem")


def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    limpar_estadio_teste()

    driver = novo_driver()
    wait = WebDriverWait(driver, 10)
    try:
        ct_001_cadastrar_com_dados_validos(driver, wait)
        ct_002_cadastrar_com_campos_obrigatorios_vazios(driver, wait)
        ct_003_cadastrar_com_nome_duplicado(driver, wait)
        ct_004_consultar_listagem(driver, wait)
        ct_005_alterar_capacidade(driver, wait)
        ct_006_excluir_estadio(driver, wait)
    finally:
        driver.quit()

    with open(RESULTADOS_PATH, "w", encoding="utf-8") as arquivo:
        json.dump(resultados, arquivo, ensure_ascii=False, indent=2)

    print("\nResumo da execução:")
    for resultado in resultados:
        print(f"  {resultado['caso']}: {resultado['status']}")


if __name__ == "__main__":
    main()
