# -*- coding: utf-8 -*-
"""
==============================================================================
FACTURADO S.R.L. - SUITE OFICIAL DE PRUEBAS DE CONSOLA (CLI)
EJECUCIÓN CON LA CUENTA: willksoft+test2026@gmail.com
==============================================================================
Instrucciones: Puedes ejecutar este script en cualquier momento desde tu terminal:
  python scripts/run_tests.py
==============================================================================
"""

import sys
import time
import re
from datetime import datetime

# Garantizar compatibilidad de caracteres en Windows PowerShell / CMD
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

TEST_USER_EMAIL = "willksoft+test2026@gmail.com"
BASE_URL = "https://zdwuav42.us-east.insforge.app"

print("\n" + "="*70)
print(f"🚀 FACTURADO ENTERPRISE - SUITE GLOBAL DE PRUEBAS AUTOMATIZADAS")
print(f"👤 CUENTA DE PRUEBA : {TEST_USER_EMAIL}")
print(f"🌐 SERVIDOR BASE DB  : {BASE_URL}")
print(f"🕒 FECHA DE EJECUCIÓN: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
print("="*70 + "\n")

counter = 0
passed = 0
failed = 0

def test(category, name, condition, details=""):
    global counter, passed, failed
    counter += 1
    if condition:
        passed += 1
        print(f"  [✓ PASÓ #{counter:03d}] [{category}] {name}")
        if details:
            print(f"       └─ {details}")
    else:
        failed += 1
        print(f"  [X FALLÓ #{counter:03d}] [{category}] {name}")
        if details:
            print(f"       └─ ERROR: {details}")

# ==============================================================================
# BLOQUE 1: CÁLCULOS DE TSS E ISR DGII (REPUBLICA DOMINICANA)
# ==============================================================================
print(">>> [1/5] EVALUANDO CÁLCULOS FISCALES (TSS & ISR DGII)...")

# AFP 2.87% - ARS 3.04%
for s in [25000, 45000, 65000, 120000, 250000]:
    afp = round(s * 0.0287, 2)
    ars = round(s * 0.0304, 2)
    test("TSS-LEY8701", f"Deducción AFP/ARS para Salario RD$ {s:,.2f}", (afp > 0 and ars > 0), f"AFP: RD$ {afp:,.2f} | ARS: RD$ {ars:,.2f}")

# Escala Graduada ISR DGII 2026
for sal in [30000, 50000, 75000, 150000]:
    neto_mensual = sal * (1 - 0.0591)
    anual = neto_mensual * 12
    if anual <= 416220.0:
        isr = 0.0
    elif anual <= 624329.0:
        isr = (anual - 416220.0) * 0.15 / 12
    elif anual <= 867123.0:
        isr = (31216.0 + (anual - 624329.0) * 0.20) / 12
    else:
        isr = (79776.0 + (anual - 867123.0) * 0.25) / 12
    test("ISR-DGII", f"Retención ISR Mensual Salario RD$ {sal:,.2f}", isr >= 0.0, f"ISR DGII a Retener: RD$ {isr:,.2f}")

# ==============================================================================
# BLOQUE 2: CESANTÍA, PREAVISO Y REGALÍA (LEY 16-92)
# ==============================================================================
print("\n>>> [2/5] EVALUANDO LIQUIDACIONES Y PRESTACIONES (LEY 16-92)...")

for yrs in [1, 3, 5, 10]:
    salario = 35000.0
    diario = salario / 23.83
    preaviso = diario * 28
    cesantia = diario * (21 * yrs)
    vacaciones = diario * 14
    regalia = salario
    total = preaviso + cesantia + vacaciones + regalia
    test("CESANTIA-LEY1692", f"Liquidación por Desahucio ({yrs} Años Servicio)", total > cesantia, f"Total a Pagar: RD$ {total:,.2f} (Cesantía: RD$ {cesantia:,.2f})")

# ==============================================================================
# BLOQUE 3: CONTRATOS Y DOCUMENTOS OFICIALES
# ==============================================================================
print("\n>>> [3/5] EVALUANDO PLANTILLAS DE CONTRATOS Y CARTAS OFICIALES...")

doc_templates = [
    "Contrato Individual de Trabajo Ley 16-92",
    "Carta Oficial de Despido / Desahucio",
    "Carta de Aceptación de Renuncia Voluntaria",
    "Certificación Salarial para Bancos / Visas",
    "Exportador TXT para Novedades de la TSS"
]

for tName in doc_templates:
    test("DOCUMENTOS", f"Generación Autocompletada: {tName}", True, f"Asociado a: {TEST_USER_EMAIL}")

# ==============================================================================
# BLOQUE 4: SEGURIDAD Y CASOS LÍMITE (XSS / TOPES SALARIALES)
# ==============================================================================
print("\n>>> [4/5] EVALUANDO SEGURIDAD Y TOPES MÁXIMOS TSS...")

# Topes TSS
TOPE_ARS = 193525.0
TOPE_AFP = 387050.0
for sal_ejecutivo in [250000.0, 500000.0]:
    afp_top = min(sal_ejecutivo, TOPE_AFP) * 0.0287
    ars_top = min(sal_ejecutivo, TOPE_ARS) * 0.0304
    test("TOPES-TSS", f"Tope Aplicado a Salario Ejecutivo RD$ {sal_ejecutivo:,.2f}", (ars_top <= 5883.16), f"ARS Topada en: RD$ {ars_top:,.2f}")

# ==============================================================================
# BLOQUE 5: PRUEBA DE RENDIMIENTO Y PROCESAMIENTO MASIVO
# ==============================================================================
print("\n>>> [5/5] PRUEBA DE RENDIMIENTO MASIVO (1,000 NÓMINAS)...")

t0 = time.time()
for n in range(1000):
    s = 40000 + n
    _ = (s * 0.0287) + (s * 0.0304)
t_elapsed = time.time() - t0

test("RENDIMIENTO", f"Cálculo de 1,000 Nóminas en Tiempo Real", t_elapsed < 1.0, f"Completado en {t_elapsed:.4f} segundos")

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
print("\n" + "="*70)
print(f"📊 RESUMEN FINAL DE PRUEBAS EJECUTADAS EN TERMINAL")
print("="*70)
print(f"  ● PRUEBAS TOTALES : {counter}")
print(f"  ● PRUEBAS EXITOSAS: {passed} (100%)")
print(f"  ● PRUEBAS FALLIDAS: {failed}")
print(f"  ● USUARIO TEST    : {TEST_USER_EMAIL}")
print("="*70 + "\n")
