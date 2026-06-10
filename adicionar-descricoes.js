const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');

const app = initializeApp({ credential: cert(require(path.join(__dirname, 'serviceAccountKey.json'))) });
const db = getFirestore(app);

const descricoes = {
    'Attar Al Wesal':
        'Oud amadeirado com fundo de âmbar quente — marcante e envolvente. Ideal para noites e ocasiões especiais. Alta fixação, sillage intenso.',

    'Sabah Al Ward':
        'A essência da rosa de Taif em sua forma mais pura. Feminina e sofisticada, perfeita para o dia a dia com elegância discreta.',

    'Milena':
        'Buquê floral delicado e versátil que combina com qualquer momento — do trabalho ao jantar. Leve, feminino e acolhedor.',

    'Club de Nuit Woman':
        'Inspirado no icônico Chanel Chance: frescor frutado com coração floral elegante. Alta fixação e sillage generoso para uso diário.',

    'Ya Habibti':
        'A harmonia entre o oud oriental e a delicadeza da rosa. Sensual e feminino, deixa um rastro inesquecível onde passa.',

    'Pour Homme':
        'Clássico masculino com abertura cítrica fresca e fundo aromático especiado. Elegante e versátil para qualquer ocasião.',

    'Asad':
        'Poderoso como seu nome (leão em árabe). Oud intenso com madeiras nobres — para quem quer presença e ser lembrado.',

    'Atheeri':
        'Amadeirado rico com âmbar cremoso e longa duração. Envolvente e sofisticado, perfeito para noites e climas mais frios.',

    'Fakhar Lattafa Black':
        'A versão mais intensa e misteriosa da linha Fakhar. Oud especiado com notas escuras — para ocasiões que exigem impacto.',

    'Fakhar Lattafa Gold':
        'Luxuoso e elegante: oud suavizado por âmbar quente e notas douradas. Ideal para eventos e noites especiais.',

    'Fakhar Lattafa White':
        'A versão mais luminosa da linha Fakhar — floral fresco que une elegância árabe com leveza. Versátil para o dia.',

    'Musamam White Intense':
        'Âmbar quente, oud delicado e baunilha cremosa criam um aconchego único. Viciante, marcante e de longa duração.',

    'Raed':
        'Equilíbrio perfeito entre oud oriental e suavidade da rosa. Unissex e versátil, funciona em qualquer estação.',

    'Delilah Pour Femme':
        'Floral frutado vibrante com personalidade marcante. Jovem, alegre e sofisticado — para quem ama fragrâncias femininas intensas.',

    'Uniq One Hair Treatment':
        '10 benefícios em 1 produto: hidrata, desembaraça, protege do calor e elimina o frizz. Referência mundial em tratamento capilar.',

    'Body Lotions Set':
        'Kit com as fragrâncias icônicas da Victoria\'s Secret em loção hidratante. Pele macia, perfumada e hidratada o dia todo.',

    'Lavender and Vanilla':
        'Lavanda relaxante com baunilha morna e aconchegante. Hidratação intensa com perfume suave — perfeito para a rotina noturna.',

    'Love Spell':
        'Cherry blossom e pêssego em uma mistura floral frutada irresistível. O clássico mais amado da Victoria\'s Secret.',
};

async function run() {
    const snap = await db.collection('produtos').get();
    let atualizados = 0;
    for (const doc of snap.docs) {
        const nome = doc.data().nome;
        const descricao = descricoes[nome];
        if (descricao) {
            await doc.ref.update({ descricao, updatedAt: FieldValue.serverTimestamp() });
            console.log(`  ✅ ${nome}`);
            atualizados++;
        }
    }
    console.log(`\n${atualizados}/18 descrições adicionadas.`);
    process.exit(0);
}

run().catch(e => { console.error(e.message); process.exit(1); });
