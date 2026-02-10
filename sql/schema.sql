USE master;
GO

IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'challenge')
  DROP DATABASE challenge;
GO

CREATE DATABASE challenge;
GO

USE challenge;
GO

CREATE TABLE jobs (
  job_id UNIQUEIDENTIFIER PRIMARY KEY,
  file_path NVARCHAR(255),
  created_at DATETIME DEFAULT GETDATE()
);

GO

CREATE TABLE job_chunks (
  chunk_id UNIQUEIDENTIFIER PRIMARY KEY,
  job_id UNIQUEIDENTIFIER,
  from_line INT,
  to_line INT,
  status VARCHAR(20),
  FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);

GO

CREATE TABLE clientes (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  NombreCompleto NVARCHAR(100) NOT NULL,
  DNI BIGINT NOT NULL,
  Estado VARCHAR(10) NOT NULL,
  FechaIngreso DATE NOT NULL,
  EsPEP BIT NOT NULL,
  EsSujetoObligado BIT NULL,
  FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

GO