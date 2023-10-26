interface GenderData {
  values: {
    gender: string;
  };
}

const showGenderVersion = (terms: Record<string, string>, gender: string = 'other') => terms[gender] || terms.other;

export default {
  _currencySymbol: 'R$',
  campaignBy: 'Por',
  chooseThisReward: 'Selecionar essa recompensa',
  credits: {
    fundraiserLabel: 'Responsável por esta página',
    poweredBy: 'Campanha proporcionada por',
  },
  donateWithoutReward: 'Doe sem recompensa',
  electionCampaign: {
    ballotNumber: 'Número',
    runningForLocation: 'Concorre em',
    runningForOffice: ({ values: { gender } }: GenderData) => showGenderVersion(
      {
        female: 'Candidata a',
        male: 'Candidato a',
        other: 'Concorre para',
      },
      gender,
    ),
  },
  flexibleFunding: 'Campanha flexível',
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
  of: 'De',
  governmentOffices: {
    municipal_council: ({ values: { gender } }: GenderData) => showGenderVersion(
      {
        female: 'Vereadora',
        male: 'Vereador',
        other: 'Câmara municipal',
      },
      gender,
    ),
    city_hall: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Prefeita',
      male: 'Prefeito',
      other: 'Prefeitura',
    }, gender),
    state_legislature: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Deputada estadual',
      male: 'Deputado estadual',
      other: 'Câmara estadual',
    }, gender),
    state_government: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Governadora',
      male: 'Governador',
      other: 'Governo estadual',
    }, gender),
    federal_chamber: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Deputada federal',
      male: 'Deputado federal',
      other: 'Câmara federal',
    }, gender),
    senate: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Senadora',
      male: 'Senador',
      other: 'Senado',
    }, gender),
    presidency: ({ values: { gender } }: GenderData) => showGenderVersion({
      female: 'Presidência',
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
  totalAmount: 'Arrecadados',
  totalDonations: 'Doações recebidas',
  useTerms: 'Termos de uso',
};
