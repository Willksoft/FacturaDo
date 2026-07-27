-- ==============================================================================
-- FACTURADO S.R.L. - MÓDULO DE NÓMINA EMPRESARIAL COMPLETO & PERFILES FISCALES
-- SCRIPT DE ESQUEMA POSTGRESQL / SUPABASE (ENTORNO DE PRUEBAS: willksoft+test2026@gmail.com)
-- ==============================================================================

-- 1. TABLA DE EMPLEADOS CON CAMPOS MIGRATORIOS, MATRIZ FISCAL Y AISLAMIENTO DE USUARIO
CREATE TABLE IF NOT EXISTS payroll_employees (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(10) DEFAULT 'M',
  marital_status VARCHAR(50) DEFAULT 'Soltero/a',
  nationality VARCHAR(50) DEFAULT 'Dominicana',
  country_of_origin VARCHAR(100) DEFAULT 'República Dominicana',
  migratory_status VARCHAR(100) DEFAULT 'Ciudadano',
  identity_doc_type VARCHAR(100) DEFAULT 'Cédula',
  national_id VARCHAR(100) NOT NULL,
  doc_expiration_date DATE,
  doc_issuing_country VARCHAR(100) DEFAULT 'República Dominicana',
  birth_date DATE,
  rnc VARCHAR(100),
  address TEXT,
  province VARCHAR(100) DEFAULT 'Distrito Nacional',
  municipality VARCHAR(100) DEFAULT 'Santo Domingo',
  phone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(255),
  company VARCHAR(100) DEFAULT 'FacturaDo S.R.L.',
  branch VARCHAR(100) DEFAULT 'Sede Principal',
  department VARCHAR(100) DEFAULT 'Contabilidad y Finanzas',
  area VARCHAR(100) DEFAULT 'Administración',
  cost_center VARCHAR(50) DEFAULT 'CC-101',
  job_title VARCHAR(150) NOT NULL,
  supervisor_id VARCHAR(255),
  employee_type VARCHAR(50) DEFAULT 'Permanente',
  status VARCHAR(50) DEFAULT 'Activo',
  hire_date DATE NOT NULL,
  exit_date DATE,
  contract_type VARCHAR(50) DEFAULT 'Indefinido',
  exit_reason TEXT,

  -- PERFIL LABORAL Y MATRIZ DE REGLAS FISCALES INDIVIDUALES
  labor_profile_id VARCHAR(50) DEFAULT 'fijo',
  aplica_isr BOOLEAN DEFAULT TRUE,
  aplica_tss BOOLEAN DEFAULT TRUE,
  aplica_afp BOOLEAN DEFAULT TRUE,
  aplica_ars BOOLEAN DEFAULT TRUE,
  aplica_infotep BOOLEAN DEFAULT TRUE,
  aplica_regalia BOOLEAN DEFAULT TRUE,
  aplica_cesantia BOOLEAN DEFAULT TRUE,
  aplica_vacaciones BOOLEAN DEFAULT TRUE,
  aplica_prestaciones BOOLEAN DEFAULT TRUE,
  cotiza_seguridad_social BOOLEAN DEFAULT TRUE,
  es_exento_impuestos BOOLEAN DEFAULT FALSE,
  motivo_exencion VARCHAR(100) DEFAULT 'Ninguno',

  -- SALARIO Y DATOS BANCARIOS
  base_salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
  hourly_rate NUMERIC(15, 2) DEFAULT 0,
  daily_rate NUMERIC(15, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'DOP',
  payment_method VARCHAR(100) DEFAULT 'Transferencia Bancaria',
  bank_name VARCHAR(150) DEFAULT 'Banco Popular Dominicano',
  account_number VARCHAR(100),
  account_type VARCHAR(50) DEFAULT 'Ahorros',
  shift_type VARCHAR(50) DEFAULT 'Fijo',
  afp_name VARCHAR(100) DEFAULT 'AFP Popular',
  ars_name VARCHAR(100) DEFAULT 'ARS Humano',
  dependents_count INT DEFAULT 0,

  -- AISLAMIENTO DE ENTORNO DE PRUEBAS
  created_by_email VARCHAR(255) DEFAULT 'willksoft+test2026@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payroll_employees_created_by ON payroll_employees(created_by_email);
CREATE INDEX IF NOT EXISTS idx_payroll_employees_national_id ON payroll_employees(national_id);

-- 2. TABLA DE EXPEDIENTES DIGITALES
CREATE TABLE IF NOT EXISTS payroll_documents (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) REFERENCES payroll_employees(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  upload_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by_email VARCHAR(255) DEFAULT 'willksoft+test2026@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE PERÍODOS DE NÓMINA PROCESADOS
CREATE TABLE IF NOT EXISTS payroll_periods (
  id VARCHAR(255) PRIMARY KEY,
  period_name VARCHAR(150) NOT NULL,
  frequency VARCHAR(50) DEFAULT 'Quincenal',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Procesada',
  total_gross_salary NUMERIC(15, 2) DEFAULT 0,
  total_net_salary NUMERIC(15, 2) DEFAULT 0,
  total_employer_cost NUMERIC(15, 2) DEFAULT 0,
  created_by_email VARCHAR(255) DEFAULT 'willksoft+test2026@gmail.com',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE DETALLE DE PAGO INDIVIDUAL
CREATE TABLE IF NOT EXISTS payroll_details (
  id VARCHAR(255) PRIMARY KEY,
  period_id VARCHAR(255) REFERENCES payroll_periods(id) ON DELETE CASCADE,
  employee_id VARCHAR(255) REFERENCES payroll_employees(id) ON DELETE RESTRICT,
  employee_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  job_title VARCHAR(150),
  base_salary_period NUMERIC(15, 2) DEFAULT 0,
  gross_salary NUMERIC(15, 2) DEFAULT 0,
  afp_employee NUMERIC(15, 2) DEFAULT 0,
  ars_employee NUMERIC(15, 2) DEFAULT 0,
  isr_employee NUMERIC(15, 2) DEFAULT 0,
  total_deductions NUMERIC(15, 2) DEFAULT 0,
  net_salary NUMERIC(15, 2) DEFAULT 0,
  total_employer_cost NUMERIC(15, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT TRUE,
  created_by_email VARCHAR(255) DEFAULT 'willksoft+test2026@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE REGLAS INTELIGENTES
CREATE TABLE IF NOT EXISTS payroll_rules (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  condition_nationality VARCHAR(50),
  condition_migratory_status VARCHAR(100),
  set_aplica_isr BOOLEAN,
  set_aplica_tss BOOLEAN,
  set_aplica_afp BOOLEAN,
  set_aplica_ars BOOLEAN,
  set_cotiza_seguridad_social BOOLEAN,
  created_by_email VARCHAR(255) DEFAULT 'willksoft+test2026@gmail.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
