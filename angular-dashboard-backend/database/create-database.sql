-- Run this once against your local SQL Server Express instance (.\SQLEXPRESS)
-- with Windows Authentication, e.g. from sqlcmd:
--
--   sqlcmd -S .\SQLEXPRESS -E -i create-database.sql
--
-- or open it in SQL Server Management Studio / Azure Data Studio connected to
-- .\SQLEXPRESS with Windows Authentication and execute it.
--
-- Tables (users, roles, user_roles) are created automatically by Hibernate
-- (spring.jpa.hibernate.ddl-auto=update) the first time the backend starts —
-- this script only needs to create the empty database itself.

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'angular_dashboard')
BEGIN
    CREATE DATABASE angular_dashboard;
END
GO
