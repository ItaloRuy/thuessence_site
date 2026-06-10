const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const app = initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });
const db = getFirestore(app);

const categorias = {
    'Attar Al Wesal':           'unissex',
    'Sabah Al Ward':            'feminino',
    'Milena':                   'feminino',
    'Club de Nuit Woman':       'feminino',
    'Ya Habibti':               'feminino',
    'Pour Homme':               'masculino',
    'Asad':                     'masculino',
    'Atheeri':                  'masculino',
    'Fakhar Lattafa Black':     'masculino',
    'Fakhar Lattafa Gold':      'unissex',
    'Fakhar Lattafa White':     'feminino',
    'Musamam White Intense':    'unissex',
    'Raed':                     'unissex',
    'Delilah Pour Femme':       'feminino',
    'Uniq One Hair Treatment':  'cosmeticos',
    'Body Lotions Set':         'cosmeticos',
    'Lavender and Vanilla':     'cosmeticos',
    'Love Spell':               'cosmeticos',
};

async function run() {
    const snap = await db.collection('produtos').get();
    let atualizados = 0;
    for (const doc of snap.docs) {
        const nome = doc.data().nome;
        const categoria = categorias[nome];
        if (categoria) {
            await doc.ref.update({ categoria, updatedAt: FieldValue.serverTimestamp() });
            console.log(`  [${categoria}] ${nome}`);
            atualizados++;
        }
    }
    console.log(`\n${atualizados}/18 categorias adicionadas.`);
    process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
