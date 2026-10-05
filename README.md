# Cadastro de veículos

Trabalho de DevOps com uma API em NestJS, uma página em React e um banco PostgreSQL. A API permite cadastrar, listar, buscar, atualizar e excluir veículos. A página mostra os veículos em uma tabela.


## Requisitos

- Docker Desktop
- Docker Compose 
- Internet para baixar as dependências na primeira execução.

## Pastas do projeto

- `api/`: código da API e seu Dockerfile.
- `front/`: página React e seu Dockerfile.
- `deploy/`: configuração do Docker Compose.

O `compose.yaml` da raiz carrega a configuração de `deploy/`.

## Como executar

Abra o terminal na pasta do projeto e execute:

```sh
docker compose up --build -d
```

Na primeira vez pode demorar um pouco. Para conferir os containers:

```sh
docker compose ps
```

Depois, acesse:

- Página: http://localhost:8080
- API: http://localhost:3000/vehicles
- Swagger: http://localhost:3000/docs

O Swagger é a página usada para testar as rotas da API.

O projeto já tem valores padrão para rodar localmente. Se quiser mudar as portas ou os dados do banco, copie o exemplo no PowerShell:

```powershell
Copy-Item deploy/.env.example deploy/.env
```

Edite `deploy/.env` antes de iniciar os containers. Não envie esse arquivo para o GitHub. O arquivo `api/.env.example` serve de modelo caso execute a API fora do Docker.

## Rotas da API

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/vehicles` | Lista todos os veículos |
| GET | `/vehicles/:id` | Busca um veículo pelo ID |
| POST | `/vehicles` | Cadastra um veículo |
| PATCH | `/vehicles/:id` | Atualiza um veículo |
| DELETE | `/vehicles/:id` | Exclui um veículo |

O `:id` deve ser substituído pelo número do veículo, por exemplo `/vehicles/1`.

Para cadastrar, envie um JSON assim:

```json
{
  "plate": "ABC1D23",
  "model": "Toyota Corolla",
  "year": 2022,
  "mileage": 45000
}
```

A tabela `vehicles` possui os campos `id`, `plate`, `model`, `year` e `mileage`. O ID é gerado automaticamente. Os demais campos são obrigatórios: placa com até 10 caracteres (convertida para maiúsculas), modelo com até 120 caracteres, ano inteiro entre 1886 e 9999 e quilometragem inteira entre 0 e 2147483647 km.

Exemplo de resposta ao cadastrar (status 201):

```json
{
  "id": 1,
  "plate": "ABC1D23",
  "model": "Toyota Corolla",
  "year": 2022,
  "mileage": 45000
}
```

Exemplo de resposta ao listar (status 200):

```json
[
  {
    "id": 1,
    "plate": "ABC1D23",
    "model": "Toyota Corolla",
    "year": 2022,
    "mileage": 45000
  }
]
```

A busca por ID e a atualização retornam um veículo com status 200. A exclusão retorna status 204, sem conteúdo. Dados inválidos retornam 400. Se o veículo não existir, a API retorna 404.

## Como testar

1. Abra o Swagger e escolha `POST /vehicles`.
2. Clique em **Try it out**, preencha o JSON e clique em **Execute**.
3. Abra a página React e clique em **Atualizar** para ver o veículo.
4. Teste a busca, a atualização e a exclusão no Swagger usando o ID recebido.

Para atualizar apenas a quilometragem, use o PATCH com:

```json
{
  "mileage": 46000
}
```

Também existe um teste automático opcional. Com Node instalado e os containers rodando, execute:

```sh
node deploy/teste.mjs
```

## Banco e redes

O banco usa o nome `produtos`, usuário `devops` e senha local `devops_local`. A porta externa é `5432`. O nome do banco foi mantido para compatibilidade com volumes existentes; os veículos são armazenados na tabela `vehicles`.

O Compose cria duas redes:

- `banco`: liga a API ao PostgreSQL.
- `web`: liga o front à API.


Os dados ficam no volume `postgres_data`. A tabela é criada automaticamente pelo TypeORM, biblioteca usada pela API para acessar o banco. O Compose verifica se o banco está pronto antes de iniciar a API, e se a API está pronta antes de iniciar o front.

Para testar se os dados foram mantidos, cadastre um veículo, pare com `docker compose down` e inicie novamente. O veículo deve continuar na lista.

## Como parar

Para parar os containers e manter os dados:

```sh
docker compose down
```

Para remover também o volume e apagar os dados:

```sh
docker compose down --volumes
```
