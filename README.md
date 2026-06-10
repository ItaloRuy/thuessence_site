# THUESSENCE — E-commerce de Perfumaria Árabe

## O negócio

**Thuessence é uma revenda brasileira de perfumes e cosméticos árabes originais.**

Modelo: importação e revenda — seleciona produtos de marcas do Oriente Médio (Lattafa, Al Wataniah, Armaf, Ard al Zaafaran, Maison Alhambra, Asdaaf, Azzaro, Revlon, Victoria's Secret) e entrega para clientes no Brasil.

**Proposta de valor:** a perfumaria árabe (oud, âmbar, rosa de Taif) tem prestígio centenário e é pouco explorada no mercado brasileiro. A Thuessence ocupa esse nicho com curadoria e autenticidade garantida.

**Posicionamento:** luxo acessível. Visual dark/gold que remete à sofisticação árabe.

**Contato real:**
- Instagram: [@thuessence_](https://instagram.com/thuessence_)
- WhatsApp: (43) 99767-665

---

## Estado atual (junho 2026)

### Implementado

- Landing page completa: navbar, hero com canvas de partículas, grid de produtos, seção essência, footer
- **18 produtos cadastrados** no Firestore com fotos reais em `fotos_produtos/`
- **Modal de produto** com galeria de fotos (nav prev/next, teclado ←→, Esc para fechar)
- **Botão WhatsApp flutuante** + botão "Comprar via WhatsApp" no modal (mensagem pré-preenchida com nome do produto)
- **Painel admin** (`admin.html`) com Firebase Auth + Firestore CRUD + upload de foto para Storage
- **Firebase integrado** — Firestore ativo, credenciais configuradas em `js/firebase-config.js`
- Favicon SVG inline (letra T dourada em fundo escuro)
- Design system gold/dark: `--bg #09080d`, `--gold #c9a84c`, fontes Playfair Display + Raleway
- Responsivo: breakpoints 1024px e 768px

### Ainda falta

- [ ] Preencher preços dos produtos (todos estão `preco: 0`)
- [ ] Configurar autenticação no Firebase (para usar o admin)
- [ ] Ativar Firebase Storage (requer billing no Google Cloud)
- [ ] Fazer upload das fotos para o Storage (hoje servidas localmente)
- [ ] Meta tags Open Graph (compartilhamento no WhatsApp/Instagram)
- [ ] Deploy (Vercel ou Netlify)
- [ ] Chat / atendimento (a definir: Claude API ou widget WhatsApp)

---

## Estrutura do projeto

```
Site_Thuessence/
├── index.html              # Página única (landing page)
├── admin.html              # Painel de gerenciamento (protegido por senha)
├── css/
│   └── style.css           # Todo o CSS (sem framework)
├── js/
│   ├── main.js             # Todo o JS do site público
│   └── firebase-config.js  # Credenciais Firebase (projeto thuessence-36650)
├── fotos_produtos/         # Fotos reais organizadas por marca/produto
│   ├── Al Wataniah/
│   ├── Ard al Zaafaran/
│   ├── Armaf/
│   ├── Asdaaf/
│   ├── Azzaro/
│   ├── Lattafa/
│   ├── Maison Alhambra/
│   ├── Revlon/
│   └── Victoria's Secret/
├── products.json           # Fonte original dos produtos (usada pelo script de migração)
├── migrar-produtos.js      # Script de migração products.json → Firestore
├── package.json            # Dependências Node (firebase-admin)
├── node_modules/           # Dependências instaladas
└── serviceAccountKey.json  # NUNCA commitar — chave privada do Firebase Admin
```

---

## Como rodar localmente

O site usa Firebase SDK via CDN — precisa de um servidor HTTP (não abre direto como arquivo).

```bash
# Instalar dependências (só na primeira vez)
npm install

# Subir servidor local na porta 8080
npx serve -l 8080 .
```

Acesse em `http://localhost:8080`.

O admin fica em `http://localhost:8080/admin.html`.

---

## Firebase

### Projeto

| Campo | Valor |
|---|---|
| Project ID | `thuessence-36650` |
| Auth Domain | `thuessence-36650.firebaseapp.com` |
| Storage Bucket | `thuessence-36650.firebasestorage.app` |

### Serviços ativados

| Serviço | Status | Observação |
|---|---|---|
| Firestore | ✅ Ativo | 18 produtos migrados |
| Authentication | ⚠️ Ativar | Necessário para usar o admin |
| Storage | ⚠️ Sem billing | Ativar billing no Google Cloud para upload de fotos |

### Configurar autenticação (para o admin)

1. Firebase Console → **Build → Authentication → Começar**
2. Aba **Sign-in method** → Email/senha → Ativar
3. Aba **Users → Adicionar usuário** → coloque seu email e senha de admin

### Regras de segurança recomendadas

**Firestore** (Build → Firestore → Regras):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produtos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage** (Build → Storage → Regras):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Produtos

### 18 produtos no Firestore

| Ordem | Nome | Marca | Tipo | Fotos |
|---|---|---|---|---|
| 1 | Attar Al Wesal | Al Wataniah | EDP | 2 |
| 2 | Sabah Al Ward | Al Wataniah | EDP | 1 |
| 3 | Milena | Ard al Zaafaran | EDP | 4 |
| 4 | Club de Nuit Woman | Armaf | EDP | 5 |
| 5 | Ya Habibti | Asdaaf | EDP | 3 |
| 6 | Pour Homme | Azzaro | EDT | 1 |
| 7 | Asad | Lattafa | EDP | 1 |
| 8 | Atheeri | Lattafa | EDP | 3 |
| 9 | Fakhar Lattafa Black | Lattafa | EDP | 6 |
| 10 | Fakhar Lattafa Gold | Lattafa | EDP | 2 |
| 11 | Fakhar Lattafa White | Lattafa | EDP | 2 |
| 12 | Musamam White Intense | Lattafa | EDP | 4 |
| 13 | Raed | Lattafa | EDP | 1 |
| 14 | Delilah Pour Femme | Maison Alhambra | EDP | 2 |
| 15 | Uniq One Hair Treatment | Revlon | Tratamento | 1 |
| 16 | Body Lotions Set | Victoria's Secret | Body Lotion | 2 |
| 17 | Lavender and Vanilla | Victoria's Secret | Body Lotion | 1 |
| 18 | Love Spell | Victoria's Secret | Body Lotion | 1 |

Todos os preços estão como `0` — preencher via admin antes do deploy.

### Fotos: situação atual vs. produção

| Ambiente | Como funciona |
|---|---|
| Localhost | Fotos servidas localmente por `npx serve` — caminhos relativos no Firestore |
| Produção | Precisa fazer upload para o Firebase Storage e atualizar as URLs no Firestore via admin |

### Remigrar produtos (se necessário)

```bash
# Requer serviceAccountKey.json na raiz do projeto
node migrar-produtos.js
```

O script apaga todos os produtos do Firestore e recria a partir do `products.json`.

---

## Painel Admin

Acesse `http://localhost:8080/admin.html` (ou `/admin.html` no domínio de produção).

**Requer:** autenticação Firebase com Email/senha configurada (ver seção Firebase acima).

Funcionalidades:
- Listar todos os produtos
- Adicionar produto com múltiplas fotos (upload para Storage)
- Editar produto existente
- Excluir produto
- Toast de confirmação em todas as ações

> O admin usa `meta name="robots" content="noindex"` — não é indexado pelo Google.

---

## Deploy

Opções recomendadas (ambas gratuitas para sites estáticos):

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
Arraste a pasta do projeto para app.netlify.com, ou:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Antes do deploy:**
1. Preencher preços dos produtos via admin
2. Fazer upload das fotos para Firebase Storage via admin
3. Atualizar as URLs das fotos no Firestore
4. Configurar regras de segurança do Firestore/Storage para produção

---

## Segurança

| Arquivo | Status |
|---|---|
| `js/firebase-config.js` | Seguro — chaves públicas do SDK web (comportamento normal do Firebase) |
| `serviceAccountKey.json` | **NUNCA commitar** — está no `.gitignore` |

As chaves em `firebase-config.js` são intencionalmente públicas (o Firebase as protege por regras de segurança no console). A `serviceAccountKey.json` dá acesso admin irrestrito — jamais deve ir para o repositório ou para qualquer serviço público.

---

## Design system

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#09080d` | Fundo principal |
| `--gold` | `#c9a84c` | Acentos, títulos, bordas |
| `--text` | `#f0ece4` | Texto principal |
| Font serif | Playfair Display | Títulos, logo |
| Font sans | Raleway | Corpo, UI |

---

## Decisões técnicas

| Decisão | Motivo |
|---|---|
| Vanilla JS + CSS puro | Site simples, sem necessidade de framework — zero dependências em produção |
| Firebase SDK compat via CDN | Sem bundler (Webpack/Vite) — compatível com HTML puro |
| Canvas de partículas no hero | Efeito premium sem biblioteca externa |
| Scroll reveal via IntersectionObserver | API nativa, sem AOS/ScrollReveal |
| Fallback para produtos hardcoded | Site nunca fica em branco se o Firestore falhar |
| Caminhos relativos nas fotos (localhost) | Permite testar sem Firebase Storage ativo |
