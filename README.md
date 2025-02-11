# Introduction
This project is made to do the migrations of the database

# Getting Started
To start up this project, do this steps:
1. Install Knex globally
    ```shell
    npm i -g knex
    ```
2. Install dependencies
    ```shell
    npm i
    ```

# What to do?

## Docker 

You can use the Docker to up and run locally a database image. 

If you decide use the Docker, create a file called `docker-compose.yml` in the root of project.

Bellow has a sample of `docker-compose.yml` file that can be used as template, this template use postgres as DB, but you can change to any other DB.

```yml
version: "3.8"

services:
  db:
    image: postgres # or any other database like mysql
    restart: always
    container_name: my-container-db
    environment:
      POSTGRES_PASSWORD: growdev2024
      POSTGRES_USER: growdev
      POSTGRES_DB: db-migrations
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - 5432:5432
    volumes:
      - postgres:/var/lib/postgresql/data
    networks:
      - my-container-db


networks:
  my-container-db:
    driver: bridge

volumes:
  postgres:
```
After, run:

  ```shell
  docker compose up
  ```

## Migrate

### Make a Migrate
To create a new migration
  ```shell
  knex migrate:make create_new_table_structure
  ```

Edit the new file created on `migrations/20200304152912_create_new_table_structure.js`

> **Important 1**: When you will create a new migration, follow this pattern, `create_{table}_structure` to create table, `alter_{table}_structure` to alter table.

> **Important 2**: Create one migrate for table.

Do this pattern
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('grade_category', function (table) {
    table.increments('id').primary();
    table.string('name', 64).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('grade_category');
};
```

If you need create a FK, you can use the helper `foreignFields`
```javascript
const foreignFields = require('../../helpers/foreignFields');

exports.up = function(knex) {
  return knex.schema.createTable('grade_category_academic_main', function (table) {
    table.increments('id').primary();
    table.integer('academic_main_id').notNullable();
    foreignFields(table, {inTable: 'academic_main'});
  });
};
```
> **Important 3**: All the formats to call a function `foreignFields`, do the same results. The function will create a `FK` with `index` with the pattern `fk-${table._tableName}-${_field}-${target}-${_target_field}` resulting in `fk_grade_category_academic_main_academic_main_id_academic_main_id`

If you need create a auditory fields, you can use the helper `auditoryFields`
```javascript
const { basics, /*all, created, updated, deleted*/ } = require('../helpers/auditoryFields.js');

exports.up = function(knex) {
  return knex.schema.createTable('grade_book', function (table) {
    table.increments('id').primary();

    basics(knex, table);
    // OR all(knex, table);
    // OR created(knex, table);
    // OR updated(knex, table);
    // OR deleted(knex, table);
  });
};
```
> **Important 4**: The basics will create the collumns `created_by` and `updated_by` with `FK` with `user.uid` and `created_at` and `updated_at` with timestamps

### List Migrations
```shell
knex migrate:list
```

### Run up Migrate
To execute up first migration not performed
```shell
knex migrate:up
```
You can run a specific migration doing this
```shell
knex migrate:up 20200304152912_create_new_table_structure.js
```
To run all migrations not performed
```shell
knex migrate:latest
```

### Run down Migrate
To execute down last migration performed
```shell
knex migrate:down
```
You can run down a specific migration doing this
```shell
knex migrate:down 20200304152912_create_new_table_structure.js
```
To rollback last migrate performed
```shell
knex migrate:rollback
```

## Seed

Seed is used to tables with a domain values

### Make a Seed
> **Important 5**: To create a new seed file, we recommend create the file without _CLI_, because we need execute the seeds in order

To create the seed file, you will need create a blank file named with this pattern: `XX_table.js`
```shell
touch seeds/01_language.js
```

Into the file, you will need this pattern
```javascript
exports.seed = function(knex) {
  return knex('language').insert([
    {id: 'en', name: 'Inglês'},
    {id: 'es', name: 'Espanhol'},
    {id: 'pt-BR', name: 'Português (Brasil)'}
  ]).onConflict('id').merge();
};

```

### Run a Seed
To run de seed
```shell
knex seed:run
```

### Run a specific Seed
```shell
knex seed:run --specific=03_justifications.js
```

# Throubleshoot
Maybe you don't have installed the package [Knex](https://www.npmjs.com/package/knex) globally, have two solution to this throubleshoot

1. Using `npx`
  ```shell
  npx knex migrate:status
  ```
2. Installing globally
  ```shell
  npm i -g knex
  ```

# For more informations
http://knexjs.org/#Migrations
