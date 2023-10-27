interface GenderData {
  values: {
    gender: string;
  };
}

const showGenderedVersion = (terms: Record<string, string>, gender: string = 'other') => terms[gender] || terms.other;

export default {
  _currencySymbol: 'R$',
  campaignBy: 'Por',
  callToFaq: 'Dúvidas sobre esse projeto? <a href="#faq">Confira as respostas às perguntas Frequentes</a>',
  chooseThisReward: 'Selecionar essa recompensa',
  credits: {
    fundraiserLabel: 'Responsável por esta página',
    poweredBy: 'Campanha proporcionada por',
  },
  donateWithoutReward: 'Doe sem recompensa',
  electionCampaign: {
    ballotNumber: 'Número',
    politicalParty: 'Partido',
    runningForLocation: 'Concorre em',
    runningForOffice: ({ values: { gender } }: GenderData) => showGenderedVersion(
      {
        female: 'Candidata a',
        male: 'Candidato a',
        other: 'Concorre para',
      },
      gender,
    ),
  },
  flexibleFunding: 'Campanha flexível',
  footerMenuLabel: 'Menu da campanha, termos de uso e política de privacidade',
  legalEntityIdentification: 'CNPJ',
  loadVideo: 'Carregar vídeo',
  minimumRewardOrMore: 'ou mais',
  nSupporters: {
    plural: 'Nenhum apoio | 1 apoio | {n} apoios',
  },
  naturalPersonIdentification: 'CPF',
  nav: {
    description: 'Campanha',
    donations: 'Transparência',
    faq: 'FAQ',
    goals: 'Meta | Metas',
    rewards: 'Recompensa',
    testimonies: 'Testemunho | Testemunhos',
  },
  navigationLabel: 'Seções dessa campanha',
  of: 'De',
  governmentOffices: {
    municipal_council: ({ values: { gender } }: GenderData) => showGenderedVersion(
      {
        female: 'Vereadora',
        male: 'Vereador',
        other: 'Câmara municipal',
      },
      gender,
    ),
    city_hall: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Prefeita',
      male: 'Prefeito',
      other: 'Prefeitura',
    }, gender),
    state_legislature: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Deputada estadual',
      male: 'Deputado estadual',
      other: 'Câmara estadual',
    }, gender),
    state_government: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Governadora',
      male: 'Governador',
      other: 'Governo estadual',
    }, gender),
    federal_chamber: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Deputada federal',
      male: 'Deputado federal',
      other: 'Câmara federal',
    }, gender),
    senate: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Senadora',
      male: 'Senador',
      other: 'Senado',
    }, gender),
    presidency: ({ values: { gender } }: GenderData) => showGenderedVersion({
      female: 'Presidenta',
      male: 'Presidente',
      other: 'Presidência',
    }, gender),
  },
  paymentMethods: {
    credit_card: 'Cartão de crédito',
    instant_payment_platform: 'PIX',
    pro_forma_invoice: 'Boleto',
  },
  pledges: {
    custom: 'outro valor',
  },
  privacyPolicy: 'Política de privacidade',
  progressOfCampaign: 'Progresso da campanha',
  rewards: 'Rewards',
  rewardsIntro: 'Este projeto oferece recompensas em troca do seu apoio. Selecione uma recompensa abaixo.',
  totalAmount: 'Arrecadados',
  totalDonations: 'Doações recebidas',
  useTerms: 'Termos de uso',
};
