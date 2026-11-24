console.log("🔥 ESSE ARQUIVO ESTÁ SENDO EXECUTADO DE VERDADE!");
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
 onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection
} from 'firebase/firestore';
import {
  Sun,
  Moon,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  Upload,
  Sparkles,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Layers,
  Trophy,
  Download,
  Eye,
  Sliders,
  Info,
  ChevronRight,
  Calendar,
  FolderOpen,
  RefreshCw,
  ShieldCheck,
  Printer,
  Database
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO DO FIREBASE (PERSISTÊNCIA EM NUVEM PRIVADA)
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBVKB0rVVIJtL5WKUdyWBwdXl5Qx5HbD6w",
  authDomain: "plataforma-baratta.firebaseapp.com",
  projectId: "plataforma-baratta",
  storageBucket: "plataforma-baratta.firebasestorage.app",
  messagingSenderId: "77988152295",
  appId: "1:77988152295:web:b006ed4e09f47a2ec3b342"
};
typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Erro ao definir persistência:", error);
  });
}
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'plataforma-baratta-v1';

// ============================================================================
// CONSTANTES E REGRAS DE NEGÓCIO DA PLATAFORMA BARATTA
// ============================================================================
const INITIAL_SUBJECTS = [
  { id: 'mat', name: 'Matemática', area: 'Matemática' },
  { id: 'fis', name: 'Física', area: 'Ciências da Natureza' },
  { id: 'qui', name: 'Química', area: 'Ciências da Natureza' },
  { id: 'bio', name: 'Biologia', area: 'Ciências da Natureza' },
  { id: 'por', name: 'Português', area: 'Linguagens' },
  { id: 'ing', name: 'Inglês', area: 'Linguagens' },
  { id: 'his', name: 'História', area: 'Ciências Humanas' },
  { id: 'geo', name: 'Geografia', area: 'Ciências Humanas' },
  { id: 'fil', name: 'Filosofia', area: 'Ciências Humanas' },
  { id: 'soc', name: 'Sociologia', area: 'Ciências Humanas' },
  { id: 'art', name: 'História da Arte', area: 'Linguagens' },
  { id: 'red', name: 'Redação', area: 'Redação' },
];

const AREAS_ORDER = [
  'Matemática',
  'Ciências da Natureza',
  'Ciências Humanas',
  'Linguagens',
  'Redação'
];

const BOOKS_DATA = {
  algebrista: {
    title: "O Algebrista",
    topics: [
      { id: 'alg_1', name: '1. Números inteiros (Conjuntos, Operações, Módulo, Expressões)', relevance: 'Alta' },
      { id: 'alg_2', name: '2. Números racionais (Frações, Porcentagem, Dízimas, Reais)', relevance: 'Muito Alta' },
      { id: 'alg_3', name: '3. Expressões algébricas (Termos semelhantes, Polinômios, Valor numérico)', relevance: 'Média' },
      { id: 'alg_4', name: '4. Produtos notáveis (Quadrado da soma/diferença, Stevin, Cubos)', relevance: 'Média' },
      { id: 'alg_5', name: '5. Fatoração (Evidência, Agrupamento, Trinômios)', relevance: 'Média' },
      { id: 'alg_6', name: '6. MMC e MDC (Fatores numéricos e algébricos)', relevance: 'Média' },
      { id: 'alg_7', name: '7. Frações algébricas (Simplificação, Operações)', relevance: 'Baixa' },
      { id: 'alg_8', name: '8. Equações do primeiro grau (Resolução, Discussão, Inequação)', relevance: 'Alta' },
      { id: 'alg_9', name: '9. Sistemas de equações do primeiro grau (Substituição, Adição, Retas)', relevance: 'Média' },
      { id: 'alg_10', name: '10. Problemas do primeiro grau (Velocidade, Idades, Juros, Misturas)', relevance: 'Alta' },
      { id: 'alg_11', name: '11. Conjuntos e tópicos sobre análise (Venn, Intervalos, Médias, Funções)', relevance: 'Alta' },
      { id: 'alg_12', name: '12. Inequações do primeiro grau (Sistemas, Módulo, União e Interseção)', relevance: 'Média' },
      { id: 'alg_13', name: '13. Equações do segundo grau (Bhaskara, Soma e Produto, Gráfico)', relevance: 'Alta' },
      { id: 'alg_14', name: '14. Cálculo de radicais (Operações, Racionalização)', relevance: 'Média' },
      { id: 'alg_15', name: '15. Equações redutíveis ao segundo grau (Biquadradas e Irracionais)', relevance: 'Baixa' },
      { id: 'alg_16', name: '16. Sistemas do segundo grau (Sistemas não lineares)', relevance: 'Baixa' },
      { id: 'alg_17', name: '17. Inequações do segundo grau (Trinômios, Módulo)', relevance: 'Baixa' },
      { id: 'alg_18', name: '18. Problemas do segundo grau', relevance: 'Média' },
      { id: 'alg_19', name: '19. Funções (Domínio, Composta, Afim, Inversa)', relevance: 'Muito Alta' },
      { id: 'alg_20', name: '20. Trinômio do segundo grau (Vértice, Concavidade, Gráficos)', relevance: 'Alta' },
      { id: 'alg_21', name: '21. Polinômios (Divisibilidade, Teorema do Resto, Girard)', relevance: 'Baixa' }
    ]
  },
  tqm_fundamental: {
    title: "TQM Ensino Fundamental",
    topics: [
      { id: 'tqmf_01', name: '01. Sistemas de numeração', relevance: 'Baixa' },
      { id: 'tqmf_02', name: '02. Sistema decimal de numeração', relevance: 'Média' },
      { id: 'tqmf_03', name: '03. Operações fundamentais', relevance: 'Muito Alta' },
      { id: 'tqmf_04', name: '04. Números primos', relevance: 'Baixa' },
      { id: 'tqmf_05', name: '05. Divisibilidade', relevance: 'Média' },
      { id: 'tqmf_06', name: '06. Máximo divisor comum (MDC)', relevance: 'Média' },
      { id: 'tqmf_07', name: '07. Mínimo múltiplo comum (MMC)', relevance: 'Média' },
      { id: 'tqmf_08', name: '08. Frações', relevance: 'Muito Alta' },
      { id: 'tqmf_09', name: '09. Números decimais', relevance: 'Alta' },
      { id: 'tqmf_10', name: '10. Razões e proporções', relevance: 'Muito Alta' },
      { id: 'tqmf_11', name: '11. Números proporcionais', relevance: 'Muito Alta' },
      { id: 'tqmf_12', name: '12. Sistemas de unidades de medidas', relevance: 'Alta' },
      { id: 'tqmf_13', name: '13. Regra de três', relevance: 'Muito Alta' },
      { id: 'tqmf_14', name: '14. Médias', relevance: 'Muito Alta' },
      { id: 'tqmf_15', name: '15. Porcentagem', relevance: 'Muito Alta' },
      { id: 'tqmf_16', name: '16. Juros', relevance: 'Alta' },
      { id: 'tqmf_17', name: '17. Conjuntos', relevance: 'Baixa' },
      { id: 'tqmf_18', name: '18. Números inteiros', relevance: 'Alta' },
      { id: 'tqmf_19', name: '19. Expressões algébricas', relevance: 'Alta' },
      { id: 'tqmf_20', name: '20. Produtos notáveis', relevance: 'Baixa' },
      { id: 'tqmf_21', name: '21. Fatoração', relevance: 'Média' },
      { id: 'tqmf_22', name: '22. Equação do 1º grau', relevance: 'Alta' },
      { id: 'tqmf_23', name: '23. Problemas do 1º grau', relevance: 'Alta' },
      { id: 'tqmf_24', name: '24. Sistemas de equações do 1º grau', relevance: 'Média' },
      { id: 'tqmf_25', name: '25. Inequação do 1º grau', relevance: 'Baixa' },
      { id: 'tqmf_26', name: '26. Equação do 2º grau', relevance: 'Média' },
      { id: 'tqmf_27', name: '27. Problemas do 2º grau', relevance: 'Média' },
      { id: 'tqmf_28', name: '28. Potências', relevance: 'Alta' },
      { id: 'tqmf_29', name: '29. Radicais', relevance: 'Média' },
      { id: 'tqmf_30', name: '30. Equações biquadradas e irracionais', relevance: 'Baixa' },
      { id: 'tqmf_31', name: '31. Sistemas de equações do 2º grau', relevance: 'Baixa' },
      { id: 'tqmf_32', name: '32. Funções', relevance: 'Muito Alta' },
      { id: 'tqmf_33', name: '33. Inequações produto, fracionária e a duas variáveis', relevance: 'Baixa' },
      { id: 'tqmf_34', name: '34. Ângulos', relevance: 'Média' },
      { id: 'tqmf_35', name: '35. Polígonos', relevance: 'Alta' },
      { id: 'tqmf_36', name: '36. Triângulos', relevance: 'Alta' },
      { id: 'tqmf_37', name: '37. Quadriláteros', relevance: 'Alta' },
      { id: 'tqmf_38', name: '38. Círculo', relevance: 'Alta' },
      { id: 'tqmf_39', name: '39. Linhas proporcionais', relevance: 'Alta' },
      { id: 'tqmf_40', name: '40. Relações métricas no triângulo retângulo', relevance: 'Alta' },
      { id: 'tqmf_41', name: '41. Razões trigonométricas no triângulo retângulo', relevance: 'Média' },
      { id: 'tqmf_42', name: '42. Relações métricas no triângulo qualquer', relevance: 'Baixa' },
      { id: 'tqmf_43', name: '43. Relações métricas no círculo', relevance: 'Baixa' },
      { id: 'tqmf_44', name: '44. Polígonos regulares', relevance: 'Média' },
      { id: 'tqmf_45', name: '45. Comprimento da circunferência', relevance: 'Alta' },
      { id: 'tqmf_46', name: '46. Áreas das principais figuras planas', relevance: 'Muito Alta' }
    ]
  },
  tqm_medio: {
    title: "TQM Ensino Médio (Completo)",
    topics: [
      // Mat I
      { id: 'tqmm_m1_01', name: 'Mat. I — 01. Matemática Básica', relevance: 'Muito Alta' },
      { id: 'tqmm_m1_02', name: 'Mat. I — 02. Sequências', relevance: 'Média' },
      { id: 'tqmm_m1_03', name: 'Mat. I — 03. Progressões Aritméticas (PA)', relevance: 'Média' },
      { id: 'tqmm_m1_04', name: 'Mat. I — 04. Equações Exponenciais', relevance: 'Média' },
      { id: 'tqmm_m1_05', name: 'Mat. I — 05. Progressões Geométricas (PG)', relevance: 'Média' },
      { id: 'tqmm_m1_06', name: 'Mat. I — 06. Logaritmos', relevance: 'Média' },
      { id: 'tqmm_m1_07', name: 'Mat. I — 07. Funções Exponencial e Logarítmica', relevance: 'Média' },
      { id: 'tqmm_m1_08', name: 'Mat. I — 08. Binômio de Newton', relevance: 'Muito Baixa' },
      { id: 'tqmm_m1_09', name: 'Mat. I — 09. Análise Combinatória', relevance: 'Alta' },
      { id: 'tqmm_m1_10', name: 'Mat. I — 10. Probabilidade', relevance: 'Alta' },
      { id: 'tqmm_m1_11', name: 'Mat. I — 11. Números Complexos', relevance: 'Muito Baixa' },
      { id: 'tqmm_m1_12', name: 'Mat. I — 12. Polinômios e Equações', relevance: 'Baixa' },
      // Mat II
      { id: 'tqmm_m2_01', name: 'Mat. II — 01. Ângulos', relevance: 'Média' },
      { id: 'tqmm_m2_02', name: 'Mat. II — 02. Polígonos', relevance: 'Alta' },
      { id: 'tqmm_m2_03', name: 'Mat. II — 03. Triângulos', relevance: 'Alta' },
      { id: 'tqmm_m2_04', name: 'Mat. II — 04. Quadriláteros', relevance: 'Alta' },
      { id: 'tqmm_m2_05', name: 'Mat. II — 05. Círculo e Circunferência', relevance: 'Alta' },
      { id: 'tqmm_m2_06', name: 'Mat. II — 06. Linhas Proporcionais e Semelhança', relevance: 'Alta' },
      { id: 'tqmm_m2_07', name: 'Mat. II — 07. Relações Métricas no Círculo', relevance: 'Baixa' },
      { id: 'tqmm_m2_08', name: 'Mat. II — 08. Relações Métricas no Triângulo Retângulo', relevance: 'Alta' },
      { id: 'tqmm_m2_09', name: 'Mat. II — 09. Relações Métricas num Triângulo Qualquer', relevance: 'Média' },
      { id: 'tqmm_m2_10', name: 'Mat. II — 10. Polígonos Regulares', relevance: 'Média' },
      { id: 'tqmm_m2_11', name: 'Mat. II — 11. Áreas das Principais Figuras Planas', relevance: 'Muito Alta' },
      { id: 'tqmm_m2_12', name: 'Mat. II — 12. Poliedros', relevance: 'Alta' },
      { id: 'tqmm_m2_13', name: 'Mat. II — 13. Prismas', relevance: 'Muito Alta' },
      { id: 'tqmm_m2_14', name: 'Mat. II — 14. Cilindros', relevance: 'Muito Alta' },
      { id: 'tqmm_m2_15', name: 'Mat. II — 15. Pirâmides', relevance: 'Alta' },
      { id: 'tqmm_m2_16', name: 'Mat. II — 16. Cones', relevance: 'Alta' },
      { id: 'tqmm_m2_17', name: 'Mat. II — 17. Esferas', relevance: 'Alta' },
      // Mat III
      { id: 'tqmm_m3_01', name: 'Mat. III — 01. Conjuntos', relevance: 'Baixa' },
      { id: 'tqmm_m3_02', name: 'Mat. III — 02. Produto Cartesiano', relevance: 'Muito Baixa' },
      { id: 'tqmm_m3_03', name: 'Mat. III — 03. Relações e Funções', relevance: 'Alta' },
      { id: 'tqmm_m3_04', name: 'Mat. III — 04. Razões Trigonométricas no Triângulo Retângulo', relevance: 'Média' },
      { id: 'tqmm_m3_05', name: 'Mat. III — 05. Arcos e Ângulos', relevance: 'Média' },
      { id: 'tqmm_m3_06', name: 'Mat. III — 06. As Linhas Trigonométricas', relevance: 'Média' },
      { id: 'tqmm_m3_07', name: 'Mat. III — 07. Redução ao 1º Quadrante', relevance: 'Baixa' },
      { id: 'tqmm_m3_08', name: 'Mat. III — 08. Fórmulas de Adição e Subtração de Arcos', relevance: 'Muito Baixa' },
      { id: 'tqmm_m3_09', name: 'Mat. III — 09. Funções Trigonométricas', relevance: 'Média' },
      { id: 'tqmm_m3_10', name: 'Mat. III — 10. Equações Trigonométricas', relevance: 'Baixa' },
      { id: 'tqmm_m3_11', name: 'Mat. III — 11. Matrizes e Determinantes', relevance: 'Baixa' },
      { id: 'tqmm_m3_12', name: 'Mat. III — 12. Vetores no Plano e no Espaço', relevance: 'Baixa' },
      { id: 'tqmm_m3_13', name: 'Mat. III — 13. Produto Escalar', relevance: 'Baixa' },
      { id: 'tqmm_m3_14', name: 'Mat. III — 14. Produto Vetorial', relevance: 'Muito Baixa' },
      { id: 'tqmm_m3_15', name: 'Mat. III — 15. Produto Misto', relevance: 'Muito Baixa' },
      { id: 'tqmm_m3_16', name: 'Mat. III — 16. Estudo da Reta no R²', relevance: 'Média' },
      { id: 'tqmm_m3_17', name: 'Mat. III — 17. Planos em R³', relevance: 'Baixa' },
      { id: 'tqmm_m3_18', name: 'Mat. III — 18. Retas no R³', relevance: 'Baixa' },
      { id: 'tqmm_m3_19', name: 'Mat. III — 19. Estudo da Circunferência no R²', relevance: 'Média' },
      { id: 'tqmm_m3_20', name: 'Mat. III — 20. Transformações Lineares', relevance: 'Muito Baixa' },
      { id: 'tqmm_m3_21', name: 'Mat. III — 21. Sistemas de Equações Lineares', relevance: 'Média' },
      // Apêndices
      { id: 'tqmm_ap_01', name: 'Apêndice — 01. Os Espaços Vetoriais', relevance: 'Muito Baixa' },
      { id: 'tqmm_ap_02', name: 'Apêndice — 02. Superfícies Cônicas', relevance: 'Baixa' },
      { id: 'tqmm_ap_03', name: 'Apêndice — 03. Noções de Lógica Matemática', relevance: 'Baixa' },
      { id: 'tqmm_ap_04', name: 'Apêndice — 04. Noções de Estatística', relevance: 'Muito Alta' }
    ]
  }
};

const EXAMS_MAP = [
  { id: 'P1', label: 'P1', trimester: 1 },
  { id: 'P2', label: 'P2', trimester: 1 },
  { id: 'P3', label: 'P3', trimester: 2 },
  { id: 'P4', label: 'P4', trimester: 2 },
  { id: 'P5', label: 'P5', trimester: 3 },
  { id: 'P6', label: 'P6', trimester: 3 }
];

const DEFAULT_BAND_LABELS = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Melhore',
  4: 'Ok',
  5: 'Bom',
  6: 'Perfeito!'
};

const DEFAULT_MOTIVATIONAL_QUOTES = [
  { text: 'A disciplina é a ponte entre metas e realizações.', author: 'Jim Rohn' },
  { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier' },
  { text: 'Não é sobre ser o melhor hoje, é sobre ser melhor do que ontem.', author: 'Provérbio' },
  { text: 'Constância vence intensidade quando o horizonte é de longo prazo.', author: 'Princípio de Estudo' },
  { text: 'Diagnosticar o erro com clareza é metade do caminho para o domínio.', author: 'Método Baratta' },
  { text: 'A excelência não é um ato, mas um hábito construído com método.', author: 'Aristóteles' },
  { text: 'Onde há método e persistência, o resultado deixa de ser acaso.', author: 'Princípio Acadêmico' },
  { text: 'Cada avaliação é um mapa, não um veredito.', author: 'Filosofia de Aprendizado' },
  { text: 'Foco no processo diário; as notas são consequência natural da clareza.', author: 'Estratégia de Alta Performance' },
  { text: 'Grandes conquistas exigem organização silenciosa e execução consistente.', author: 'Princípio de Disciplina' }
];

const DEFAULT_XP_CONFIG = {
  completeDiagnosis: 20,
  uploadChapter: 1,
  approveSyllabus: 5,
  generateReport: 5
};

const XP_LEVELS = [
  { level: 1, name: 'Bronze', minXp: 0 },
  { level: 2, name: 'Prata', minXp: 1000 },
  { level: 3, name: 'Ouro', minXp: 2000 },
  { level: 4, name: 'Platina', minXp: 2500 },
  { level: 5, name: 'Diamante', minXp: 3000 },
  { level: 6, name: 'Elite', minXp: 3500 },
  { level: 7, name: 'Lenda', minXp: 3700 },
  { level: 8, name: 'Surreal', minXp: 3800 }
];

const TABS = [
  'Dashboard',
  'Inserir notas',
  'Boletim',
  'Estatísticas',
  'Relatórios',
  'Biblioteca',
  'Livros',
  'Ranking',
  'Progresso'
];

// ============================================================================
// FUNÇÕES UTILITÁRIAS DE CÁLCULO ACADÊMICO
// ============================================================================
function getPerformanceBand(score, bandLabels = DEFAULT_BAND_LABELS) {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  let bandNumber = 1;
  if (score < 40) bandNumber = 1;
  else if (score < 50) bandNumber = 2;
  else if (score < 60) bandNumber = 3;
  else if (score < 80) bandNumber = 4;
  else if (score < 90) bandNumber = 5;
  else bandNumber = 6;

  const colors = {
    1: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    2: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    3: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    4: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    5: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    6: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  };
// Retorna as classes Tailwind para o estilo de pílula translúcida de acordo com a faixa (1 a 6)
function getBandPillStyle(score, bandLabels, isAverage = false) {
  if (score === null || score === undefined || score === '—') {
    return 'text-slate-500';
  }

  const band = getPerformanceBand(score, bandLabels);
  const level = band?.level || 1; // Garante que sempre tenha uma faixa válida

  const baseStyle = `inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border text-xs tabular-nums transition-all ${
    isAverage ? 'font-bold' : 'font-medium'
  }`;

  const colors = {
    // Faixa 1: Vinho
    1: 'bg-[#881337]/25 text-rose-300 border-[#881337]/50',
    // Faixa 2: Vermelho Coral
    2: 'bg-rose-500/20 text-rose-400 border-rose-500/35',
    // Faixa 3: Laranja Âmbar
    3: 'bg-orange-500/20 text-orange-400 border-orange-500/35',
    // Faixa 4: Amarelo Dourado
    4: 'bg-amber-400/20 text-amber-300 border-amber-400/35',
    // Faixa 5: Azul Ciano
    5: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/35',
    // Faixa 6: Verde Esmeralda
    6: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
  };

  return `${baseStyle} ${colors[level] || colors[1]}`;
}
  return {
    number: bandNumber,
    label: bandLabels[bandNumber] || `Faixa ${bandNumber}`,
    badgeClass: colors[bandNumber]
  };
}

function formatScore(score) {
  if (score === null || score === undefined) return '—';
  // Arredonda para o número inteiro mais próximo (ex: 70.4 vira 70, 70.5 vira 71)
  return Math.round(score).toString(); 
}

function calculateSubjectYearStats(examsForSubject) {
  const byCode = {};
  examsForSubject.forEach((ex) => {
    byCode[ex.examCode] = ex;
  });

  const calcTrimester = (c1, c2) => {
    const e1 = byCode[c1];
    const e2 = byCode[c2];
    if (e1 && e2) return { avg: (Number(e1.score) + Number(e2.score)) / 2, provisional: false };
    if (e1) return { avg: Number(e1.score), provisional: true };
    if (e2) return { avg: Number(e2.score), provisional: true };
    return { avg: null, provisional: false };
  };

  const t1 = calcTrimester('P1', 'P2');
  const t2 = calcTrimester('P3', 'P4');
  const t3 = calcTrimester('P5', 'P6');

  const validTrimesters = [t1, t2, t3].filter((t) => t.avg !== null);
  const annualAvg =
    validTrimesters.length > 0
      ? validTrimesters.reduce((acc, cur) => acc + cur.avg, 0) / validTrimesters.length
      : null;

  const isAnnualProvisional =
    validTrimesters.length > 0 &&
    (validTrimesters.length < 3 || validTrimesters.some((t) => t.provisional));

  return {
    P1: byCode['P1'] || null,
    P2: byCode['P2'] || null,
    T1: t1.avg,
    T1Provisional: t1.provisional,
    P3: byCode['P3'] || null,
    P4: byCode['P4'] || null,
    T2: t2.avg,
    T2Provisional: t2.provisional,
    P5: byCode['P5'] || null,
    P6: byCode['P6'] || null,
    T3: t3.avg,
    T3Provisional: t3.provisional,
    annualAvg,
    isAnnualProvisional,
    count: examsForSubject.length
  };
}

// ============================================================================
// INTEGRAÇÃO COM GEMINI API (COM EXPONENTIAL BACKOFF)
// ============================================================================
async function callGeminiAPI({ prompt, systemInstruction, responseSchema, inlineData }) {
  const apiKey = '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const parts = [{ text: prompt }];
  if (inlineData && inlineData.data && inlineData.mimeType) {
    parts.push({
      inlineData: {
        mimeType: inlineData.mimeType,
        data: inlineData.data
      }
    });
  }

  const payload = {
    contents: [{ role: 'user', parts }],
    ...(systemInstruction
      ? { systemInstruction: { parts: [{ text: systemInstruction }] } }
      : {}),
    ...(responseSchema
      ? {
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema
          }
        }
      : {})
  };

  const delays = [1000, 2000, 4000, 8000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < delays.length) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw new Error(`Erro na comunicação com a IA (Status ${response.status})`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Resposta vazia da IA.');

      return responseSchema ? JSON.parse(text) : text;
    } catch (err) {
      if (attempt === delays.length) throw err;
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
}

// ============================================================================
// EXTRAÇÃO DE TEXTO DE PDF NO NAVEGADOR (PDF.JS)
// ============================================================================
async function extractTextFromPdfFile(file) {
  try {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 40);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      fullText += `\n--- Página ${i} ---\n${pageText}`;
    }

    const cleaned = fullText.trim();
    const isReadable = cleaned.length >= 60;
    return {
      text: cleaned.slice(0, 45000),
      numPages: pdf.numPages,
      isReadable
    };
  } catch (error) {
    return {
      text: '',
      numPages: 0,
      isReadable: false
    };
  }
}

// ============================================================================
// COMPONENTES VISUAIS E GRÁFICOS SVG MINIMALISTAS (APPLE DESIGN)
// ============================================================================
function AppleCard({ children, className = '', noPadding = false }) {
  return (
    <div
      className={`bg-white dark:bg-[#1C1C1E] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200 ${
        noPadding ? '' : 'p-5 sm:p-6'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">{description}</p>
      {action}
    </div>
  );
}

function LineEvolutionChart({ dataPoints, height = 210 }) {
  // dataPoints: [{ label: 'P1', value: 82 }, ...]
  const validPoints = dataPoints.filter((d) => d.value !== null && d.value !== undefined);

  if (validPoints.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        Sem avaliações suficientes para traçar evolução.
      </div>
    );
  }

  const width = 560;
  const padLeft = 36;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 32;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const coords = dataPoints.map((d, idx) => {
    const x =
      dataPoints.length === 1
        ? padLeft + innerW / 2
        : padLeft + (idx / (dataPoints.length - 1)) * innerW;
    const y = d.value !== null ? padTop + innerH - (d.value / 100) * innerH : null;
    return { ...d, x, y };
  });

  const activeCoords = coords.filter((c) => c.y !== null);
  const pathD = activeCoords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  const areaD =
    activeCoords.length > 1
      ? `${pathD} L ${activeCoords[activeCoords.length - 1].x.toFixed(1)} ${(
          padTop + innerH
        ).toFixed(1)} L ${activeCoords[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`
      : '';

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="barattaBlueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#007AFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#007AFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padTop + innerH - (tick / 100) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-white/10"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[11px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {areaD && <path d={areaD} fill="url(#barattaBlueGrad)" />}
        {activeCoords.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="#007AFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {coords.map((c, idx) => (
          <g key={idx}>
            <text
              x={c.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
            >
              {c.label}
            </text>
            {c.y !== null && (
              <>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="5"
                  fill="#007AFF"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={c.x}
                  y={c.y - 10}
                  textAnchor="middle"
                  className="fill-slate-800 dark:fill-white text-[11px] font-semibold"
                >
                  {formatScore(c.value)}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function HorizontalBarChart({ items }) {
  // items: [{ label, value, sublabel }]
  const validItems = items.filter((i) => i.value !== null && i.value !== undefined);
  if (validItems.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        Nenhum dado disponível para comparação.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {validItems.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">
              {item.label}
              {item.sublabel && (
                <span className="ml-1.5 text-xs text-slate-400 font-normal">{item.sublabel}</span>
              )}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
              {formatScore(item.value)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#007AFF] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, item.value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL: PLATAFORMA BARATTA
// ============================================================================
export default function App() {
  // Splash screen
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  // Autenticação e sincronização
  const [user, setUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Conectando...');

  // Preferências visuais e navegação
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [availableYears, setAvailableYears] = useState([2026, 2027, 2028]);

  // Dados acadêmicos persistentes
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [exams, setExams] = useState([]); // { id, year, subjectId, examCode, trimester, date, score, fileName, topics: [{ topic, subtopic, totalQuestions, correctAnswers, annulledQuestions }], isDemo }
  const [libraryChapters, setLibraryChapters] = useState([]); // { id, subjectId, chapterNumber, title, fileName, fileSize, extractedText, numPages, isReadable, uploadedAt, fileDataUrl }
  const [examSyllabi, setExamSyllabi] = useState([]); // { id, year, subjectId, examCode, chapterIds, topics: [{ name, subtopics, complexity }], approvedAt }
  const [reports, setReports] = useState([]); // { id, createdAt, year, scope, trimester, subjectId, area, content, metricsSnapshot }
  const [xpActions, setXpActions] = useState([]); // { id, actionKey, label, xp, createdAt, refId }
  const [xpConfig, setXpConfig] = useState(DEFAULT_XP_CONFIG);
  const [bandLabels, setBandLabels] = useState(DEFAULT_BAND_LABELS);
  const [customQuotes, setCustomQuotes] = useState([]);

  // Notificação toast discreta (substitui alert/confirm)
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3800 ? null : prev));
    }, 4000);
  }, []);

  // ==========================================================================
  // TELA DE ABERTURA (2.2s)
  // ==========================================================================
  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1850);
    const hideTimer = setTimeout(() => setShowSplash(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // ==========================================================================
  // AUTENTICAÇÃO FIREBASE (RULE 3)
  // ==========================================================================
  useEffect(() => {
    if (!auth) {
      setIsLoadingData(false);
      setSyncStatus('Modo Local');
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        setSyncStatus('Offline');
        setIsLoadingData(false);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsLoadingData(false);
    });

    return () => unsubscribe();
  }, []);

  // ==========================================================================
  // SINCRONIZAÇÃO EM TEMPO REAL COM CLOUD FIRESTORE (RULE 1 & RULE 2)
  // ==========================================================================
  useEffect(() => {
    if (!user || !db) return;

    const uid = user.uid;
    setSyncStatus('Sincronizado');

    const unsubSettings = onSnapshot(
      doc(db, 'artifacts', appId, 'users', uid, 'settings', 'preferences'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (typeof d.darkMode === 'boolean') setDarkMode(d.darkMode);
          if (Array.isArray(d.subjects) && d.subjects.length > 0) setSubjects(d.subjects);
          if (Array.isArray(d.availableYears) && d.availableYears.length > 0)
            setAvailableYears(d.availableYears);
          if (d.xpConfig) setXpConfig({ ...DEFAULT_XP_CONFIG, ...d.xpConfig });
          if (d.bandLabels) setBandLabels({ ...DEFAULT_BAND_LABELS, ...d.bandLabels });
          if (Array.isArray(d.customQuotes)) setCustomQuotes(d.customQuotes);
        }
        setIsLoadingData(false);
      },
      () => {
        setIsLoadingData(false);
      }
    );

    const unsubExams = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'exams'),
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        setExams(list);
      },
      () => {}
    );

    const unsubChapters = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'libraryChapters'),
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        setLibraryChapters(list);
      },
      () => {}
    );

    const unsubSyllabi = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'examSyllabi'),
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        setExamSyllabi(list);
      },
      () => {}
    );

    const unsubReports = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'reports'),
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setReports(list);
      },
      () => {}
    );

    const unsubXp = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'xpActions'),
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        setXpActions(list);
      },
      () => {}
    );

    return () => {
      unsubSettings();
      unsubExams();
      unsubChapters();
      unsubSyllabi();
      unsubReports();
      unsubXp();
    };
  }, [user]);

  // ==========================================================================
  // FUNÇÕES DE PERSISTÊNCIA NO FIRESTORE
  // ==========================================================================
  const savePreferences = async (patch) => {
    if (!user || !db) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences'),
        patch,
        { merge: true }
      );
    } catch (e) {
      showToast('Erro ao salvar preferências na nuvem.', 'error');
    }
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    savePreferences({ darkMode: next });
  };

const awardXp = async (actionKey, label, refId, scoreValue) => {
  // SE FOR LIVRO, GARANTE QUE O VALOR SEJA EXATAMENTE 5 XP
  const finalScore = actionKey === 'book_topic_complete' ? 5 : (scoreValue || 10);
  
  console.log("1. Clique detectado:", { actionKey, label, refId, finalScore });
  


    const uniqueId = `${actionKey}_${refId}`;
    const jaExiste = xpActions.some((x) => x.id === uniqueId);
    if (jaExiste) return;

    // Usa a nota passada diretamente ou tenta buscar no array caso venha vazia
    const score = scoreValue !== undefined && scoreValue !== null 
      ? Number(scoreValue) 
      : Number(exams.find((e) => String(e.id) === String(refId))?.score || 0);
    
    // Sua lógica exata de faixas (1 a 6)
    let bandNumber = 1;
    if (score < 40) bandNumber = 1;
    else if (score < 50) bandNumber = 2;
    else if (score < 60) bandNumber = 3;
    else if (score < 80) bandNumber = 4;
    else if (score < 90) bandNumber = 5;
    else bandNumber = 6;

    // Calcula o XP baseado na faixa (ajuste o multiplicador se precisar, ex: * 50 ou * 10)
    let points = bandNumber * 10; 

    const entry = {
      id: uniqueId,
      actionKey,
      label,
      xp: points,
      refId,
      year: Number(selectedYear),
      createdAt: new Date().toISOString()
    };

    setXpActions((prev) => [...prev, entry]);

    if (user && db) {
      try {
        await setDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'xpActions', uniqueId),
          entry
        );
        console.log("SUCESSO! XP por faixa gravado:", points);
      } catch (e) {
        console.error("ERRO NO FIRESTORE:", e);
      }
    }
  };

 const persistExam = async (examObj) => {
    const isNew = !exams.some((e) => e.id === examObj.id);
    setExams((prev) => {
      const filtered = prev.filter((e) => e.id !== examObj.id);
      return [...filtered, examObj];
    });

    if (user && db) {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'exams', examObj.id),
        examObj
      );
    }

    if (!examObj.isDemo) {
      // Passamos o examObj.score aqui para garantir que o XP calcule na hora certa!
      await awardXp('registerExam', `Avaliação registrada (${examObj.examCode})`, examObj.id, examObj.score);
      if (examObj.topics && examObj.topics.length > 0) {
        await awardXp(
          'completeDiagnosis',
          `Diagnóstico por conteúdo (${examObj.examCode})`,
          examObj.id,
          examObj.score
        );
      }
    }
  };

  const removeExam = async (examId) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    if (user && db) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'exams', examId));
    }
    showToast('Avaliação removida e médias recalculadas.', 'success');
  };

  // ==========================================================================
  // DADOS DEMONSTRATIVOS (EXEMPLO CLARAMENTE IDENTIFICADO)
  // ==========================================================================
  const hasDemoData = useMemo(() => exams.some((e) => e.isDemo), [exams]);

  const loadDemoData = async () => {
    const demoExams = [
      {
        id: 'demo_mat_p1_2026',
        year: selectedYear,
        subjectId: 'mat',
        examCode: 'P1',
        trimester: 1,
        date: `${selectedYear}-03-18`,
        score: 76,
        isDemo: true,
        topics: [
          {
            topic: 'Progressão Aritmética',
            subtopic: 'Termo geral e soma',
            totalQuestions: 4,
            correctAnswers: 2,
            annulledQuestions: 0
          },
          {
            topic: 'Função Afim',
            subtopic: 'Gráficos e coeficientes',
            totalQuestions: 4,
            correctAnswers: 4,
            annulledQuestions: 0
          },
          {
            topic: 'Porcentagem e Juros',
            subtopic: 'Juros simples',
            totalQuestions: 2,
            correctAnswers: 1,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_mat_p2_2026',
        year: selectedYear,
        subjectId: 'mat',
        examCode: 'P2',
        trimester: 1,
        date: `${selectedYear}-04-25`,
        score: 84,
        isDemo: true,
        topics: [
          {
            topic: 'Função Quadrática',
            subtopic: 'Vértice e raízes',
            totalQuestions: 5,
            correctAnswers: 4,
            annulledQuestions: 0
          },
          {
            topic: 'Progressão Geométrica',
            subtopic: 'Razão e termo geral',
            totalQuestions: 5,
            correctAnswers: 4,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_fis_p1_2026',
        year: selectedYear,
        subjectId: 'fis',
        examCode: 'P1',
        trimester: 1,
        date: `${selectedYear}-03-20`,
        score: 58,
        isDemo: true,
        topics: [
          {
            topic: 'Cinemática Escalar',
            subtopic: 'MRUV e gráficos',
            totalQuestions: 5,
            correctAnswers: 2,
            annulledQuestions: 0
          },
          {
            topic: 'Vetores',
            subtopic: 'Decomposição vetorial',
            totalQuestions: 3,
            correctAnswers: 2,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_fis_p2_2026',
        year: selectedYear,
        subjectId: 'fis',
        examCode: 'P2',
        trimester: 1,
        date: `${selectedYear}-04-28`,
        score: 64,
        isDemo: true,
        topics: [
          {
            topic: 'Leis de Newton',
            subtopic: 'Plano inclinado e atrito',
            totalQuestions: 6,
            correctAnswers: 3,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_por_p1_2026',
        year: selectedYear,
        subjectId: 'por',
        examCode: 'P1',
        trimester: 1,
        date: `${selectedYear}-03-15`,
        score: 92,
        isDemo: true,
        topics: [
          {
            topic: 'Interpretação de Texto',
            subtopic: 'Gêneros textuais e inferência',
            totalQuestions: 6,
            correctAnswers: 6,
            annulledQuestions: 0
          },
          {
            topic: 'Funções da Linguagem',
            subtopic: 'Função poética e referencial',
            totalQuestions: 4,
            correctAnswers: 3,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_his_p1_2026',
        year: selectedYear,
        subjectId: 'his',
        examCode: 'P1',
        trimester: 1,
        date: `${selectedYear}-03-22`,
        score: 88,
        isDemo: true,
        topics: [
          {
            topic: 'Brasil Colônia',
            subtopic: 'Economia açucareira',
            totalQuestions: 5,
            correctAnswers: 5,
            annulledQuestions: 0
          }
        ]
      },
      {
        id: 'demo_qui_p1_2026',
        year: selectedYear,
        subjectId: 'qui',
        examCode: 'P1',
        trimester: 1,
        date: `${selectedYear}-03-25`,
        score: 72,
        isDemo: true,
        topics: [
          {
            topic: 'Estequiometria',
            subtopic: 'Cálculo molar e pureza',
            totalQuestions: 5,
            correctAnswers: 3,
            annulledQuestions: 0
          }
        ]
      }
    ];

    for (const item of demoExams) {
      await persistExam(item);
    }
    showToast('Dados demonstrativos carregados (marcados como Exemplo).', 'success');
  };

  const clearDemoData = async () => {
    const demoItems = exams.filter((e) => e.isDemo);
    for (const item of demoItems) {
      await removeExam(item.id);
    }
    showToast('Dados de exemplo removidos com sucesso.', 'info');
  };

  // ==========================================================================
  // CÁLCULOS CONSOLIDADOS DO ANO SELECIONADO E HISTÓRICO GERAL
  // ==========================================================================
  const yearExams = useMemo(
    () => exams.filter((e) => Number(e.year) === Number(selectedYear)),
    [exams, selectedYear]
  );

  const subjectYearMatrix = useMemo(() => {
    return subjects.map((subj) => {
      const subjExams = yearExams.filter((e) => e.subjectId === subj.id);
      const stats = calculateSubjectYearStats(subjExams);
      return {
        subject: subj,
        ...stats
      };
    });
  }, [subjects, yearExams]);

  const dashboardMetrics = useMemo(() => {
    const subjectsWithData = subjectYearMatrix.filter((s) => s.annualAvg !== null);
    const generalAvg =
      subjectsWithData.length > 0
        ? subjectsWithData.reduce((acc, cur) => acc + cur.annualAvg, 0) / subjectsWithData.length
        : null;

    const sortedSubjects = [...subjectsWithData].sort((a, b) => b.annualAvg - a.annualAvg);
    const bestSubject = sortedSubjects[0] || null;
    const worstSubject =
      sortedSubjects.length > 0 ? sortedSubjects[sortedSubjects.length - 1] : null;

    // Médias por área no ano
    const areaStats = AREAS_ORDER.map((areaName) => {
      const areaSubjs = subjectsWithData.filter((s) => s.subject.area === areaName);
      const avg =
        areaSubjs.length > 0
          ? areaSubjs.reduce((acc, cur) => acc + cur.annualAvg, 0) / areaSubjs.length
          : null;
      return { area: areaName, avg, count: areaSubjs.length };
    });

    // Evolução P1 a P6 no ano
    const pEvolution = EXAMS_MAP.map((exInfo) => {
      const matching = yearExams.filter((e) => e.examCode === exInfo.id);
      const avg =
        matching.length > 0
          ? matching.reduce((acc, cur) => acc + Number(cur.score), 0) / matching.length
          : null;
      return { label: exInfo.label, value: avg };
    });

    // Médias trimestrais gerais
    const trimesterStats = [1, 2, 3].map((tNum) => {
      const subjsWithT = subjectYearMatrix.filter((s) => s[`T${tNum}`] !== null);
      const avg =
        subjsWithT.length > 0
          ? subjsWithT.reduce((acc, cur) => acc + cur[`T${tNum}`], 0) / subjsWithT.length
          : null;
      return { label: `${tNum}º Trimestre`, value: avg };
    });

    // Tópicos com menor aproveitamento (apenas onde há dados reais)
    const topicMap = {};
    yearExams.forEach((ex) => {
      const subj = subjects.find((s) => s.id === ex.subjectId);
      (ex.topics || []).forEach((t) => {
        const validQ = Math.max(0, Number(t.totalQuestions || 0) - Number(t.annulledQuestions || 0));
        if (validQ <= 0) return;
        const key = `${ex.subjectId}::${t.topic}`;
        if (!topicMap[key]) {
          topicMap[key] = {
            topic: t.topic,
            subjectName: subj ? subj.name : ex.subjectId,
            correct: 0,
            total: 0
          };
        }
        topicMap[key].correct += Number(t.correctAnswers || 0);
        topicMap[key].total += validQ;
      });
    });

    const attentionTopics = Object.values(topicMap)
      .map((item) => ({
        ...item,
        accuracy: (item.correct / item.total) * 100
      }))
      .filter((item) => item.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    const recentExams = [...yearExams]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 5);

    return {
      generalAvg,
      bestSubject,
      worstSubject,
      totalExamsCount: yearExams.length,
      areaStats,
      pEvolution,
      trimesterStats,
      attentionTopics,
      recentExams,
      subjectsWithData
    };
  }, [subjectYearMatrix, yearExams, subjects]);

  // Frase motivacional diária automática baseada na data local
  const dailyQuote = useMemo(() => {
    const allQuotes = [...DEFAULT_MOTIVATIONAL_QUOTES, ...customQuotes];
    const now = new Date();
    const daySeed =
      now.getFullYear() * 1000 + (now.getMonth() + 1) * 40 + now.getDate();
    return allQuotes[daySeed % allQuotes.length];
  }, [customQuotes]);

  // Cálculo de XP e Nível (independente das 6 faixas escolares)
const gamificationStats = useMemo(() => {
    // Filtra diretamente pelo ano gravado no XP ou pelo exame correspondente
    const filteredXpActions = xpActions.filter((action) => {
      if (action.year) {
        return Number(action.year) === Number(selectedYear);
      }
      // Fallback para ações antigas que não tinham o campo year
      const matchExam = exams.find((e) => String(e.id) === String(action.refId));
      if (matchExam) return Number(matchExam.year) === Number(selectedYear);
      return Number(selectedYear) === 2026; // Padrão antigo
    });

    const totalXp = filteredXpActions.reduce((acc, cur) => acc + Number(cur.xp || 0), 0);
    let currentLevel = XP_LEVELS[0];
    let nextLevel = XP_LEVELS[1] || null;

    for (let i = 0; i < XP_LEVELS.length; i++) {
      if (totalXp >= XP_LEVELS[i].minXp) {
        currentLevel = XP_LEVELS[i];
        nextLevel = XP_LEVELS[i + 1] || null;
      }
    }

    const progressPercent = nextLevel
      ? Math.min(
          100,
          Math.round(
            ((totalXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
          )
        )
      : 100;

    return { totalXp, currentLevel, nextLevel, progressPercent };
  }, [xpActions, exams, selectedYear]);

  // Estado de edição rápida enviada do Boletim para Inserir Notas
  const [editingExamToLoad, setEditingExamToLoad] = useState(null);

  const handleEditExamFromHistory = (exam) => {
    setEditingExamToLoad(exam);
    setActiveTab('Inserir notas');
  };

  
  // ==========================================================================
  // INTERFACE PRINCIPAL
  // ==========================================================================
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#007AFF]/20 selection:text-[#007AFF]">
        {/* CABEÇALHO FIXO ESTILO APPLE */}
      <header className="sticky top-0 z-30 w-full px-6 bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 print:hidden">
  <div className="flex items-center justify-between h-16 w-full">
    <div className="flex items-center justify-between h-16 w-full">
      
      {/* 1. LADO ESQUERDO: LOGO */}
      <div className="flex items-center shrink-0">
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className="flex items-center focus:outline-none group"
        >
          <img 
            src="/logocompleta.png" 
            alt="Plataforma Baratta" 
            className="h-12 w-auto object-contain" 
          />
        </button>
      </div>

      {/* 2. CENTRO: ABAS DE NAVEGAÇÃO PRINCIPAL */}
      <nav className="hidden lg:flex items-center space-x-1 mx-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-[#007AFF] text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* 3. LADO DIREITO: CONTROLES GLOBAIS (ANO, STATUS, TEMA) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
          <span>{syncStatus}</span>
        </div>

        <select
          aria-label="Selecionar ano letivo"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border border-transparent focus:border-[#007AFF] focus:outline-none cursor-pointer"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr} className="bg-white dark:bg-[#1C1C1E]">
              {yr}
            </option>
          ))}
        </select>

        <button
          onClick={toggleDarkMode}
          aria-label="Alternar tema claro ou escuro"
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/15 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

    </div>

    {/* BARRA DE NAVEGAÇÃO MOBILE / TABLET (LOGO ABAIXO DO TOPO EM TELAS MENORES) */}
    <div className="flex lg:hidden items-center gap-1.5 pb-3 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#007AFF] text-white'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>

  </div>
</header>

        {/* BANNER DISCRETO PARA DADOS DE EXEMPLO */}
        {hasDemoData && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 print:hidden">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Modo de Demonstração Ativo:</strong> Existem registros marcados como{' '}
                  <span className="underline">Exemplo</span> para validação visual.
                </span>
              </div>
              <button
                onClick={clearDemoData}
                className="font-semibold text-amber-900 dark:text-amber-200 hover:underline"
              >
                Remover dados de exemplo
              </button>
            </div>
          </div>
        )}

        {/* TOAST DE FEEDBACK */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-fade-in print:hidden">
            <CheckCircle2 className="w-4 h-4 text-[#007AFF] shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL DAS 8 ABAS */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'Dashboard' && (
            <DashboardTab
              selectedYear={selectedYear}
              metrics={dashboardMetrics}
              bandLabels={bandLabels}
              dailyQuote={dailyQuote}
              onAddQuote={async (text, author) => {
                const updated = [...customQuotes, { text, author: author || 'Acervo Pessoal' }];
                setCustomQuotes(updated);
                await savePreferences({ customQuotes: updated });
                showToast('Nova frase adicionada ao acervo diário.', 'success');
              }}
              subjects={subjects}
              hasDemoData={hasDemoData}
              onLoadDemo={loadDemoData}
              onClearDemo={clearDemoData}
              onNavigate={setActiveTab}
              gamificationStats={gamificationStats}
            />
          )}

          {activeTab === 'Inserir notas' && (
            <InsertGradesTab
              selectedYear={selectedYear}
              subjects={subjects}
              onAddSubject={async (newSubj) => {
                const updated = [...subjects, newSubj];
                setSubjects(updated);
                await savePreferences({ subjects: updated });
                showToast(` "${newSubj.name}" adicionada.`, 'success');
              }}
              examSyllabi={examSyllabi}
              onSaveExam={async (examObj) => {
                await persistExam(examObj);
                setEditingExamToLoad(null);
                showToast('Avaliação salva e indicadores atualizados.', 'success');
              }}
              editingExam={editingExamToLoad}
              onCancelEdit={() => setEditingExamToLoad(null)}
              showToast={showToast}
            />
          )}

          {activeTab === 'Boletim' && (
            <ReportCardTab
              selectedYear={selectedYear}
              subjectYearMatrix={subjectYearMatrix}
              bandLabels={bandLabels}
              onUpdateBandLabels={async (newLabels) => {
                setBandLabels(newLabels);
                await savePreferences({ bandLabels: newLabels });
                showToast('Nomes das faixas atualizados.', 'success');
              }}
              onEditExam={handleEditExamFromHistory}
              onDeleteExam={removeExam}
            />
          )}

          {activeTab === 'Estatísticas' && (
            <StatisticsTab
              selectedYear={selectedYear}
              availableYears={availableYears}
              exams={exams}
              subjects={subjects}
              bandLabels={bandLabels}
            />
          )}

          {activeTab === 'Relatórios' && (
            <ReportsTab
              selectedYear={selectedYear}
              exams={exams}
              subjects={subjects}
              db={db}
             user={user}
             appId={appId}
              examSyllabi={examSyllabi}
              reports={reports}
              bandLabels={bandLabels}
              onSaveReport={async (rep) => {
                setReports((prev) => [rep, ...prev]);
                if (user && db) {
                  await setDoc(
                    doc(db, 'artifacts', appId, 'users', user.uid, 'reports', rep.id),
                    rep
                  );
                }
                await awardXp(
                  'generateReport',
                  `Relatório inteligente gerado (${rep.trimester || 'Geral'})`,
                  rep.id
                );
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'Biblioteca' && (
            <LibraryTab
              selectedYear={selectedYear}
              subjects={subjects}
              chapters={libraryChapters}
              syllabi={examSyllabi}
              onSaveChapter={async (chap) => {
                setLibraryChapters((prev) => {
                  const filtered = prev.filter((c) => c.id !== chap.id);
                  return [...filtered, chap];
                });
                if (user && db) {
                  await setDoc(
                    doc(db, 'artifacts', appId, 'users', user.uid, 'libraryChapters', chap.id),
                    chap
                  );
                }
                await awardXp(
                  'uploadChapter',
                  `Capítulo organizado na Biblioteca (Cap. ${chap.chapterNumber})`,
                  chap.id
                );
              }}
              onDeleteChapter={async (chapId) => {
                setLibraryChapters((prev) => prev.filter((c) => c.id !== chapId));
                if (user && db) {
                  await deleteDoc(
                    doc(db, 'artifacts', appId, 'users', user.uid, 'libraryChapters', chapId)
                  );
                }
                showToast('Capítulo removido do acervo.', 'info');
              }}
              onSaveSyllabus={async (syl) => {
                setExamSyllabi((prev) => {
                  const filtered = prev.filter((s) => s.id !== syl.id);
                  return [...filtered, syl];
                });
                if (user && db) {
                  await setDoc(
                    doc(db, 'artifacts', appId, 'users', user.uid, 'examSyllabi', syl.id),
                    syl
                  );
                }
                await awardXp(
                  'approveSyllabus',
                  `Conteúdos aprovados (${syl.examCode})`,
                  syl.id
                );
              }}
              showToast={showToast}
            />
          )}
          {activeTab === 'Livros' && (
  <BooksTab
    awardXp={awardXp}
    savePreferences={savePreferences}
    selectedYear={selectedYear}
    showToast={showToast}
    user={user}
    db={db}
    appId={appId}
  />
)}
          
          {activeTab === 'Ranking' && (
  <RankingTab 
    exams={exams} 
    subjects={subjects} 
    bandLabels={bandLabels} 
    selectedYear={selectedYear} 
  />
)}

          {activeTab === 'Progresso' && (
            <AchievementsTab
              gamificationStats={gamificationStats}
              xpActions={xpActions}
              xpConfig={xpConfig}
              exams={exams}
              libraryChapters={libraryChapters}
              reports={reports}
              onUpdateXpConfig={async (newCfg) => {
                setXpConfig(newCfg);
                await savePreferences({ xpConfig: newCfg });
                showToast('Valores de XP atualizados.', 'success');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// ABA 1: DASHBOARD
// ============================================================================

function DashboardTab({
  selectedYear,
  metrics,
  bandLabels,
  dailyQuote,
  onAddQuote,
  subjects,
  hasDemoData,
  onLoadDemo,
  onClearDemo,
  onNavigate,
  gamificationStats
}) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  const generalBand = getPerformanceBand(metrics.generalAvg, bandLabels);

  return (
    <div className="space-y-6">
      {/* TOPO: SAUDAÇÃO, FRASE MOTIVACIONAL DIÁRIA E AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AppleCard className="lg:col-span-2 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50/80 dark:from-[#1C1C1E] dark:to-[#161618]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#007AFF]">
                Central de Inteligência Acadêmica • {selectedYear}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                Visão Geral de Desempenho
              </h1>
            </div>
            <button
              onClick={() => setShowQuoteModal(true)}
              title="Adicionar nova frase motivacional"
              className="text-xs font-medium text-slate-500 hover:text-[#007AFF] dark:text-slate-400 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 transition-colors shrink-0"
            >
              + Frase
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-white/10">
            <p className="text-sm sm:text-base italic text-slate-700 dark:text-slate-200 leading-relaxed">
              “{dailyQuote.text}”
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              — {dailyQuote.author} • Reflexão do dia
            </p>
          </div>
        </AppleCard>

        <AppleCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Consistência na Plataforma
              </span>
              <span className="text-xs font-bold text-[#007AFF]">
                Nível {gamificationStats.currentLevel.level} • {gamificationStats.currentLevel.name}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {gamificationStats.totalXp}
              </span>
              <span className="text-xs font-medium text-slate-500">XP acumulado</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                style={{ width: `${gamificationStats.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => onNavigate('Inserir notas')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#007AFF] text-white px-3.5 py-2 rounded-xl hover:bg-[#0066D6] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Nota
            </button>

            {!hasDemoData ? (
              <button
                onClick={onLoadDemo}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline"
              >
                Carregar exemplo
              </button>
            ) : (
              <button
                onClick={onClearDemo}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Limpar exemplo
              </button>
            )}
          </div>
        </AppleCard>
      </div>

      {/* KPIS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppleCard>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Média Geral ({selectedYear})
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {formatScore(metrics.generalAvg)}
            </span>
            {generalBand && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${generalBand.badgeClass}`}
              >
                {generalBand.label}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Escala 0 a 100 • Apenas períodos com notas
          </p>
        </AppleCard>

        <AppleCard>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Melhor 
          </span>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {metrics.bestSubject ? metrics.bestSubject.subject.name : '—'}
            </div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {metrics.bestSubject ? `Média ${formatScore(metrics.bestSubject.annualAvg)}` : 'Sem dados'}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Maior desempenho acumulado no ano</p>
        </AppleCard>

        <AppleCard>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Menor Média
          </span>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {metrics.worstSubject ? metrics.worstSubject.subject.name : '—'}
            </div>
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
              {metrics.worstSubject
                ? `Média ${formatScore(metrics.worstSubject.annualAvg)}`
                : 'Sem dados'}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Prioridade de acompanhamento</p>
        </AppleCard>

        <AppleCard>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Avaliações Cadastradas
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {metrics.totalExamsCount}
            </span>
            <span className="text-xs text-slate-500">provas em {selectedYear}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {metrics.subjectsWithData.length} de {subjects.length} s avaliadas
          </p>
        </AppleCard>
      </div>

      {/* GRÁFICOS PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppleCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Evolução de Notas (P1 a P6)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Média geral por ciclo de avaliação em {selectedYear}
              </p>
            </div>
          </div>
          <LineEvolutionChart dataPoints={metrics.pEvolution} />
        </AppleCard>

        <AppleCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Médias Trimestrais
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consolidado por trimestre letivo
              </p>
            </div>
          </div>
          <LineEvolutionChart dataPoints={metrics.trimesterStats} />
        </AppleCard>

        <AppleCard>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Comparação entre s
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Médias anuais (ou provisórias) das matérias avaliadas
          </p>
          <HorizontalBarChart
            items={[...metrics.subjectsWithData]
              .sort((a, b) => b.annualAvg - a.annualAvg)
              .map((s) => ({
                label: s.subject.name,
                sublabel: s.isAnnualProvisional ? '(Provisória)' : '',
                value: s.annualAvg
              }))}
          />
        </AppleCard>

        <AppleCard>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Comparação entre Áreas do Conhecimento
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Desempenho médio agrupado por área ENEM
          </p>
          <HorizontalBarChart
            items={metrics.areaStats
              .filter((a) => a.avg !== null)
              .sort((a, b) => b.avg - a.avg)
              .map((a) => ({
                label: a.area,
                sublabel: `(${a.count} ${a.count === 1 ? 'matéria' : 'matérias'})`,
                value: a.avg
              }))}
          />
        </AppleCard>
      </div>

      {/* PONTOS DE ATENÇÃO E DESEMPENHO RECENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppleCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Principais Pontos de Atenção
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conteúdos com aproveitamento abaixo de 75% nas provas diagnosticadas
              </p>
            </div>
            <button
              onClick={() => onNavigate('Relatórios')}
              className="text-xs font-semibold text-[#007AFF] hover:underline"
            >
              Ver Relatório IA
            </button>
          </div>

          {metrics.attentionTopics.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
              Nenhum conteúdo crítico identificado com os dados atuais.
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.attentionTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.topic}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.subjectName} • {item.correct}/{item.total} acertos
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      item.accuracy < 60
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.accuracy.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </AppleCard>

        <AppleCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Desempenho Recente
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimas avaliações registradas em {selectedYear}
              </p>
            </div>
            <button
              onClick={() => onNavigate('Boletim')}
              className="text-xs font-semibold text-[#007AFF] hover:underline"
            >
              Abrir Boletim
            </button>
          </div>

          {metrics.recentExams.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
              Nenhuma avaliação registrada ainda para {selectedYear}.
            </p>
          ) : (
            <div className="space-y-2.5">
              {metrics.recentExams.map((ex) => {
                const subj = subjects.find((s) => s.id === ex.subjectId);
                const band = getPerformanceBand(ex.score, bandLabels);
                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>{subj ? subj.name : ex.subjectId}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {ex.examCode}
                        </span>
                        {ex.isDemo && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">
                            Exemplo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {ex.trimester}º Trimestre {ex.date ? `• ${ex.date}` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatScore(ex.score)}
                      </div>
                      {band && (
                        <span className="text-[11px] font-medium text-slate-500">
                          {band.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AppleCard>
      </div>

      {/* MODAL ADICIONAR FRASE */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AppleCard className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Adicionar Frase Motivacional</h3>
              <button onClick={() => setShowQuoteModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Frase</label>
                <textarea
                  rows={3}
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Digite uma frase inspiradora sobre disciplina e foco..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-sm focus:border-[#007AFF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Autor ou Fonte (opcional)
                </label>
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Ex.: Sêneca"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm focus:border-[#007AFF] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!newQuoteText.trim()) return;
                    onAddQuote(newQuoteText.trim(), newQuoteAuthor.trim());
                    setNewQuoteText('');
                    setNewQuoteAuthor('');
                    setShowQuoteModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#007AFF] text-white"
                >
                  Salvar Frase
                </button>
              </div>
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ABA 2: INSERIR NOTAS (COM ORGANIZAÇÃO POR IA E CONFERÊNCIA OBRIGATÓRIA)
// ============================================================================
function InsertGradesTab({
  selectedYear,
  subjects,
  onAddSubject,
  examSyllabi,
  onSaveExam,
  editingExam,
  onCancelEdit,
  showToast
}) {
  const [year, setYear] = useState(selectedYear);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'mat');
  const [examCode, setExamCode] = useState('P1');
  const [date, setDate] = useState('');
  const [score, setScore] = useState('');
  const [examFileName, setExamFileName] = useState('');
  const [examFileInline, setExamFileInline] = useState(null);

  // Registro detalhado por conteúdo
  const [includeTopics, setIncludeTopics] = useState(true);
  const [topicsList, setTopicsList] = useState([]);
  const [rawMappingText, setRawMappingText] = useState('');
  const [isAiOrganizing, setIsAiOrganizing] = useState(false);
  const [aiReviewPending, setAiReviewPending] = useState(false);

  // Modal nova matéria / Redação
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjArea, setNewSubjArea] = useState('Redação');

  useEffect(() => {
    setYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (editingExam) {
      setYear(editingExam.year);
      setSubjectId(editingExam.subjectId);
      setExamCode(editingExam.examCode);
      setDate(editingExam.date || '');
      setScore(String(editingExam.score));
      setExamFileName(editingExam.fileName || '');
      setTopicsList(editingExam.topics || []);
      setIncludeTopics((editingExam.topics || []).length > 0);
      setAiReviewPending(false);
    }
  }, [editingExam]);

  const currentTrimester = useMemo(() => {
    const found = EXAMS_MAP.find((e) => e.id === examCode);
    return found ? found.trimester : 1;
  }, [examCode]);

  // Conteúdos aprovados previamente na Biblioteca para esta matéria/prova
  const approvedSyllabusTopics = useMemo(() => {
    const matching = examSyllabi.filter(
      (s) => s.subjectId === subjectId && (s.examCode === examCode || Number(s.year) === Number(year))
    );
    const names = [];
    matching.forEach((s) => {
      (s.topics || []).forEach((t) => {
        if (!names.includes(t.name)) names.push(t.name);
      });
    });
    return names;
  }, [examSyllabi, subjectId, examCode, year]);

  const handleExamFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExamFileName(file.name);

    if (file.size < 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = String(reader.result).split(',')[1];
        setExamFileInline({ mimeType: file.type || 'application/pdf', data: base64 });
      };
      reader.readAsDataURL(file);
    }
    showToast(`Arquivo "${file.name}" anexado como contexto.`, 'info');
  };

  const handleAddEmptyTopicRow = (presetName = '') => {
    setTopicsList((prev) => [
      ...prev,
      {
        topic: presetName,
        subtopic: '',
        totalQuestions: 1,
        correctAnswers: 1,
        annulledQuestions: 0
      }
    ]);
  };

  const handleUpdateTopicRow = (index, field, value) => {
    setTopicsList((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveTopicRow = (index) => {
    setTopicsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // IA organiza estritamente o mapeamento informado pelo aluno (sem inventar)
const handleAiOrganizeMapping = () => {
    if (!rawMappingText.trim()) {
      showToast('Descreva quais conteúdos e acertos deseja organizar.', 'error');
      return;
    }

    setIsAiOrganizing(true);
    try {
      // Divide o texto por ponto e vírgula (;) ou quebras de linha (\n)
      const lines = rawMappingText
        .split(/[;\n]+/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const parsedItems = [];

      lines.forEach((line) => {
        // Separa o nome do conteúdo do restante da frase (usando :, - ou =)
        const separatorMatch = line.match(/^([^:=\-]+)[:=\-]\s*(.+)$/);
        
        let topicRaw = '';
        let statsPart = '';

        if (separatorMatch) {
          topicRaw = separatorMatch[1].trim();
          statsPart = separatorMatch[2].trim();
        } else {
          // Caso não tenha separador explícito, tenta extrair o texto antes do primeiro número
          const fallbackMatch = line.match(/^([^\d]+)\s+(\d+.*)$/);
          if (fallbackMatch) {
            topicRaw = fallbackMatch[1].trim();
            statsPart = fallbackMatch[2].trim();
          } else {
            return; // Ignora linhas sem padrão identificável
          }
        }

        // Verifica se há subtópico separado por parênteses ou barra (ex: "Funções (Afim)" ou "Funções > Afim")
        let topic = topicRaw;
        let subtopic = '';
        const subtopicMatch = topicRaw.match(/^(.+?)\s*(?:\(([^)]+)\)|>\s*(.+))$/);
        if (subtopicMatch) {
          topic = subtopicMatch[1].trim();
          subtopic = (subtopicMatch[2] || subtopicMatch[3] || '').trim();
        }

        let totalQuestions = 0;
        let correctAnswers = 0;
        let annulledQuestions = 0;

        // 1. Detecta questões anuladas (ex: "1 anulada", "2 anuladas")
        const annulledMatch = statsPart.match(/(\d+)\s*anulad[ao]s?/i);
        if (annulledMatch) {
          annulledQuestions = parseInt(annulledMatch[1], 10);
        }

        // 2. Detecta formato fração ou "de/em" (ex: "3/4", "3 de 4", "3 acertos de 4", "3 em 4")
        const fractionMatch = statsPart.match(/(\d+)\s*(?:acertos?\s*)?(?:\/|de|em)\s*(\d+)/i);
        
        if (fractionMatch) {
          correctAnswers = parseInt(fractionMatch[1], 10);
          totalQuestions = parseInt(fractionMatch[2], 10);
        } else {
          // 3. Detecta formato descritivo (ex: "4 questões, 3 acertos")
          const totalMatch = statsPart.match(/(\d+)\s*(?:quest[õo]es|quest[ãa]o|q\b)/i);
          const correctMatch = statsPart.match(/(\d+)\s*(?:acertos?|certas?|acertou)/i);

          if (totalMatch) totalQuestions = parseInt(totalMatch[1], 10);
          if (correctMatch) correctAnswers = parseInt(correctMatch[1], 10);
        }

        // Garante consistência caso o usuário informe só acertos + anuladas
        if (totalQuestions === 0 && (correctAnswers > 0 || annulledQuestions > 0)) {
          totalQuestions = correctAnswers + annulledQuestions;
        }

        // Só adiciona se houver algum dado válido
        if (topic && (totalQuestions > 0 || correctAnswers > 0)) {
          parsedItems.push({
            topic,
            subtopic,
            totalQuestions,
            correctAnswers: Math.min(correctAnswers, totalQuestions),
            annulledQuestions
          });
        }
      });

      if (parsedItems.length === 0) {
        showToast(
          'Não consegui identificar os números. Tente algo como: "Logaritmos: 4/5" ou "PA: 4 questões, 3 acertos".',
          'error'
        );
      } else {
        setTopicsList(parsedItems);
        setAiReviewPending(true);
        showToast(`${parsedItems.length} conteúdo(s) organizados! Confira abaixo antes de salvar.`, 'success');
      }
    } catch (err) {
      showToast('Erro ao processar o texto. Verifique a formatação e tente novamente.', 'error');
    } finally {
      setIsAiOrganizing(false);
    }
  };

  const handleSubmitExam = async (e) => {
    e.preventDefault();
    const numericScore = Number(String(score).replace(',', '.'));
    if (score === '' || Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      showToast('Informe uma nota válida na escala de 0 a 100.', 'error');
      return;
    }

    const sanitizedTopics = includeTopics
      ? topicsList
          .filter((t) => t.topic && t.topic.trim().length > 0)
          .map((t) => ({
            topic: t.topic.trim(),
            subtopic: (t.subtopic || '').trim(),
            totalQuestions: Math.max(0, Number(t.totalQuestions || 0)),
            correctAnswers: Math.max(0, Number(t.correctAnswers || 0)),
            annulledQuestions: Math.max(0, Number(t.annulledQuestions || 0))
          }))
      : [];

    const examId = `${year}_${subjectId}_${examCode}_${currentTrimester}`;

    await onSaveExam({
      id: examId,
      year: Number(year),
      subjectId,
      examCode,
      trimester: currentTrimester,
      date: date || null,
      score: numericScore,
      fileName: examFileName || null,
      topics: sanitizedTopics,
      isDemo: false,
      updatedAt: new Date().toISOString()
    });
  
// Descobre o nível da nota (de 1 a 6) com base no numericScore
    let nivelNota = 1;
    if (numericScore > 85) nivelNota = 6;      // Notas altas (ex: 100) = Nível 6 -> 60 XP
    else if (numericScore > 70) nivelNota = 5; // Nível 5 -> 50 XP
    else if (numericScore > 55) nivelNota = 4; // Nível 4 -> 40 XP
    else if (numericScore > 40) nivelNota = 3; // Nível 3 -> 30 XP
    else if (numericScore > 25) nivelNota = 2; // Nível 2 -> 20 XP
    // Se for abaixo disso, fica no Nível 1 -> 10 XP

    // Calcula o XP: Nível × 10
    const xpGanho = nivelNota * 10;

    // Dispara a notificação toast com o XP correto
    showToast(`+${xpGanho} XP conquistados! (Nota 100 - Nível ${nivelNota})`, 'success');

    // 2. Dispara a notificação toast no canto inferior direito
    showToast(`+${xpGanho} XP! Nota registrada com sucesso.`, 'success');
    // Resetar formulário
    setScore('');
    setDate('');
    setExamFileName('');
    setExamFileInline(null);
    setTopicsList([]);
    setRawMappingText('');
    setAiReviewPending(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {editingExam ? 'Editar Avaliação Cadastrada' : 'Inserir Notas e Diagnóstico'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Registre a nota na escala de 0 a 100 e opcionalmente detalhe seu desempenho por conteúdo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewSubjectModal(true)}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-slate-100 hover:bg-slate-300/70 transition-colors"
        >
          + Nova Matéria / Redação
        </button>
      </div>

      <form onSubmit={handleSubmitExam} className="space-y-6">
        <AppleCard className="space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            1. Identificação da Avaliação
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Matéria</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm font-medium focus:border-[#007AFF] focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-[#1C1C1E]">
                    {s.name} ({s.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Prova (Trimestre Automático)
              </label>
              <select
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm font-medium focus:border-[#007AFF] focus:outline-none"
              >
                {EXAMS_MAP.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-white dark:bg-[#1C1C1E]">
                    {ex.label} — {ex.trimester}º Trimestre
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Nota Final (0 a 100) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Ex.: 85"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm font-bold text-[#007AFF] focus:border-[#007AFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Data da Prova (Opcional)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm focus:border-[#007AFF] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Arquivo da Prova em PDF ou Imagem (Opcional)
              </label>
              <label className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-white/15 bg-slate-50/70 dark:bg-white/5 cursor-pointer hover:border-[#007AFF] transition-colors">
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {examFileName || 'Selecionar arquivo PDF ou imagem da prova...'}
                </span>
                <Upload className="w-4 h-4 text-[#007AFF] shrink-0" />
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleExamFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </AppleCard>

        {/* SEÇÃO 2: DETALHAMENTO POR CONTEÚDO */}
        <AppleCard className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                2. Desempenho por Conteúdo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informe seus acertos por assunto para diagnóstico preciso. Questões anuladas são excluídas do cálculo.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={includeTopics}
                onChange={(e) => setIncludeTopics(e.target.checked)}
                className="rounded text-[#007AFF] focus:ring-[#007AFF]"
              />
              <span>Detalhar conteúdos desta prova</span>
            </label>
          </div>

          {!includeTopics ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#007AFF] shrink-0" />
              <span>
                Somente a nota final será registrada. O sistema indicará que ainda não há dados suficientes para diagnóstico por conteúdo nesta prova.
              </span>
            </div>
          ) : (
            <div className="space-y-5">
              {/* SUGESTÕES APROVADAS DA BIBLIOTECA */}
              {approvedSyllabusTopics.length > 0 && (
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-2">
                    Conteúdos aprovados na Biblioteca para esta matéria (clique para adicionar):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {approvedSyllabusTopics.map((tName, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddEmptyTopicRow(tName)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#007AFF]/10 text-[#007AFF] font-medium hover:bg-[#007AFF]/20 transition-colors"
                      >
                        + {tName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ORGANIZADOR ASSISTIDO POR IA */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#007AFF]">
                  <Sparkles className="w-4 h-4" />
                  <span>Organização Assistida por Inteligência Artificial</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Descreva o mapeamento das questões e seus acertos. A IA estruturará por conteúdo e subtópico sem inventar informações.
                </p>
                <textarea
                  rows={2}
                  value={rawMappingText}
                  onChange={(e) => setRawMappingText(e.target.value)}
                  placeholder="Ex.: Progressão Aritmética: 4 questões, 3 acertos; Função Afim: 3 questões, 2 acertos; Equações: 2 questões, 1 acerto e 1 anulada."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] p-3 text-xs sm:text-sm focus:border-[#007AFF] focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isAiOrganizing}
                    onClick={handleAiOrganizeMapping}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#007AFF] text-white hover:bg-[#0066D6] disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAiOrganizing ? 'Organizando...' : 'Organizar com IA'}
                  </button>
                </div>
              </div>

              {aiReviewPending && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
                  <span>
                    <strong>Conferência Obrigatória:</strong> Revise abaixo os conteúdos organizados pela IA antes de salvar.
                  </span>
                  <button
                    type="button"
                    onClick={() => setAiReviewPending(false)}
                    className="font-semibold underline ml-2"
                  >
                    Conferido
                  </button>
                </div>
              )}

              {/* TABELA DE CONTEÚDOS DA PROVA */}
              <div className="space-y-3">
                {topicsList.map((row, idx) => {
                  const validQ = Math.max(
                    0,
                    Number(row.totalQuestions || 0) - Number(row.annulledQuestions || 0)
                  );
                  const errors = Math.max(0, validQ - Number(row.correctAnswers || 0));
                  const pct = validQ > 0 ? (Number(row.correctAnswers || 0) / validQ) * 100 : null;

                  let statusBadge = (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500">
                      Sem dados
                    </span>
                  );
                  if (pct !== null) {
                    if (pct >= 80) {
                      statusBadge = (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Bom ({pct.toFixed(0)}%)
                        </span>
                      );
                    } else if (pct >= 60) {
                      statusBadge = (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          Intermediário ({pct.toFixed(0)}%)
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400">
                          Baixo ({pct.toFixed(0)}%)
                        </span>
                      );
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#161618] space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] text-slate-400 mb-1">Conteúdo</label>
                          <input
                            type="text"
                            value={row.topic}
                            onChange={(e) => handleUpdateTopicRow(idx, 'topic', e.target.value)}
                            placeholder="Ex.: Progressão Aritmética"
                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] text-slate-400 mb-1">Subtópico</label>
                          <input
                            type="text"
                            value={row.subtopic || ''}
                            onChange={(e) => handleUpdateTopicRow(idx, 'subtopic', e.target.value)}
                            placeholder="Ex.: Termo geral"
                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] text-slate-400 mb-1">Questões</label>
                          <input
                            type="number"
                            min="0"
                            value={row.totalQuestions}
                            onChange={(e) =>
                              handleUpdateTopicRow(idx, 'totalQuestions', Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-1.5 text-xs text-center font-semibold"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] text-slate-400 mb-1">Acertos</label>
                          <input
                            type="number"
                            min="0"
                            max={row.totalQuestions}
                            value={row.correctAnswers}
                            onChange={(e) =>
                              handleUpdateTopicRow(idx, 'correctAnswers', Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-1.5 text-xs text-center font-semibold text-emerald-600"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] text-slate-400 mb-1">Anuladas</label>
                          <input
                            type="number"
                            min="0"
                            max={row.totalQuestions}
                            value={row.annulledQuestions || 0}
                            onChange={(e) =>
                              handleUpdateTopicRow(idx, 'annulledQuestions', Number(e.target.value))
                            }
                            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-1.5 text-xs text-center"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                          {statusBadge}
                          <button
                            type="button"
                            onClick={() => handleRemoveTopicRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 flex gap-4">
                        <span>Válidas: {validQ}</span>
                        <span>Erros: {errors}</span>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleAddEmptyTopicRow('')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar linha de conteúdo manualmente
                </button>
              </div>
            </div>
          )}
        </AppleCard>

        {/* BOTÕES FINAIS */}
        <div className="flex items-center justify-end gap-3">
          {editingExam && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-white/10"
            >
              Cancelar Edição
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#007AFF] text-white hover:bg-[#0066D6] shadow-sm transition-colors"
          >
            {editingExam ? 'Salvar Alterações' : 'Confirmar e Salvar Avaliação'}
          </button>
        </div>
      </form>

      {/* MODAL NOVA MATÉRIA OU REDAÇÃO */}
      {showNewSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AppleCard className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Cadastrar Matéria ou Redação</h3>
              <button onClick={() => setShowNewSubjectModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Nome da Matéria
              </label>
              <input
                type="text"
                value={newSubjName}
                onChange={(e) => setNewSubjName(e.target.value)}
                placeholder="Ex.: Redação ou Inglês"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Área do Conhecimento
              </label>
              <select
                value={newSubjArea}
                onChange={(e) => setNewSubjArea(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm"
              >
                {AREAS_ORDER.map((area) => (
                  <option key={area} value={area} className="bg-white dark:bg-[#1C1C1E]">
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewSubjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newSubjName.trim()) return;
                  onAddSubject({
                    id: `subj_${Date.now()}`,
                    name: newSubjName.trim(),
                    area: newSubjArea
                  });
                  setNewSubjName('');
                  setShowNewSubjectModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#007AFF] text-white"
              >
                Adicionar
              </button>
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ABA 3: BOLETIM ESCOLAR
// ============================================================================
// Função auxiliar de estilo para as faixas
function getBandPillStyle(score, bandLabels, isAverage = false) {
  if (score === null || score === undefined || score === '—') {
    return 'text-slate-500';
  }

  const band = getPerformanceBand(score, bandLabels);
let level = typeof band === 'number' ? band : (band?.level || band?.num || band?.band || band?.id || 1);
  if (level === 1 && Number(score) >= 40) {
    const n = Number(score);
    level = n >= 90 ? 6 : n >= 80 ? 5 : n >= 60 ? 4 : n >= 50 ? 3 : 2;
  }
  const baseStyle = `inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border text-xs tabular-nums transition-all ${
    isAverage ? 'font-bold' : 'font-medium'
  }`;

  const colors = {
    1: 'bg-[#881337]/25 text-rose-300 border-[#881337]/50', // Vinho
    2: 'bg-rose-500/20 text-rose-400 border-rose-500/35',     // Vermelho Coral
    3: 'bg-orange-500/20 text-orange-400 border-orange-500/35', // Laranja Âmbar
    4: 'bg-amber-400/20 text-amber-300 border-amber-400/35',   // Amarelo Dourado
    5: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/35',     // Azul Ciano
    6: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35', // Verde Esmeralda
  };

  return `${baseStyle} ${colors[level] || colors[1]}`;
}
function ReportCardTab({
  selectedYear,
  subjectYearMatrix,
  bandLabels,
  onUpdateBandLabels,
  onEditExam,
  onDeleteExam
}) {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [showBandConfig, setShowBandConfig] = useState(false);
  const [draftBands, setDraftBands] = useState(bandLabels);

  const filteredMatrix = useMemo(() => {
    if (selectedSubjectFilter === 'ALL') return subjectYearMatrix;
    return subjectYearMatrix.filter((row) => row.subject.id === selectedSubjectFilter);
  }, [subjectYearMatrix, selectedSubjectFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Boletim Escolar • {selectedYear}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Histórico trimestral, médias anuais e classificação oficial em 6 faixas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] px-3 py-2 text-xs sm:text-sm font-medium"
          >
            <option value="ALL">Visão Geral (Todas as Matérias)</option>
            {subjectYearMatrix.map((row) => (
              <option key={row.subject.id} value={row.subject.id}>
                Individual: {row.subject.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setDraftBands(bandLabels);
              setShowBandConfig(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 hover:border-[#007AFF] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#007AFF]" /> Faixas
          </button>
        </div>
      </div>

      {/* TABELA CONSOLIDADA DO BOLETIM */}
      <AppleCard noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Matéria</th>
                <th className="py-3.5 px-2.5 text-center">P1</th>
                <th className="py-3.5 px-2.5 text-center">P2</th>
                <th className="py-3.5 px-2.5 text-center bg-blue-500/5 text-[#007AFF]">T1</th>
                <th className="py-3.5 px-2.5 text-center">P3</th>
                <th className="py-3.5 px-2.5 text-center">P4</th>
                <th className="py-3.5 px-2.5 text-center bg-blue-500/5 text-[#007AFF]">T2</th>
                <th className="py-3.5 px-2.5 text-center">P5</th>
                <th className="py-3.5 px-2.5 text-center">P6</th>
                <th className="py-3.5 px-2.5 text-center bg-blue-500/5 text-[#007AFF]">T3</th>
                <th className="py-3.5 px-3 text-center">Média Anual</th>
                <th className="py-3.5 px-4 text-right">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-sm">
  {filteredMatrix.map((row) => {
    const band = getPerformanceBand(row.annualAvg, bandLabels);
    return (
      <tr
        key={row.subject.id}
        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
      >
        {/* MATÉRIA */}
        <td className="py-3.5 px-4">
          <div className="font-semibold text-slate-900 dark:text-white">
            {row.subject.name}
          </div>
          <div className="text-[11px] text-slate-400">{row.subject.area}</div>
        </td>

        {/* P1 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P1?.score, bandLabels, false)}>
            {row.P1 ? formatScore(row.P1.score) : '—'}
          </span>
        </td>

        {/* P2 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P2?.score, bandLabels, false)}>
            {row.P2 ? formatScore(row.P2.score) : '—'}
          </span>
        </td>

        {/* T1 (Média Trimestral - Negrito) */}
        <td className="py-3.5 px-2.5 text-center bg-white/[0.015]">
          <span className={getBandPillStyle(row.T1, bandLabels, true)}>
            {formatScore(row.T1)}
          </span>
        </td>

        {/* P3 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P3?.score, bandLabels, false)}>
            {row.P3 ? formatScore(row.P3.score) : '—'}
          </span>
        </td>

        {/* P4 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P4?.score, bandLabels, false)}>
            {row.P4 ? formatScore(row.P4.score) : '—'}
          </span>
        </td>

        {/* T2 (Média Trimestral - Negrito) */}
        <td className="py-3.5 px-2.5 text-center bg-white/[0.015]">
          <span className={getBandPillStyle(row.T2, bandLabels, true)}>
            {formatScore(row.T2)}
          </span>
        </td>

        {/* P5 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P5?.score, bandLabels, false)}>
            {row.P5 ? formatScore(row.P5.score) : '—'}
          </span>
        </td>

        {/* P6 */}
        <td className="py-3.5 px-2.5 text-center">
          <span className={getBandPillStyle(row.P6?.score, bandLabels, false)}>
            {row.P6 ? formatScore(row.P6.score) : '—'}
          </span>
        </td>

        {/* T3 (Média Trimestral - Negrito) */}
        <td className="py-3.5 px-2.5 text-center bg-white/[0.015]">
          <span className={getBandPillStyle(row.T3, bandLabels, true)}>
            {formatScore(row.T3)}
          </span>
        </td>

        {/* MÉDIA ANUAL (Negrito) */}
        <td className="py-3.5 px-3 text-center">
          <span className={getBandPillStyle(row.annualAvg, bandLabels, true)}>
            {formatScore(row.annualAvg)}
          </span>
          {row.isAnnualProvisional && (
            <span className="block text-[10px] text-slate-400 mt-1">Provisória</span>
          )}
        </td>

        {/* CLASSIFICAÇÃO */}
        <td className="py-3.5 px-4 text-right">
          {band ? (
            <span className={getBandPillStyle(row.annualAvg, bandLabels, true)}>
              {band.label}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Sem dados</span>
          )}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      </AppleCard>

      {/* DETALHAMENTO INDIVIDUAL DAS PROVAS PARA EDIÇÃO/EXCLUSÃO */}
      <AppleCard>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Registros Individuais de Avaliações ({selectedYear})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Clique em editar para atualizar notas ou conteúdos de qualquer prova já cadastrada.
        </p>

        <div className="space-y-2.5">
          {filteredMatrix.flatMap((row) =>
            ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
              .map((code) => row[code])
              .filter(Boolean)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {row.subject.name} • {exam.examCode}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({exam.trimester}º Trimestre)
                      </span>
                      {exam.isDemo && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">
                          Exemplo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Nota: <strong className="text-slate-700 dark:text-slate-200">{formatScore(exam.score)}</strong>
                      {exam.date ? ` • Data: ${exam.date}` : ''}
                      {exam.topics && exam.topics.length > 0
                        ? ` • ${exam.topics.length} conteúdo(s) mapeado(s)`
                        : ' • Sem detalhamento por conteúdo'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditExam(exam)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 hover:border-[#007AFF] text-slate-700 dark:text-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#007AFF]" /> Editar
                    </button>
                    <button
                      onClick={() => onDeleteExam(exam.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      title="Excluir prova"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </AppleCard>

      {/* MODAL PERSONALIZAÇÃO DAS 6 FAIXAS */}
      {showBandConfig && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AppleCard className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Rótulos das 6 Faixas de Desempenho</h3>
              <button onClick={() => setShowBandConfig(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Os limites numéricos (0-100) permanecem fixos conforme as regras da plataforma.
            </p>
            <div className="space-y-2.5">
              {[
                { num: 1, range: 'Abaixo de 40' },
                { num: 2, range: '40 a 49,9' },
                { num: 3, range: '50 a 59,9' },
                { num: 4, range: '60 a 79,9' },
                { num: 5, range: '80 a 89,9' },
                { num: 6, range: '90 a 100' }
              ].map((b) => (
                <div key={b.num} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 w-28">{b.range}:</span>
                  <input
                    type="text"
                    value={draftBands[b.num] || ''}
                    onChange={(e) =>
                      setDraftBands((prev) => ({ ...prev, [b.num]: e.target.value }))
                    }
                    className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBandConfig(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onUpdateBandLabels(draftBands);
                  setShowBandConfig(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#007AFF] text-white"
              >
                Salvar Nomes
              </button>
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ABA 4: ESTATÍSTICAS
// ============================================================================
function StatisticsTab({ selectedYear, availableYears, exams, subjects, bandLabels }) {
  const [filterYear, setFilterYear] = useState(String(selectedYear));
  const [filterArea, setFilterArea] = useState('ALL');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterTrimester, setFilterTrimester] = useState('ALL');
  const [filterSemester, setFilterSemester] = useState('ALL');
  const [filterExamCode, setFilterExamCode] = useState('ALL');

  const filteredExams = useMemo(() => {
    return exams.filter((ex) => {
      if (filterYear !== 'ALL' && Number(ex.year) !== Number(filterYear)) return false;
      const subj = subjects.find((s) => s.id === ex.subjectId);
      if (filterArea !== 'ALL' && subj?.area !== filterArea) return false;
      if (filterSubject !== 'ALL' && ex.subjectId !== filterSubject) return false;
      if (filterTrimester !== 'ALL' && Number(ex.trimester) !== Number(filterTrimester)) return false;
      if (filterSemester === '1' && ![1, 2].includes(Number(ex.trimester))) return false;
      if (filterSemester === '2' && Number(ex.trimester) !== 3) return false;
      if (filterExamCode !== 'ALL' && ex.examCode !== filterExamCode) return false;
      return true;
    });
  }, [
    exams,
    subjects,
    filterYear,
    filterArea,
    filterSubject,
    filterTrimester,
    filterSemester,
    filterExamCode
  ]);

  const stats = useMemo(() => {
    const count = filteredExams.length;
    const avg =
      count > 0
        ? filteredExams.reduce((acc, cur) => acc + Number(cur.score), 0) / count
        : null;

    const sorted = [...filteredExams].sort((a, b) => Number(b.score) - Number(a.score));
    const best = sorted[0] || null;
    const worst = sorted.length > 0 ? sorted[sorted.length - 1] : null;

    // Aproveitamento por conteúdo nos registros filtrados
    const topicAgg = {};
    filteredExams.forEach((ex) => {
      const subjName = subjects.find((s) => s.id === ex.subjectId)?.name || ex.subjectId;
      (ex.topics || []).forEach((t) => {
        const validQ = Math.max(0, Number(t.totalQuestions || 0) - Number(t.annulledQuestions || 0));
        if (validQ <= 0) return;
        const k = `${subjName} — ${t.topic}`;
        if (!topicAgg[k]) topicAgg[k] = { label: k, correct: 0, total: 0 };
        topicAgg[k].correct += Number(t.correctAnswers || 0);
        topicAgg[k].total += validQ;
      });
    });

    const topicsPerformance = Object.values(topicAgg)
      .map((item) => ({
        ...item,
        accuracy: (item.correct / item.total) * 100
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    const evolution = EXAMS_MAP.map((m) => {
      const subset = filteredExams.filter((e) => e.examCode === m.id);
      const mAvg =
        subset.length > 0
          ? subset.reduce((acc, cur) => acc + Number(cur.score), 0) / subset.length
          : null;
      return { label: m.label, value: mAvg };
    });

    return { count, avg, best, worst, topicsPerformance, evolution };
  }, [filteredExams, subjects]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Estatísticas e Diagnóstico Analítico
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Filtre por período, área ou matéria para investigar padrões de desempenho e aproveitamento por conteúdo.
        </p>
      </div>

      {/* BARRA DE FILTROS INTERATIVOS */}
      <AppleCard>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Ano</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">Todos os anos</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Área</label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">Todas as áreas</option>
              {AREAS_ORDER.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Matéria</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">Todas as matérias</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Trimestre</label>
            <select
              value={filterTrimester}
              onChange={(e) => setFilterTrimester(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">Todos</option>
              <option value="1">1º Trimestre</option>
              <option value="2">2º Trimestre</option>
              <option value="3">3º Trimestre</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Semestre</label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">Ambos</option>
              <option value="1">1º Semestre (T1+T2)</option>
              <option value="2">2º Semestre (T3)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Avaliação</label>
            <select
              value={filterExamCode}
              onChange={(e) => setFilterExamCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-2 text-xs font-medium"
            >
              <option value="ALL">P1 a P6</option>
              {EXAMS_MAP.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AppleCard>

      {/* INDICADORES FILTRADOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppleCard>
          <span className="text-xs text-slate-500">Média do Recorte</span>
          <div className="text-3xl font-bold mt-1.5 text-slate-900 dark:text-white tabular-nums">
            {formatScore(stats.avg)}
          </div>
          {stats.avg !== null && (
            <span className="text-xs text-[#007AFF] font-semibold">
              {getPerformanceBand(stats.avg, bandLabels)?.label}
            </span>
          )}
        </AppleCard>

        <AppleCard>
          <span className="text-xs text-slate-500">Provas no Recorte</span>
          <div className="text-3xl font-bold mt-1.5 text-slate-900 dark:text-white tabular-nums">
            {stats.count}
          </div>
          <span className="text-xs text-slate-400">Avaliações consideradas</span>
        </AppleCard>

        <AppleCard>
          <span className="text-xs text-slate-500">Melhor Resultado</span>
          <div className="text-2xl font-bold mt-1.5 text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.best ? formatScore(stats.best.score) : '—'}
          </div>
          <span className="text-xs text-slate-400 truncate block">
            {stats.best
              ? `${subjects.find((s) => s.id === stats.best.subjectId)?.name} (${stats.best.examCode})`
              : 'Sem dados'}
          </span>
        </AppleCard>

        <AppleCard>
          <span className="text-xs text-slate-500">Menor Resultado</span>
          <div className="text-2xl font-bold mt-1.5 text-amber-600 dark:text-amber-400 tabular-nums">
            {stats.worst ? formatScore(stats.worst.score) : '—'}
          </div>
          <span className="text-xs text-slate-400 truncate block">
            {stats.worst
              ? `${subjects.find((s) => s.id === stats.worst.subjectId)?.name} (${stats.worst.examCode})`
              : 'Sem dados'}
          </span>
        </AppleCard>
      </div>

      {/* EVOLUÇÃO E APROVEITAMENTO POR CONTEÚDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppleCard>
          <h3 className="text-base font-semibold mb-1">Evolução Temporal no Recorte</h3>
          <p className="text-xs text-slate-500 mb-4">
            Acompanhamento de notas ao longo das avaliações
          </p>
          <LineEvolutionChart dataPoints={stats.evolution} />
        </AppleCard>

        <AppleCard>
          <h3 className="text-base font-semibold mb-1">
            Aproveitamento por Conteúdo (Ordenado por Dificuldade)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Percentual de acertos válido (excluindo questões anuladas)
          </p>

          {stats.topicsPerformance.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">
              Ainda não há dados suficientes por conteúdo neste recorte.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {stats.topicsPerformance.map((tp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">
                      {tp.label}
                    </span>
                    <span className="font-bold tabular-nums">
                      {tp.correct}/{tp.total} ({tp.accuracy.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tp.accuracy < 60
                          ? 'bg-red-500'
                          : tp.accuracy < 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${tp.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AppleCard>
      </div>
    </div>
  );
}

// ============================================================================
// ABA 5: RELATÓRIOS (PRINCIPAL FUNCIONALIDADE INTEGRADA ESCOLA + ENEM)
// ============================================================================
function ReportsTab({
  selectedYear,
  exams,
  subjects,
  examSyllabi,
  reports,
  bandLabels,
  onSaveReport,
  showToast,
  db,
  user,
  appId
}) {
  const [scope, setScope] = useState('GENERAL'); // GENERAL | SUBJECT
  const [trimester, setTrimester] = useState('ALL'); // ALL | 1 | 2 | 3
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'mat');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    if (!activeReport && reports.length > 0) {
      setActiveReport(reports[0]);
    }
  }, [reports, activeReport]);

const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // 1. SE O ESCOPO FOR LIVROS, PROCESSA O RELATÓRIO DE LIVROS
      if (scope === 'BOOKS') {
        if (!db || !user || !appId) {
          showToast('Erro de conexão com o banco de dados.', 'error');
          setIsGenerating(false);
          return;
        }

        const prefRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences');
        const prefSnap = await getDoc(prefRef);
        
        if (!prefSnap.exists()) {
          showToast('Nenhum dado de livros encontrado para gerar o relatório.', 'error');
          setIsGenerating(false);
          return;
        }

        const prefData = prefSnap.data();
       const booksData = prefData['books_data_global'];

        if (!booksData) {
          showToast('Nenhum progresso de livros cadastrado no ano selecionado.', 'error');
          setIsGenerating(false);
          return;
        }

        const matrix = [];
        const strengths = [];
        const difficulties = [];
        const actionPlan = [];
        let orderCounter = 1;
        let totalChaptersAnalyzed = 0;
        let totalHitsSum = 0;
        let totalQuestionsSum = 0;

        Object.keys(booksData).forEach((bookKey) => {
          const bookObj = booksData[bookKey];
          const bookTitle = bookObj.title || bookKey;

          if (bookObj.topics && Array.isArray(bookObj.topics)) {
            bookObj.topics.forEach((t) => {
              const totalQ = Number(t.total || 0);
              const hits = Number(t.hits || 0);

              // IGNORA CAPÍTULOS QUE NÃO FORAM ESTUDADOS (sem questões feitas)
              if (totalQ === 0) return;

              totalChaptersAnalyzed++;
              totalHitsSum += hits;
              totalQuestionsSum += totalQ;

              const rate = (hits / totalQ) * 100;
              let perfText = `Bom aproveitamento (${rate.toFixed(0)}%)`;
              let priority = 'Manutenção';
              let priorityReason = 'Bom domínio do capítulo, focar em manutenção.';

              if (rate < 60) {
                perfText = `Atenção necessária (${rate.toFixed(0)}% de acertos)`;
                priority = 'Prioridade Máxima';
                priorityReason = 'Aproveitamento abaixo de 60% nas questões do livro.';
                difficulties.push(`Capítulo "${t.name}" (${bookTitle}) com ${rate.toFixed(0)}% de acertos.`);

                if (actionPlan.length < 4) {
                  actionPlan.push({
                    order: orderCounter++,
                    topic: t.name,
                    subject: bookTitle,
                    whatToStudy: 'Refazer os exercícios em que errou e revisar a teoria básica do capítulo.',
                    whyItMatters: 'Baixo índice de acertos nas questões práticas do livro.'
                  });
                }
              } else {
                strengths.push(`Capítulo "${t.name}" (${bookTitle}) consolidado com ${rate.toFixed(0)}% de acertos.`);
              }

              matrix.push({
                subject: bookTitle,
                topic: t.name,
                schoolPerformance: perfText,
                enemRelevance: `Relevância: ${t.relevance || 'Média'}`,
                enemJustification: 'Classificação de importância definida no cronograma de livros.',
                priorityLevel: priority,
                priorityReason: priorityReason
              });
            });
          }
        });

        const overallRate = totalQuestionsSum > 0 ? ((totalHitsSum / totalQuestionsSum) * 100).toFixed(1) : '0';

        if (strengths.length === 0) strengths.push('Bom engajamento nos estudos por livros.');
        if (difficulties.length === 0) difficulties.push('Nenhuma dificuldade crítica detectada nos capítulos avaliados.');

        if (actionPlan.length === 0) {
          actionPlan.push({
            order: 1,
            topic: 'Avanço Contínuo nos Livros',
            subject: 'Estudo Teórico e Prático',
            whatToStudy: 'Prosseguir com os próximos capítulos e manter revisões ativas.',
            whyItMatters: 'Consolidar a base de matemática para alta performance.'
          });
        }

        const localAiContent = {
          executiveSummary: `Relatório de Livros gerado para o ano de ${selectedYear}. Foram analisados ${totalChaptersAnalyzed} capítulos, atingindo uma taxa geral de acertos de ${overallRate}% nas questões praticadas.`,
          schoolDiagnosis: {
            overview: `Diagnóstico detalhado do progresso nos livros de matemática, cruzando quantidade de questões feitas e acertos por capítulo.`,
            strengths,
            difficulties
          },
          integratedPriorityMatrix: matrix,
          twoWeekActionPlan: actionPlan
        };

        const newReport = {
          id: `rep_${Date.now()}`,
          createdAt: new Date().toISOString(),
          year: Number(selectedYear),
          scope: 'BOOKS',
          targetTitle: 'Relatório Específico: Livros de Matemática',
          trimester: trimester === 'ALL' ? 'Acumulado' : `${trimester}º Trimestre`,
          subjectId: null,
          area: 'Livros',
          content: localAiContent
        };

        await onSaveReport(newReport);
        setActiveReport(newReport);
        showToast('Relatório de livros gerado com sucesso!', 'success');
        setIsGenerating(false);
        return;
      }

      // 2. FLUXO NORMAL (ESCOLA / PROVAS)
      const relevantExams = exams.filter((ex) => {
        if (Number(ex.year) !== Number(selectedYear)) return false;
        if (trimester !== 'ALL' && Number(ex.trimester) !== Number(trimester)) return false;
        if (scope === 'SUBJECT' && ex.subjectId !== subjectId) return false;
        if (scope === 'GENERAL' && areaFilter !== 'ALL') {
          const subj = subjects.find((s) => s.id === ex.subjectId);
          if (subj?.area !== areaFilter) return false;
        }
        return true;
      });

      if (relevantExams.length === 0) {
        showToast(
          'Não existem avaliações cadastradas para os filtros selecionados. Cadastre notas antes de gerar o relatório.',
          'error'
        );
        setIsGenerating(false);
        return;
      }

      let totalScore = 0;
      const topicStats = {};
      const strengths = [];
      const difficulties = [];

      relevantExams.forEach((ex) => {
        totalScore += Number(ex.score || 0);
        const subj = subjects.find((s) => s.id === ex.subjectId);
        const subjName = subj?.name || ex.subjectId;

        if (ex.topics && Array.isArray(ex.topics)) {
          ex.topics.forEach((t) => {
            const topicKey = `${subjName} - ${t.topic}`;
            if (!topicStats[topicKey]) {
              topicStats[topicKey] = { subject: subjName, topic: t.topic, totalQ: 0, correctQ: 0 };
            }
            const validQ = Math.max(0, Number(t.totalQuestions || 0) - Number(t.annulledQuestions || 0));
            topicStats[topicKey].totalQ += validQ;
            topicStats[topicKey].correctQ += Number(t.correctAnswers || 0);
          });
        }
      });

      const avgScore = (totalScore / relevantExams.length).toFixed(1);

      const matrix = [];
      const actionPlan = [];
      let orderCounter = 1;

      Object.values(topicStats).forEach((item) => {
        const rate = item.totalQ > 0 ? (item.correctQ / item.totalQ) * 100 : 50;
        let perfText = `Bom aproveitamento (${rate.toFixed(0)}%)`;
        let priority = 'Manutenção';

        if (rate < 60) {
          perfText = `Atenção necessária (${rate.toFixed(0)}%)`;
          priority = 'Prioridade Máxima';
          difficulties.push(`${item.topic} (${item.subject}) apresenta aproveitamento de ${rate.toFixed(0)}%.`);
          
          if (actionPlan.length < 4) {
            actionPlan.push({
              order: orderCounter++,
              topic: item.topic,
              subject: item.subject,
              whatToStudy: 'Revisar conceitos fundamentais e fazer bateria de exercícios focada nos erros.',
              whyItMatters: 'Conteúdo recorrente com margem imediata de ganho de pontos.'
            });
          }
        } else {
          strengths.push(`${item.topic} (${item.subject}) consolidado com ${rate.toFixed(0)}% de acertos.`);
        }

        matrix.push({
          subject: item.subject,
          topic: item.topic,
          schoolPerformance: perfText,
          enemRelevance: 'Alta (Estimativa INEP)',
          enemJustification: 'Conteúdo de alta incidência nas matrizes de competências do ENEM.',
          priorityLevel: priority,
          priorityReason: rate < 60 ? 'Déficit no histórico escolar cruzado com alta recorrência.' : 'Bom domínio, focar em manutenção.'
        });
      });

      if (strengths.length === 0) strengths.push('Bom engajamento geral nas avaliações cadastradas.');
      if (difficulties.length === 0) difficulties.push('Nenhuma dificuldade crítica detectada nos filtros atuais.');

      if (actionPlan.length === 0) {
        actionPlan.push({
          order: 1,
          topic: 'Revisão Geral e Simulados',
          subject: subjects[0]?.name || 'Geral',
          whatToStudy: 'Realizar simulados cronometrados e manutenções periódicas de conteúdo.',
          whyItMatters: 'Manter o ritmo e a consistência para o ENEM.'
        });
      }

      const targetTitle =
        scope === 'SUBJECT'
          ? `Individual: ${subjects.find((s) => s.id === subjectId)?.name}`
          : areaFilter !== 'ALL'
          ? `Consolidado Área: ${areaFilter}`
          : 'Geral Consolidado';

      const localAiContent = {
        executiveSummary: `Relatório gerado localmente com base em ${relevantExams.length} avaliação(ões) cadastrada(s). A média geral das notas no período é de ${avgScore} pontos, cruzada com diretrizes da matriz de referência.`,
        schoolDiagnosis: {
          overview: `O histórico demonstra consistência nas avaliações do período, com foco especial nos recortes de ${targetTitle}.`,
          strengths,
          difficulties
        },
        integratedPriorityMatrix: matrix,
        twoWeekActionPlan: actionPlan
      };

      const newReport = {
        id: `rep_${Date.now()}`,
        createdAt: new Date().toISOString(),
        year: Number(selectedYear),
        scope,
        targetTitle,
        trimester: trimester === 'ALL' ? 'Acumulado' : `${trimester}º Trimestre`,
        subjectId: scope === 'SUBJECT' ? subjectId : null,
        area: areaFilter,
        content: localAiContent
      };

      await onSaveReport(newReport);
      setActiveReport(newReport);
      showToast('Relatório integrado gerado com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao gerar relatório local. Tente novamente em instantes.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO E CONTROLES DE GERAÇÃO MANUAL */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Relatórios Inteligentes (Escola + ENEM)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Diagnóstico integrado do seu histórico escolar cruzado com a Matriz de Referência do ENEM.
          </p>
        </div>

        {activeReport && (
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 hover:border-[#007AFF] text-slate-800 dark:text-slate-100 shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#007AFF]" /> Exportar Relatório em PDF
          </button>
        )}
      </div>

      {/* PAINEL DE CONFIGURAÇÃO MANUAL */}
      <AppleCard className="print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Relatório</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium"
            >
              <option value="GENERAL">Geral Consolidado</option>
              <option value="SUBJECT">Individual por Matéria</option>
              <option value="BOOKS">Livros (O Algebrista / TQM)</option> {/* <-- ADICIONADO */}
            </select>
          </div>

          {scope === 'SUBJECT' ? (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Matéria</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Área (Opcional)</label>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white px-3 py-2 text-xs sm:text-sm font-medium"
              >
               <option value="ALL" className="dark:bg-slate-900 dark:text-white">Todas as Áreas</option>
                {AREAS_ORDER.map((a) => (
                  <option key={a} value={a} className="dark:bg-slate-900 dark:text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Período</label>
            <select
              value={trimester}
              onChange={(e) => setTrimester(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white px-3 py-2 text-xs sm:text-sm font-medium"
            >
              <option value="ALL" className="dark:bg-slate-900 dark:text-white">Acumulado {selectedYear}</option>
<option value="1" className="dark:bg-slate-900 dark:text-white">1º Trimestre</option>
<option value="2" className="dark:bg-slate-900 dark:text-white">2º Trimestre</option>
<option value="3" className="dark:bg-slate-900 dark:text-white">3º Trimestre</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#007AFF] text-white hover:bg-[#0066D6] disabled:opacity-50 shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Analisando histórico e matriz ENEM...' : 'Gerar relatório trimestral'}
            </button>
          </div>
        </div>
      </AppleCard>

      {/* EXIBIÇÃO DO RELATÓRIO INTEGRADO */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* HISTÓRICO DE RELATÓRIOS SALVOS */}
        <div className="lg:col-span-1 space-y-2.5 print:hidden">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Relatórios Salvos ({reports.length})
          </h3>
          {reports.length === 0 ? (
            <AppleCard className="text-xs text-slate-500">
              Nenhum relatório gerado ainda. Clique em "Gerar relatório trimestral".
            </AppleCard>
          ) : (
            reports.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setActiveReport(rep)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  activeReport?.id === rep.id
                    ? 'bg-[#007AFF] text-white border-[#007AFF]'
                    : 'bg-white dark:bg-[#1C1C1E] border-slate-200/80 dark:border-white/10 hover:border-[#007AFF]'
                }`}
              >
                <div className="text-xs font-bold truncate">{rep.targetTitle}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    activeReport?.id === rep.id ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {rep.trimester} • {rep.year}
                </div>
                <div
                  className={`text-[10px] mt-1 ${
                    activeReport?.id === rep.id ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {new Date(rep.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </button>
            ))
          )}
        </div>

        {/* DOCUMENTO DO RELATÓRIO ATIVO */}
        <div className="lg:col-span-3">
          {!activeReport ? (
            <AppleCard>
              <EmptyState
                icon={FileText}
                title="Pronto para gerar seu diagnóstico integrado"
                description="Selecione o escopo acima e clique em 'Gerar relatório trimestral' para combinar seu desempenho escolar com a relevância de cada conteúdo no ENEM."
              />
            </AppleCard>
          ) : (
            <AppleCard className="space-y-8 print:shadow-none print:border-none">
              {/* CABEÇALHO DO DOCUMENTO */}
              <div className="border-b border-slate-200 dark:border-white/10 pb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
                    PLATAFORMA BARATTA • RELATÓRIO INTEGRADO
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeReport.targetTitle} ({activeReport.trimester} • {activeReport.year})
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Emitido em {new Date(activeReport.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>

              {/* 1. RESUMO EXECUTIVO */}
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#007AFF]">
                  1. Resumo Executivo
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeReport.content.executiveSummary}
                </p>
              </section>

              {/* 2. DIAGNÓSTICO ESCOLAR */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#007AFF]">
                  2. Diagnóstico Escolar
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeReport.content.schoolDiagnosis.overview}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">
                      Pontos Consolidados
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {activeReport.content.schoolDiagnosis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">
                      Dificuldades Identificadas
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {activeReport.content.schoolDiagnosis.difficulties.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. MATRIZ INTEGRADA: DESEMPENHO ESCOLAR X RELEVÂNCIA ENEM */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#007AFF]">
                  3. Matriz Única de Prioridade (Desempenho × Relevância ENEM)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 uppercase">
                        <th className="py-3 px-3">Matéria / Conteúdo</th>
                        <th className="py-3 px-3">Desempenho Escolar</th>
                        <th className="py-3 px-3">Relevância ENEM</th>
                        <th className="py-3 px-3">Prioridade</th>
                        <th className="py-3 px-3">Justificativa Técnica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
                      {activeReport.content.integratedPriorityMatrix.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            <div>{row.topic}</div>
                            <div className="text-[11px] font-normal text-slate-400">
                              {row.subject}
                            </div>
                          </td>
                          <td className="py-3 px-3">{row.schoolPerformance}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold">{row.enemRelevance}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {row.enemJustification}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block font-bold px-2 py-0.5 rounded-md ${
                                row.priorityLevel.toLowerCase().includes('máx') ||
                                row.priorityLevel.toLowerCase().includes('alta')
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                  : row.priorityLevel.toLowerCase().includes('mod') ||
                                    row.priorityLevel.toLowerCase().includes('inter')
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              }`}
                            >
                              {row.priorityLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                            {row.priorityReason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 4. RECOMENDAÇÕES PARA AS PRÓXIMAS DUAS SEMANAS */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#007AFF]">
                  4. Prioridades de Estudo (Próximas 2 Semanas)
                </h3>
                <div className="space-y-2.5">
                  {activeReport.content.twoWeekActionPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#007AFF] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.order || idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {step.topic}{' '}
                          <span className="text-xs font-normal text-slate-400">
                            ({step.subject})
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
                          <strong>Foco recomendado:</strong> {step.whatToStudy}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <strong>Por que priorizar:</strong> {step.whyItMatters}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AppleCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ABA 6: BIBLIOTECA (PARTE A: ACERVO PDF + PARTE B: MAPEAMENTO DE PROVAS COM IA)
// ============================================================================
function LibraryTab({
  selectedYear,
  subjects,
  chapters,
  syllabi,
  onSaveChapter,
  onDeleteChapter,
  onSaveSyllabus,
  showToast
}) {
  const [subTab, setSubTab] = useState('ACERVO'); // ACERVO | PROVAS
  const [filterSubject, setFilterSubject] = useState('ALL');

  // Upload de capítulo
  const [upSubjectId, setUpSubjectId] = useState(subjects[0]?.id || 'mat');
  const [upChapterNum, setUpChapterNum] = useState('');
  const [upTitle, setUpTitle] = useState('');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  // Visualizador de PDF/Texto extraído
  const [viewingChapter, setViewingChapter] = useState(null);

  // Parte B: Conteúdos de cada prova
  const [sylSubjectId, setSylSubjectId] = useState(subjects[0]?.id || 'mat');
  const [sylExamCode, setSylExamCode] = useState('P1');
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);
  const [isAnalyzingChapters, setIsAnalyzingChapters] = useState(false);
  const [draftTopics, setDraftTopics] = useState([]); // [{ name, subtopics, complexity }]
  const [hasPendingApproval, setHasPendingApproval] = useState(false);

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!upChapterNum.trim()) {
      showToast('Informe o número do capítulo antes de enviar o PDF.', 'error');
      e.target.value = '';
      return;
    }

    // Detecção de duplicados por nome/tamanho ou mesmo capítulo na matéria
    const duplicateByFile = chapters.find(
      (c) => c.fileName === file.name && c.fileSize === file.size
    );
    const duplicateByChapter = chapters.find(
      (c) =>
        c.subjectId === upSubjectId &&
        String(c.chapterNumber).trim().toLowerCase() === upChapterNum.trim().toLowerCase()
    );

    if (duplicateByFile) {
      showToast(
        `Arquivo duplicado detectado: "${file.name}" já consta no acervo.`,
        'error'
      );
      e.target.value = '';
      return;
    }

    setIsProcessingPdf(true);
    try {
      const extraction = await extractTextFromPdfFile(file);
      const chapId = duplicateByChapter
        ? duplicateByChapter.id
        : `chap_${upSubjectId}_${Date.now()}`;

      await onSaveChapter({
        id: chapId,
        subjectId: upSubjectId,
        chapterNumber: upChapterNum.trim(),
        title: upTitle.trim() || file.name.replace(/\.pdf$/i, ''),
        fileName: file.name,
        fileSize: file.size,
        extractedText: extraction.text,
        numPages: extraction.numPages,
        isReadable: extraction.isReadable,
        uploadedAt: new Date().toISOString()
      });

      if (!extraction.isReadable) {
        showToast(
          'PDF salvo, porém pouco texto legível foi encontrado (possível arquivo escaneado). A IA não inventará conteúdo.',
          'error'
        );
      } else {
        showToast(
          duplicateByChapter
            ? `Capítulo ${upChapterNum} substituído com sucesso.`
            : `Capítulo ${upChapterNum} adicionado e indexado pela IA.`,
          'success'
        );
      }

      setUpChapterNum('');
      setUpTitle('');
    } catch (err) {
      showToast('Falha ao ler o arquivo PDF.', 'error');
    } finally {
      setIsProcessingPdf(false);
      e.target.value = '';
    }
  };

  const chaptersForSylSubject = useMemo(
    () =>
      chapters
        .filter((c) => c.subjectId === sylSubjectId)
        .sort((a, b) => Number(a.chapterNumber) - Number(b.chapterNumber)),
    [chapters, sylSubjectId]
  );

  const handleAnalyzeSelectedChapters = async () => {
    const selectedDocs = chaptersForSylSubject.filter((c) => selectedChapterIds.includes(c.id));
    if (selectedDocs.length === 0) {
      showToast('Selecione ao menos um capítulo do acervo para analisar.', 'error');
      return;
    }

    const unreadableDocs = selectedDocs.filter((d) => !d.isReadable || !d.extractedText);
    if (unreadableDocs.length === selectedDocs.length) {
      showToast(
        'Os arquivos selecionados não possuem texto extraível legível. Substitua por PDFs com texto ou cadastre os tópicos manualmente.',
        'error'
      );
      return;
    }

    setIsAnalyzingChapters(true);
    try {
      const combinedText = selectedDocs
        .map(
          (d) =>
            `=== CAPÍTULO ${d.chapterNumber}: ${d.title} ===\n${
              d.isReadable ? d.extractedText.slice(0, 12000) : '[ARQUIVO SEM TEXTO LEGÍVEL]'
            }`
        )
        .join('\n\n');

      const schema = {
        type: 'OBJECT',
        properties: {
          topics: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                subtopics: { type: 'ARRAY', items: { type: 'STRING' } },
                complexity: { type: 'STRING', enum: ['Fácil', 'Intermediário', 'Difícil'] }
              },
              required: ['name', 'subtopics', 'complexity']
            }
          }
        },
        required: ['topics']
      };

      const subjName = subjects.find((s) => s.id === sylSubjectId)?.name || sylSubjectId;
      const systemInstruction = `Você é o analista curricular da Plataforma Baratta.
Leia o conteúdo REAL dos capítulos fornecidos da matéria ${subjName} e extraia os assuntos e subtópicos abordados.
Classifique a complexidade objetiva de cada assunto em: "Fácil", "Intermediário" ou "Difícil" (complexidade teórica da matéria, nunca o domínio do aluno).
NUNCA invente assuntos que não estejam presentes no texto extraído dos capítulos.`;

      const res = await callGeminiAPI({
        prompt: `Identifique os assuntos, subtópicos e complexidade objetiva para a prova ${sylExamCode} de ${subjName} com base no texto real destes capítulos:\n\n${combinedText}`,
        systemInstruction,
        responseSchema: schema
      });

      if (res && Array.isArray(res.topics)) {
        setDraftTopics(res.topics);
        setHasPendingApproval(true);
        showToast('Conteúdos extraídos dos capítulos. Confira e aprove abaixo.', 'success');
      }
    } catch (err) {
      showToast('Erro ao analisar capítulos com a IA.', 'error');
    } finally {
      setIsAnalyzingChapters(false);
    }
  };

  const handleApproveAndSaveSyllabus = async () => {
    const cleanTopics = draftTopics.filter((t) => t.name && t.name.trim().length > 0);
    if (cleanTopics.length === 0) {
      showToast('Adicione pelo menos um conteúdo válido antes de aprovar.', 'error');
      return;
    }

    const sylId = `syl_${selectedYear}_${sylSubjectId}_${sylExamCode}`;
    await onSaveSyllabus({
      id: sylId,
      year: Number(selectedYear),
      subjectId: sylSubjectId,
      examCode: sylExamCode,
      chapterIds: selectedChapterIds,
      topics: cleanTopics,
      approvedAt: new Date().toISOString()
    });

    setHasPendingApproval(false);
    showToast(
      `Conteúdos de ${sylExamCode} aprovados e disponibilizados em Inserir Notas e Relatórios!`,
      'success'
    );
  };

  const displayedChapters = useMemo(() => {
    return chapters
      .filter((c) => filterSubject === 'ALL' || c.subjectId === filterSubject)
      .sort((a, b) => Number(a.chapterNumber) - Number(b.chapterNumber));
  }, [chapters, filterSubject]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Biblioteca e Mapeamento de Conteúdos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize os capítulos dos livros em PDF e extraia os conteúdos de cada avaliação com conferência obrigatória.
          </p>
        </div>

        <div className="flex bg-slate-200/70 dark:bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('ACERVO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'ACERVO'
                ? 'bg-white dark:bg-[#1C1C1E] text-[#007AFF] shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Parte A • Acervo de Capítulos
          </button>
          <button
            onClick={() => setSubTab('PROVAS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'PROVAS'
                ? 'bg-white dark:bg-[#1C1C1E] text-[#007AFF] shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Parte B • Conteúdos de Cada Prova
          </button>
        </div>
      </div>

      {/* PARTE A: ACERVO DE LIVROS E CAPÍTULOS */}
      {subTab === 'ACERVO' && (
        <div className="space-y-6">
          <AppleCard className="space-y-4">
            <h2 className="text-base font-semibold">Enviar Capítulo em PDF</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Matéria</label>
                <select
                  value={upSubjectId}
                  onChange={(e) => setUpSubjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs sm:text-sm font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Número do Capítulo *
                </label>
                <input
                  type="text"
                  value={upChapterNum}
                  onChange={(e) => setUpChapterNum(e.target.value)}
                  placeholder="Ex.: 11"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Título do Capítulo (Opcional)
                </label>
                <input
                  type="text"
                  value={upTitle}
                  onChange={(e) => setUpTitle(e.target.value)}
                  placeholder="Ex.: Progressões Aritméticas"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#007AFF] text-white hover:bg-[#0066D6] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{isProcessingPdf ? 'Lendo PDF...' : 'Selecionar PDF'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    disabled={isProcessingPdf}
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </AppleCard>

          {/* LISTAGEM DO ACERVO */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Capítulos Armazenados ({displayedChapters.length})
            </h3>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] px-3 py-1.5 text-xs font-medium"
            >
              <option value="ALL">Todas as Matérias</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {displayedChapters.length === 0 ? (
            <AppleCard>
              <EmptyState
                icon={BookOpen}
                title="Acervo vazio"
                description="Envie os PDFs dos capítulos dos seus livros acima. O texto será indexado para que a IA identifique automaticamente os conteúdos de cada prova."
              />
            </AppleCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedChapters.map((chap) => {
                const subj = subjects.find((s) => s.id === chap.subjectId);
                return (
                  <AppleCard key={chap.id} className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#007AFF]">
                          {subj?.name} • Cap. {chap.chapterNumber}
                        </span>
                        {chap.isReadable ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Texto Indexado ({chap.numPages} pág.)
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-600">
                            PDF Ilegível/Escaneado
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {chap.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{chap.fileName}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5">
                      <button
                        onClick={() => setViewingChapter(chap)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#007AFF] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Consultar
                      </button>
                      <button
                        onClick={() => onDeleteChapter(chap.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                        title="Remover capítulo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </AppleCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PARTE B: CONTEÚDOS DE CADA PROVA */}
      {subTab === 'PROVAS' && (
        <div className="space-y-6">
          <AppleCard className="space-y-5">
            <h2 className="text-base font-semibold">
              Associar Capítulos à Avaliação ({selectedYear})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Matéria</label>
                <select
                  value={sylSubjectId}
                  onChange={(e) => {
                    setSylSubjectId(e.target.value);
                    setSelectedChapterIds([]);
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Avaliação Alvo
                </label>
                <select
                  value={sylExamCode}
                  onChange={(e) => setSylExamCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-medium"
                >
                  {EXAMS_MAP.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.label} ({ex.trimester}º Trimestre)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Selecione os Capítulos do Acervo cobrados nesta prova:
              </label>
              {chaptersForSylSubject.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                  Nenhum capítulo cadastrado para esta matéria na Parte A. Envie os PDFs primeiro ou adicione tópicos manualmente abaixo.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {chaptersForSylSubject.map((c) => {
                    const checked = selectedChapterIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setSelectedChapterIds((prev) =>
                            checked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                          )
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          checked
                            ? 'bg-[#007AFF] text-white border-[#007AFF]'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        Cap. {c.chapterNumber} — {c.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDraftTopics((prev) => [
                    ...prev,
                    { name: '', subtopics: [], complexity: 'Intermediário' }
                  ]);
                  setHasPendingApproval(true);
                }}
                className="text-xs font-semibold text-[#007AFF] hover:underline"
              >
                + Adicionar conteúdo manualmente
              </button>

              <button
                type="button"
                disabled={isAnalyzingChapters || selectedChapterIds.length === 0}
                onClick={handleAnalyzeSelectedChapters}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#007AFF] text-white hover:bg-[#0066D6] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzingChapters
                  ? 'Lendo capítulos reais com IA...'
                  : 'Extrair Conteúdos dos Capítulos com IA'}
              </button>
            </div>
          </AppleCard>

          {/* ÁREA DE CONFERÊNCIA OBRIGATÓRIA */}
          {draftTopics.length > 0 && (
            <AppleCard className="space-y-4 border-[#007AFF]/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Conferência Obrigatória de Conteúdos ({sylExamCode})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edite, adicione ou remova assuntos. A complexidade indica a dificuldade objetiva da matéria.
                  </p>
                </div>
                {hasPendingApproval && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600">
                    Aguardando sua aprovação
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {draftTopics.map((tp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] text-slate-400 mb-1">Assunto</label>
                      <input
                        type="text"
                        value={tp.name}
                        onChange={(e) =>
                          setDraftTopics((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] px-2.5 py-1.5 text-xs font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Subtópicos (separados por vírgula)
                      </label>
                      <input
                        type="text"
                        value={(tp.subtopics || []).join(', ')}
                        onChange={(e) =>
                          setDraftTopics((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    subtopics: e.target.value
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                  }
                                : item
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-1">Complexidade</label>
                      <select
                        value={tp.complexity}
                        onChange={(e) =>
                          setDraftTopics((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, complexity: e.target.value } : item
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] px-2 py-1.5 text-xs font-medium"
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() =>
                          setDraftTopics((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="p-1.5 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDraftTopics([])}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Descartar
                </button>
                <button
                  onClick={handleApproveAndSaveSyllabus}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" /> Aprovar e Salvar Conteúdos
                </button>
              </div>
            </AppleCard>
          )}

          {/* CONTEÚDOS JÁ APROVADOS */}
          <AppleCard>
            <h3 className="text-base font-semibold mb-3">
              Conteúdos Aprovados e Disponíveis ({syllabi.length})
            </h3>
            {syllabi.length === 0 ? (
              <p className="text-xs text-slate-400">
                Nenhum mapeamento de prova aprovado ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {syllabi.map((syl) => {
                  const subj = subjects.find((s) => s.id === syl.subjectId);
                  return (
                    <div
                      key={syl.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {subj?.name} • {syl.examCode} ({syl.year})
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          Aprovado
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(syl.topics || []).map((t, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10"
                          >
                            {t.name}{' '}
                            <span className="text-[10px] text-slate-400">({t.complexity})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AppleCard>
        </div>
      )}

      {/* MODAL CONSULTAR CONTEÚDO EXTRAÍDO DO PDF */}
      {viewingChapter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AppleCard className="w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold">
                  Cap. {viewingChapter.chapterNumber} — {viewingChapter.title}
                </h3>
                <p className="text-xs text-slate-400">{viewingChapter.fileName}</p>
              </div>
              <button onClick={() => setViewingChapter(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
              {viewingChapter.extractedText ||
                'Este PDF não possui camada de texto legível para visualização.'}
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ABA 7: LIVROS 
// ============================================================================
function BooksTab({ selectedYear, showToast, savePreferences, awardXp, user, db, appId }) {
  const [activeBook, setActiveBook] = React.useState('algebrista');
  const [booksState, setBooksState] = React.useState(BOOKS_DATA);
  const [completedTopics, setCompletedTopics] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  // Carrega os dados salvos do Firestore ao abrir a aba ou trocar o ano
  React.useEffect(() => {
    const loadUserData = async () => {
      if (!user || !db || !appId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data['books_completed_global']) {
            setCompletedTopics(data['books_completed_global']);
          } else {
            setCompletedTopics({});
          }

          if (data['books_data_global']) {
            setBooksState({
              ...BOOKS_DATA,
              ...data['books_data_global']
            });
          } else {
            setBooksState(BOOKS_DATA);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados dos livros:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [selectedYear, user, db, appId]);

  const getRelevanceStyle = (relevance) => {
    switch (relevance) {
      case 'Muito Alta':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-bold';
      case 'Média':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Alta':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Baixa':
        return 'bg-zinc-200/10 text-white border-zinc-200/30 font-semibold';
      case 'Muito Baixa':
        return 'bg-zinc-800/40 text-zinc-500 border-zinc-700/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

 const handleTopicInput = async (topicId, field, value) => {
    const updatedBookState = { ...booksState };

    // Atualiza o valor do campo no tópico correspondente
    Object.keys(updatedBookState).forEach((bookKey) => {
      const book = updatedBookState[bookKey];
      if (book.topics && Array.isArray(book.topics)) {
        book.topics = book.topics.map((t) => {
          if (t.id === topicId) {
            return { ...t, [field]: value };
          }
          return t;
        });
      }
    });

    // 3. Atualiza o estado local do React
    setBooksState(updatedBookState);

    // 4. Salva de forma GLOBAL no Firestore (sempre acessível independente do ano)
    if (typeof savePreferences === 'function' && user && db && appId) {
      try {
        await savePreferences({
          'books_data_global': updatedBookState
        });
      } catch (err) {
        console.error('Erro ao salvar dados globais dos livros:', err);
      }
    }
  };

 const handleToggleTopic = async (topicId) => {
    const key = `${selectedYear}_${activeBook}_${topicId}`;
    const isCompleted = !!completedTopics[key];
    
    const updatedCompleted = { ...completedTopics };

    if (isCompleted) {
      delete updatedCompleted[key];
      if (showToast) showToast('Tópico desmarcado.', 'info');
    } else {
      updatedCompleted[key] = true;
      
      // Concede exatamente 5 de XP
      if (typeof awardXp === 'function') {
        awardXp('book_topic_complete', 'Estudo de Livro (Matemática)', topicId, 5);
      }

      if (showToast) showToast('Tópico concluído! +5 XP na conta 🚀', 'success');
    }

    setCompletedTopics(updatedCompleted);

    if (typeof savePreferences === 'function') {
    await savePreferences({
    'books_completed_global': updatedCompleted
    });
  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-lg">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Central de Estudos de Livros</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Ano Letivo Ativo: <span className="text-indigo-400 font-bold">{selectedYear}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'algebrista', label: 'O Algebrista' },
              { key: 'tqm_fundamental', label: 'TQM Fundamental' },
              { key: 'tqm_medio', label: 'TQM Médio' }
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => setActiveBook(b.key)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  activeBook === b.key ? 'bg-indigo-600 text-white shadow' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/60'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-lg">
        <div className="border-b border-zinc-800 pb-3 mb-4 flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-200">{booksState[activeBook].title}</h3>
            <p className="text-xs text-zinc-400">Marque o checklist dos tópicos concluídos e registre suas questões resolvidas.</p>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] text-zinc-400 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Muito Alta</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Média</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Alta</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white"></span> Baixa</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2">
          {booksState[activeBook].topics.map((t) => {
            const key = `${selectedYear}_${activeBook}_${t.id}`;
            const isCompleted = !!completedTopics[key];

            return (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950'
                } space-y-3`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className={`px-2.5 py-0.5 text-[10px] border rounded-md mt-1.5 inline-block ${getRelevanceStyle(t.relevance)}`}>
                      Relevância: {t.relevance}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleTopic(t.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      isCompleted ? 'bg-emerald-600 text-white shadow' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {isCompleted ? 'Concluído (+5 XP)' : 'Marcar Concluído'}
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Questões Feitas:</span>
                    <input
                      type="number"
                      value={t.total || ''}
                      onChange={(e) => handleTopicInput(t.id, 'total', e.target.value)}
                      placeholder="0"
                      className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Acertos:</span>
                    <input
                      type="number"
                      value={t.hits || ''}
                      onChange={(e) => handleTopicInput(t.id, 'hits', e.target.value)}
                      placeholder="0"
                      className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// ============================================================================
// ABA 8: RANKING (HISTÓRICO ACUMULADO DE PROVAS CADASTRADAS)
// ============================================================================
function RankingTab({ exams, subjects, bandLabels, selectedYear }) {
  const [rankingType, setRankingType] = useState('subjects');

  // FILTRA OS EXAMES APENAS DO ANO SELECIONADO:
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const examYear = e.year ? Number(e.year) : 2026;
      return examYear === Number(selectedYear);
    });
  }, [exams, selectedYear]);

  const subjectRanking = useMemo(() => {
    const list = subjects.map((subj) => {
      const subjExams = filteredExams.filter((e) => e.subjectId === subj.id);
      const count = subjExams.length;
      const avg =
        count > 0
          ? subjExams.reduce((acc, cur) => acc + Number(cur.score), 0) / count
          : null;
      return {
        subject: subj,
        count,
        avg
      };
    });

    const maxCount = list.reduce((max, item) => Math.max(max, item.count), 0);

    const withData = list
      .filter((i) => i.avg !== null)
      .sort((a, b) => b.avg - a.avg)
      .map((item) => ({
        ...item,
        isProvisional: item.count < maxCount
      }));

    const withoutData = list
      .filter((i) => i.avg === null)
      .map((item) => ({ ...item, isProvisional: false }));

    return [...withData, ...withoutData];
  }, [filteredExams, subjects]);

  const areaRanking = useMemo(() => {
    const areas = AREAS_ORDER.map((areaName) => {
      const areaSubjs = subjectRanking.filter(
        (s) => s.subject.area === areaName && s.avg !== null
      );
      const avg =
        areaSubjs.length > 0
          ? areaSubjs.reduce((acc, cur) => acc + cur.avg, 0) / areaSubjs.length
          : null;
      return {
        area: areaName,
        avg,
        subjectsCount: areaSubjs.length
      };
    });

    const withData = areas.filter((a) => a.avg !== null).sort((a, b) => b.avg - a.avg);
    const withoutData = areas.filter((a) => a.avg === null);
    return [...withData, ...withoutData];
  }, [subjectRanking]);

  // Filtra apenas os que possuem dados válidos
  const validSubjectsWithData = subjectRanking.filter(i => i.avg !== null);
  const validAreasWithData = areaRanking.filter(a => a.avg !== null);

  // Top 3 e o restante para a lista completa (removendo os 3 primeiros da lista abaixo)
  const top3Subjects = validSubjectsWithData.slice(0, 3);
  const remainingSubjects = subjectRanking.filter(i => i.avg === null || validSubjectsWithData.indexOf(i) >= 3);

  const top3Areas = validAreasWithData.slice(0, 3);
  const remainingAreas = areaRanking.filter(a => a.avg === null || validAreasWithData.indexOf(a) >= 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ranking Acumulado
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculado sobre todas as avaliações já registradas em cada matéria (soma das notas / quantidade de provas).
          </p>
        </div>

        {/* BOTÃO DE ESCOLHA (SELETOR ESTILO APPLE COM AZUL NO ATIVO) */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/60 dark:bg-white/10 border border-slate-300/40 dark:border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setRankingType('subjects')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              rankingType === 'subjects'
                ? 'bg-[#007AFF] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ranking de Matérias
          </button>
          <button
            onClick={() => setRankingType('areas')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              rankingType === 'areas'
                ? 'bg-[#007AFF] text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ranking de Áreas
          </button>
        </div>
      </div>

      {/* CONTEÚDO CONDICIONAL CONFORME A ESCOLHA */}
      {rankingType === 'subjects' ? (
        <div className="space-y-8">
          {/* PÓDIO DE MATÉRIAS (TOP 3) */}
          {top3Subjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
              {/* 2º Lugar (Prata) */}
              {top3Subjects[1] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 dark:from-white/[0.07] dark:to-white/[0.02] border-2 border-slate-300 dark:border-white/20 shadow-md flex flex-col justify-between order-2 md:order-1 h-44">
                  <div className="absolute -top-4 left-6 px-3 py-1 rounded-xl bg-slate-300 dark:bg-white/20 text-slate-800 dark:text-white font-black text-xs flex items-center justify-center gap-1.5 shadow">
                    <span>🥈</span> <span>2º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Prata</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{top3Subjects[1].subject.name}</h3>
                    <p className="text-xs text-slate-500">{top3Subjects[1].subject.area}</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-300/50 dark:border-white/10">
                    <span className="text-xs text-slate-400">{top3Subjects[1].count} provas</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {formatScore(top3Subjects[1].avg)}
                    </span>
                  </div>
                </div>
              )}

              {/* 1º Lugar (Ouro / Campeão) */}
              {top3Subjects[0] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-slate-100/80 dark:from-[#007AFF]/25 dark:to-white/[0.03] border-2 border-[#007AFF] shadow-xl flex flex-col justify-between order-1 md:order-2 h-52 md:-translate-y-4">
                  <div className="absolute -top-5 left-6 px-3.5 py-1.5 rounded-xl bg-[#007AFF] text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-lg ring-4 ring-white dark:ring-[#121212]">
                    <span>👑</span> <span>1º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#007AFF]">Campeão Absoluto</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{top3Subjects[0].subject.name}</h3>
                    <p className="text-xs text-slate-500">{top3Subjects[0].subject.area}</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#007AFF]/30">
                    <span className="text-xs text-slate-500">{top3Subjects[0].count} provas</span>
                    <span className="text-3xl font-black text-[#007AFF] tabular-nums">
                      {formatScore(top3Subjects[0].avg)}
                    </span>
                  </div>
                </div>
              )}

              {/* 3º Lugar (Bronze) */}
              {top3Subjects[2] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-white/[0.02] border-2 border-amber-500/40 shadow-md flex flex-col justify-between order-3 h-40">
                  <div className="absolute -top-4 left-6 px-3 py-1 rounded-xl bg-amber-500/30 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow">
                    <span>🥉</span> <span>3º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Bronze</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{top3Subjects[2].subject.name}</h3>
                    <p className="text-xs text-slate-500">{top3Subjects[2].subject.area}</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-amber-500/20">
                    <span className="text-xs text-slate-400">{top3Subjects[2].count} provas</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {formatScore(top3Subjects[2].avg)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RANKING DE MATÉRIAS (LISTA COMPLETA - DO 4º EM DIANTE) */}
          <AppleCard noPadding className="overflow-hidden">
            <div className="p-5 border-b border-slate-200/70 dark:border-white/10">
              <h2 className="text-base font-semibold">Demais Matérias</h2>
              <p className="text-xs text-slate-500">
                Classificação geral a partir da 4ª posição
              </p>
            </div>
            <div className="divide-y divide-slate-200/60 dark:divide-white/5">
              {remainingSubjects.map((item) => {
                const band = getPerformanceBand(item.avg, bandLabels);
                const actualIndex = subjectRanking.indexOf(item) + 1;
                return (
                  <div
                    key={item.subject.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {item.avg !== null ? actualIndex : '—'}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.subject.name}</span>
                          {item.isProvisional && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Provisória
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.subject.area} •{' '}
                          {item.count === 0
                            ? 'Nenhuma prova registrada'
                            : `${item.count} ${item.count === 1 ? 'prova registrada' : 'provas registradas'}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.avg !== null ? (
                        <>
                          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                            {formatScore(item.avg)}
                          </div>
                          {band && (
                            <span className="text-[11px] font-medium text-slate-400">
                              {band.label}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Sem dados</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </AppleCard>
        </div>
      ) : (
        <div className="space-y-8">
          {/* PÓDIO DE ÁREAS (TOP 3) */}
          {top3Areas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
              {/* 2º Lugar (Prata) */}
              {top3Areas[1] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 dark:from-white/[0.07] dark:to-white/[0.02] border-2 border-slate-300 dark:border-white/20 shadow-md flex flex-col justify-between order-2 md:order-1 h-44">
                  <div className="absolute -top-4 left-6 px-3 py-1 rounded-xl bg-slate-300 dark:bg-white/20 text-slate-800 dark:text-white font-black text-xs flex items-center justify-center gap-1.5 shadow">
                    <span>🥈</span> <span>2º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Prata</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{top3Areas[1].area}</h3>
                    <p className="text-xs text-slate-500">{top3Areas[1].subjectsCount} matérias avaliadas</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-300/50 dark:border-white/10">
                    <span className="text-xs text-slate-400">Média geral</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {formatScore(top3Areas[1].avg)}
                    </span>
                  </div>
                </div>
              )}

              {/* 1º Lugar (Ouro / Campeã) */}
              {top3Areas[0] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-slate-100/80 dark:from-[#007AFF]/25 dark:to-white/[0.03] border-2 border-[#007AFF] shadow-xl flex flex-col justify-between order-1 md:order-2 h-52 md:-translate-y-4">
                  <div className="absolute -top-5 left-6 px-3.5 py-1.5 rounded-xl bg-[#007AFF] text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-lg ring-4 ring-white dark:ring-[#121212]">
                    <span>👑</span> <span>1º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#007AFF]">Área Campeã</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{top3Areas[0].area}</h3>
                    <p className="text-xs text-slate-500">{top3Areas[0].subjectsCount} matérias avaliadas</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[#007AFF]/30">
                    <span className="text-xs text-slate-500">Média geral</span>
                    <span className="text-3xl font-black text-[#007AFF] tabular-nums">
                      {formatScore(top3Areas[0].avg)}
                    </span>
                  </div>
                </div>
              )}

              {/* 3º Lugar (Bronze) */}
              {top3Areas[2] && (
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-white/[0.02] border-2 border-amber-500/40 shadow-md flex flex-col justify-between order-3 h-40">
                  <div className="absolute -top-4 left-6 px-3 py-1 rounded-xl bg-amber-500/30 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow">
                    <span>🥉</span> <span>3º</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Bronze</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{top3Areas[2].area}</h3>
                    <p className="text-xs text-slate-500">{top3Areas[2].subjectsCount} matérias avaliadas</p>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-amber-500/20">
                    <span className="text-xs text-slate-400">Média geral</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {formatScore(top3Areas[2].avg)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RANKING DE ÁREAS (LISTA COMPLETA - DO 4º EM DIANTE) */}
          <AppleCard noPadding className="overflow-hidden">
            <div className="p-5 border-b border-slate-200/70 dark:border-white/10">
              <h2 className="text-base font-semibold">Demais Áreas</h2>
              <p className="text-xs text-slate-500">
                Classificação geral a partir da 4ª posição
              </p>
            </div>
            <div className="divide-y divide-slate-200/60 dark:divide-white/5 p-5 space-y-3">
              {remainingAreas.map((a) => {
                const actualIndex = areaRanking.indexOf(a) + 1;
                return (
                  <div
                    key={a.area}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#007AFF] flex items-center gap-2">
                        <span>{a.avg !== null ? `#${actualIndex}` : '—'}</span>
                        <span className="text-slate-900 dark:text-white">• {a.area}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {a.subjectsCount > 0
                          ? `${a.subjectsCount} ${
                              a.subjectsCount === 1 ? 'matéria avaliada' : 'matérias avaliadas'
                            }`
                          : 'Sem matérias avaliadas'}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatScore(a.avg)}
                    </div>
                  </div>
                );
              })}
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// ABA 9: PROGRESSO — GAMIFICAÇÃO POR CONSISTÊNCIA
// ============================================================================
const XP_LEVELS_TRAIL = [
  { level: 1, name: 'Bronze', minXp: 0, badge: '🥉' },
  { level: 2, name: 'Prata', minXp: 1000, badge: '🥈' },
  { level: 3, name: 'Ouro', minXp: 2000, badge: '🥇' },
  { level: 4, name: 'Platina', minXp: 2500, badge: '💠' },
  { level: 5, name: 'Diamante', minXp: 3000, badge: '💎' },
  { level: 6, name: 'Elite', minXp: 3500, badge: '🔥' },
  { level: 7, name: 'Lenda', minXp: 3700, badge: '⚡' },
  { level: 8, name: 'Surreal', minXp: 3800, badge: '👑' }
];

function AchievementsTab({
  gamificationStats,
  xpConfig,
  onUpdateXpConfig,
  toast
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [draftConfig, setDraftConfig] = useState(xpConfig);

  const currentXp = gamificationStats?.totalXp || 0;

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA ABA PROGRESSO */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Progresso
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Acompanhe sua evolução de XP e veja o quanto falta para alcançar os próximos níveis.
          </p>
        </div>

        <button
          onClick={() => {
            setDraftConfig(xpConfig);
            setShowConfig(!showConfig);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 hover:border-[#007AFF]/50 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-[#007AFF]" /> Configurar Valores de XP
        </button>
      </div>

      {/* CARTÃO PRINCIPAL DO NÍVEL ATUAL */}
      <AppleCard className="bg-gradient-to-r from-[#007AFF]/15 via-[#007AFF]/5 to-transparent border-[#007AFF]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#007AFF]">
              Patente Atual • {gamificationStats.currentLevel.name}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {currentXp} XP
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {gamificationStats.nextLevel
                ? `Faltam ${
                    gamificationStats.nextLevel.minXp - currentXp
                  } XP para alcançar o nível ${gamificationStats.nextLevel.name}.`
                : 'Você atingiu o topo da trilha: Nível Surreal!'}
            </p>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>Nível {gamificationStats.currentLevel.level}</span>
              <span>{gamificationStats.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                style={{ width: `${gamificationStats.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </AppleCard>

      {/* CONFIGURAÇÃO DE XP (OPCIONAL) */}
      {showConfig && (
        <AppleCard className="space-y-4">
          <h3 className="text-sm font-bold">Valores de XP por Ação</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { key: 'registerExam', label: 'Cadastrar prova' },
              { key: 'completeDiagnosis', label: 'Diagnóstico por conteúdo' },
              { key: 'uploadChapter', label: 'Organizar capítulo PDF' },
              { key: 'approveSyllabus', label: 'Aprovar tópicos IA' },
              { key: 'generateReport', label: 'Gerar relatório' }
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-[11px] text-slate-500 mb-1">{item.label}</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={draftConfig[item.key]}
                  onChange={(e) =>
                    setDraftConfig((prev) => ({
                      ...prev,
                      [item.key]: Number(e.target.value)
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-sm font-bold"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-1.5 text-xs font-semibold text-slate-500"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onUpdateXpConfig(draftConfig);
                setShowConfig(false);
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#007AFF] text-white"
            >
              Salvar XP
            </button>
          </div>
        </AppleCard>
      )}

      {/* TRILHA DE EVOLUÇÃO DE XP */}
      <AppleCard className="p-6">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Trilha de Evolução
          </h3>
          <p className="text-xs text-slate-500">
            Seu caminho do Bronze ao Surreal
          </p>
        </div>

        <div className="relative pl-4 sm:pl-6 space-y-6 before:content-[''] before:absolute before:left-[27px] sm:before:left-[35px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
          {XP_LEVELS_TRAIL.map((step, index) => {
            const nextStep = XP_LEVELS_TRAIL[index + 1];
            const isUnlocked = currentXp >= step.minXp;
            const isCurrent =
              isUnlocked && (!nextStep || currentXp < nextStep.minXp);
            const xpMissing = step.minXp - currentXp;

            // Calcula progresso parcial entre o nível atual e o próximo
            let segmentProgress = 0;
            if (isCurrent && nextStep) {
              const range = nextStep.minXp - step.minXp;
              const earnedInLevel = currentXp - step.minXp;
              segmentProgress = Math.min(100, Math.max(0, Math.round((earnedInLevel / range) * 100)));
            } else if (isUnlocked && !nextStep) {
              segmentProgress = 100;
            }

            return (
              <div key={step.level} className="relative flex items-start gap-4">
                {/* NÓ / MARCADOR DA TRILHA */}
                <div
                  className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-[#007AFF] text-white ring-4 ring-[#007AFF]/25 scale-110 shadow-md'
                      : isUnlocked
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                  }`}
                >
                  {isUnlocked ? step.badge : step.level}
                </div>

                {/* CARD DO DEGRAU DA TRILHA */}
                <div
                  className={`flex-1 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#007AFF]/10 border-[#007AFF] shadow-sm'
                      : isUnlocked
                      ? 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10'
                      : 'bg-slate-50/40 dark:bg-white/[0.01] border-slate-200/40 dark:border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Nível {step.level} • {step.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#007AFF] text-white">
                          Você está aqui
                        </span>
                      )}
                      {isUnlocked && !isCurrent && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Concluído
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-extrabold tabular-nums text-slate-600 dark:text-slate-300">
                      {step.minXp} XP
                    </span>
                  </div>

                  {/* DETALHE DE PROGRESSO OU QUANTO FALTA */}
                  <div className="mt-2">
                    {isCurrent ? (
                      nextStep ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span>Progresso para {nextStep.name}</span>
                            <span className="font-semibold text-[#007AFF]">
                              Faltam {nextStep.minXp - currentXp} XP
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                              style={{ width: `${segmentProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#007AFF] font-medium">
                          Patente máxima alcançada! Continue mantendo o ritmo.
                        </p>
                      )
                    ) : isUnlocked ? (
                      <p className="text-[11px] text-slate-400">
                        Etapa superada no seu histórico de estudos.
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-medium">
                        Bloqueado • Faltam <strong className="text-slate-600 dark:text-slate-300">{xpMissing} XP</strong> para desbloquear
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AppleCard>

      {/* RENDERIZAÇÃO DO TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C1C1E]/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 dark:border-slate-200 animate-bounce transition-all">
          <div className="w-8 h-8 rounded-xl bg-[#007AFF] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            XP
          </div>
          <div>
            <p className="text-xs font-semibold opacity-80">Reconhecimento</p>
            <p className="text-sm font-bold">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
