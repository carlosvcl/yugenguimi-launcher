# Site YugenYumi — 16.6.1-dev

Site estático baseado na versão V3 fornecida para o projeto, preservando navegação, galeria e identidade YugenYumi. **Pré-lançamento:** o download público continua desativado até aprovação da release, testes Windows e definição de uma URL real.

## Visualização local

Na pasta `site/`, execute `python -m http.server 8000` e acesse `http://localhost:8000/`. O JavaScript não utiliza APIs de backend. Todos os caminhos de recursos são relativos e funcionam em um subdiretório do GitHub Pages.

## Deploy (não executado)

O arquivo `.github/workflows/pages.yml` na raiz do projeto publica SOMENTE a pasta `site/` quando o dono autorizar o envio para a branch principal. Primeiro configure Settings > Pages > Build and deployment > Source: GitHub Actions. Antes de qualquer push, confirme repositório, visibilidade, acesso e URL pública. A publicação não é efetuada por este pacote.

## Publicar um download

Depois de validar um release real, atualize `site/site-config.js` com `releaseUrl` HTTPS real; inclua no site o SHA-256 e as informações verificadas do artefato. Não habilite download para arquivos não publicados ou builds ainda não aprovadas.

## Metadados e histórico

As capturas mostram versões diferentes e são identificadas como referências históricas. O OpenGraph usa título e descrição; as URLs absolutas devem ser preenchidas após a confirmação do domínio público, para evitar links falsos.
