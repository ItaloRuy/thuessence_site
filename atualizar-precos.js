const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const app = initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });
const db = getFirestore(app);

const precos = {
  'Attar Al Wesal':           129.90,
  'Sabah Al Ward':            119.90,
  'Milena':                    99.90,
  'Club de Nuit Woman':       189.90,
  'Ya Habibti':               109.90,
  'Pour Homme':               219.90,
  'Asad':                     149.90,
  'Atheeri':                  139.90,
  'Fakhar Lattafa Black':     169.90,
  'Fakhar Lattafa Gold':      169.90,
  'Fakhar Lattafa White':     159.90,
  'Musamam White Intense':    129.90,
  'Raed':                     139.90,
  'Delilah Pour Femme':       149.90,
  'Uniq One Hair Treatment':   89.90,
  'Body Lotions Set':         149.90,
  'Lavender and Vanilla':      79.90,
  'Love Spell':                79.90,
};

async function run() {
    const snap = await db.collection('produtos').get();
    let atualizados = 0;
    for (const doc of snap.docs) {
        const nome = doc.data().nome;
        const preco = precos[nome];
        if (preco !== undefined) {
            await doc.ref.update({ preco, updatedAt: FieldValue.serverTimestamp() });
            console.log(`  R$ ${preco.toFixed(2).replace('.', ',')}  ${nome}`);
            atualizados++;
        }
    }
    console.log(`\n${atualizados}/18 preços atualizados.`);
    process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
