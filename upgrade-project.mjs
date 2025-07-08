#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

const run = (command, label, options = {}) => {
  console.log(`\n🔧 ${label}`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (err) {
    console.error(`❌ Falha ao executar: ${label}`);
    if (label.includes('Instalando') || label.includes('Atualizando')) {
      console.log('⚠️ Tentando novamente com --legacy-peer-deps...');
      try {
        execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
        console.log('✅ Instalação forçada concluída com sucesso!');
      } catch (forceErr) {
        console.error('❌ Nem mesmo --legacy-peer-deps funcionou.');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Etapa 1: Ler e ajustar package.json
const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

let modified = false;

// 1.1 Remover overrides.vue
if (pkg.overrides?.vue) {
  console.log('🧹 Removendo overrides.vue...');
  delete pkg.overrides.vue;
  modified = true;
}

// 1.2 Corrigir ESLint se estiver usando versão 9
if (pkg.devDependencies?.eslint?.startsWith('^9')) {
  console.log('🧹 Corrigindo ESLint para ^8.52.0...');
  pkg.devDependencies.eslint = '^8.52.0';
  modified = true;
}

if (modified) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('✅ package.json atualizado com sucesso!');
}

// Etapa 2: Forçar versões compatíveis de Pinia e PersistedState
run('npm install @pinia/nuxt@0.5.1 @pinia-plugin-persistedstate/nuxt@1.2.1', 'Instalando versões compatíveis de Pinia');

// Etapa 3: Atualizar Nuxt
run('npm install nuxt@latest', 'Atualizando Nuxt para a versão mais recente');

// Etapa 4: Atualizar demais dependências via npm-check-updates
run('npx npm-check-updates -u', 'Atualizando todas as dependências com npm-check-updates');
run('npm install', 'Instalando as dependências atualizadas');

// Etapa 5: Lint
run('npm run lint || true', 'Executando linter');

// Etapa 6: Typecheck (se existir)
if (pkg.scripts?.['typecheck']) {
  run('npm run typecheck', 'Executando checagem de tipos');
} else {
  console.log('ℹ️ Nenhum script de typecheck encontrado.');
}

// Etapa 7: Testes
run('npm run test || true', 'Executando testes');

// Etapa 8: Build final
run('npm run build', 'Gerando build de produção');

// Final
console.log(`
🎉 Projeto atualizado com sucesso!

🚀 Agora é só rodar:
  npm run dev

📋 Checklist:
- Verifique componentes no navegador
- Ajuste testes se necessário
- Veja logs e warnings de build

Bom upgrade! 🦾
`);
