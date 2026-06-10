/**
 * Migração: products.json → Firestore + Firebase Storage
 *
 * Pré-requisito: baixar a chave de serviço no Firebase Console
 *   Project Settings → Service Accounts → Generate new private key
 *   Salvar como "serviceAccountKey.json" na pasta do projeto
 *
 * Rodar:
 *   npm install firebase-admin
 *   node migrar-produtos.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const fs   = require('fs');
const path = require('path');

// ── Configuração ──────────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'serviceAccountKey.json');
const PRODUCTS_JSON        = path.join(__dirname, 'products.json');
const FOTOS_DIR            = path.join(__dirname, 'fotos_produtos');
const STORAGE_BUCKET       = 'thuessence-36650.firebasestorage.app';
// ─────────────────────────────────────────────────────────────────────────────

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('\n❌ Arquivo serviceAccountKey.json não encontrado.');
    console.error('   Baixe em: Firebase Console → Project Settings → Service Accounts → Generate new private key');
    process.exit(1);
}

const app    = initializeApp({ credential: cert(require(SERVICE_ACCOUNT_PATH)), storageBucket: STORAGE_BUCKET });
const db     = getFirestore(app);
const bucket = getStorage(app).bucket();

function encontrarFotos(marcaDir, nomeDir) {
    const dir = path.join(FOTOS_DIR, marcaDir, nomeDir);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
        .sort()
        .map(f => path.join(dir, f));
}

async function migrar() {
    const produtos = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));

    // Limpa coleção existente para evitar duplicatas
    const snap = await db.collection('produtos').get();
    if (!snap.empty) {
        console.log(`🗑  Removendo ${snap.size} produto(s) existente(s) no Firestore...`);
        const batch = db.batch();
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
    }

    console.log(`\n📦 Migrando ${produtos.length} produtos...\n`);

    for (const produto of produtos) {
        const marcaDir = produto.marca;
        const nomeDir  = produto.nome;
        const fotosLocais = encontrarFotos(marcaDir, nomeDir);

        console.log(`  [${produto.ordem}/${produtos.length}] ${produto.nome} — ${fotosLocais.length} foto(s)`);

        // Salva caminhos relativos (funcionam em localhost; trocar por URLs do Storage no deploy)
        const fotosUrls = fotosLocais.map(localPath => {
            const rel = path.relative(path.join(__dirname), localPath).replace(/\\/g, '/');
            return rel;
        });

        await db.collection('produtos').add({
            nome:      produto.nome,
            marca:     produto.marca,
            tipo:      produto.tipo,
            volume:    produto.volume || '',
            preco:     produto.preco  || 0,
            notas:     produto.notas  || [],
            fotos:     fotosUrls,
            ordem:     produto.ordem,
            ativo:     produto.ativo !== false,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`    ✅ salvo no Firestore`);
    }

    console.log('\n🎉 Migração concluída!');
    console.log(`   ${produtos.length} produtos no Firestore`);
    console.log('   Abra http://localhost:8080 para verificar.\n');
    process.exit(0);
}

migrar().catch(err => {
    console.error('\n❌ Erro fatal:', err.message);
    process.exit(1);
});
