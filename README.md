# Electrodead

Sistema web para gerenciamento de banda, com frontend React, backend Node.js/Express e banco PostgreSQL.

## 1. Visao geral da aplicacao

O sistema centraliza dados administrativos da banda Electrodead:

- membros;
- instrumentos;
- eventos;
- ingressos;
- financeiro;
- presencas;
- dashboard gerencial;
- login com senha criptografada e JWT.

## 2. Arquitetura Docker

O projeto usa tres servicos no Docker Compose:

- `frontend`: Nginx em Alpine, servindo o build React e encaminhando `/api` para o backend.
- `backend`: Node.js em Alpine, executando a API Express.
- `postgres`: PostgreSQL 16 em Alpine, com volume nomeado para persistencia.

Fluxo:

```text
Navegador -> localhost:3000 -> frontend/nginx -> /api -> backend:3000 -> postgres:5432
```

## 3. Como executar

Na raiz do projeto:

```bash
docker compose up --build
```

Se sua instalacao usa Compose antigo:

```bash
docker-compose up --build
```

Depois acesse:

```text
http://localhost:3000
```

Login inicial:

```text
Usuario: admin
Senha: 123456
```

## 4. Evidencias recomendadas para a avaliacao

Status dos containers:

```bash
docker compose ps
```

Logs da aplicacao:

```bash
docker compose logs backend
docker compose logs frontend
```

Teste de conectividade interna por DNS Docker:

```bash
docker compose exec frontend curl -f http://backend:3000/health
docker compose exec backend node -e "require('dns').lookup('postgres', console.log)"
```

Teste do banco por dentro da rede Docker:

```bash
docker compose exec postgres pg_isready -U postgres -d banda_db
```

Teste no navegador:

```text
http://localhost:3000
http://localhost:3000/health
```

## 5. Resiliencia e persistencia

O Compose possui:

- `restart: unless-stopped` nos servicos;
- healthcheck no frontend;
- healthcheck no backend;
- healthcheck no PostgreSQL;
- `depends_on` com `condition: service_healthy`;
- volume nomeado `electrodead_postgres_data`.

O volume garante que os dados do banco sobrevivam a recriacao do container.

## 6. Seguranca

Medidas aplicadas no projeto:

- backend nao expoe porta publica diretamente no Compose;
- frontend e backend se comunicam por rede interna Docker;
- banco acessa a aplicacao pelo DNS interno `postgres`;
- senha de usuario armazenada com hash bcrypt;
- autenticacao por token JWT;
- execucao do backend com usuario nao-root (`USER node`);
- `.env`, `node_modules`, caches e arquivos locais ignorados pelo Git.

Observacao: para producao, `JWT_SECRET`, senhas e credenciais devem ser trocadas por segredos reais fora do repositorio.

## 7. Limpeza

Parar containers:

```bash
docker compose down
```

Parar e apagar tambem o volume do banco:

```bash
docker compose down -v
```

## 8. Estrutura principal

```text
frontend/          Interface React
src/               Backend Express
src/db/            Conexao e migracoes SQL
scripts/           Scripts de apoio, migracao e admin inicial
infra/nginx.conf   Configuracao do proxy Nginx
Dockerfile         Build multi-stage frontend/backend
docker-compose.yml Orquestracao dos containers
```

## 9. AWS / Cloud

Para uma implantacao em AWS, a arquitetura recomendada seria:

- frontend estatico em S3 + CloudFront com HTTPS;
- backend em EC2 ou container;
- banco em Amazon RDS PostgreSQL;
- VPC `10.0.0.0/16`;
- subnet publica para web/backend;
- subnet privada para banco;
- Security Group do banco aceitando porta 5432 somente do Security Group do backend;
- MFA ativo na conta root;
- Billing Alarm de US$ 5.00 em `us-east-1`;
- cleanup de EC2, AMIs, snapshots, Elastic IPs e NAT Gateways apos a avaliacao.

## 10. Rodar sem Docker

Use apenas se a maquina ja tiver Node.js, npm e PostgreSQL instalados:

```bash
npm install
npm --prefix frontend install
npm run build:frontend
npm run db:migrate
npm run admin:create
npm start
```
