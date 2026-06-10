const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const app = initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });
const db = getFirestore(app);

const badges = {
    'Fakhar Lattafa Black':    'Mais Vendido',
    'Asad':                    'Mais Vendido',
    'Club de Nuit Woman':      'Mais Vendido',
    'Atheeri':                 'Mais Vendido',
    'Musamam White Intense':   'Novo',
    'Delilah Pour Femme':      'Novo',
    'Ya Habibti':              'Novo',
    'Body Lotions Set':        'Exclusivo',
    'Pour Homme':              'Exclusivo',
};

async function run() {
    const snap = await db.collection('produtos').get();
    let atualizados = 0;

    for (const doc of snap.docs) {
        const nome = doc.data().nome;
        const badge = badges[nome] || '';
        await doc.ref.update({ badge, updatedAt: FieldValue.serverTimestamp() });
        if (badge) {
            console.log(`  [${badge}] ${nome}`);
            atualizados++;
        }
    }

    console.log(`\n${atualizados} produtos com badge. ${Object.keys(badges).length - atualizados === 0 ? '' : 'Verifique nomes.'}`);
    process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
