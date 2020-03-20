# Cockroachdb express knex tut

## Start insecure cockroachdb

cockroach start --insecure --host=localhost

## Create database and user

cockroach sql --insecure --host=localhost

CREATE DATABASE webstore;

CREATE DATABASE test_webstore;

CREATE ROLE maxroach;

GRANT ALL ON DATABASE webstore TO maxroach;

GRANT ALL ON DATABASE test_webstore TO maxroach;

## Install dependencies

npm install

## Run migrations

npx knex migrate:latest

## Run the tests

npm t
