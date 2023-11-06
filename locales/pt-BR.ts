interface GenderData {
  values: {
    gender: string;
  };
}

const showGenderedVersion = (terms: Record<string, string>, gender: string = 'other') => terms[gender] || terms.other;

export default {
  _currencySymbol: 'R$',
  campaignBy: 'Por',
  callToFAQ: {
    message: 'Dúvidas sobre esse projeto? {0}',
    textLink: 'Confira as respostas às Perguntas Frequentes',
  },
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

  indicators: {
    donorsToCampaign: 'Pessoas doaram para {campaignName}',
    newDonors: {
      title: 'Novos doadores',
      description: 'Pessoas que nunca doaram para esse projeto',
    },
    oldDonors: {
      title: 'Doadores recorrentes',
      description: 'Pessoas que já doaram pelo menos 1 vez para esse projeto',
    },
  },

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
    custom: 'Outro valor',
    toChoose: 'Escolher',
  },
  privacyPolicy: 'Política de privacidade',
  progressOfCampaign: 'Progresso da campanha',

  receipt: 'Recibo | Recibos',
  receipts: {
    amount: 'Valor',
    donorName: 'Nome',
    creationDate: 'Data',
    paymentMethod: 'Método',

    linkTo: 'Ver transação',

    titles: 'Comprovantes de doação e sua importância',
    description: `<p>A Candidatura Monica Seixas e a Bancada Pretas do PSOL registra todas suas doações em um cartório cívico digital para comprovar e manter a autenticidade da sua doação. Essa rede de informações é vinculada a uma das mais seguras e confiáveis redes do mundo, que é a <a href="https://dcrdata.decred.org/" target="_blank">Blockchain do DECRED</a>. Esses números são a referência sobre as doações realizadas.</p>

<p>É fundamental que as plataformas de financiamento coletivo, sociedade e o TSE tenham garantias que as informações ofereçam integridade e confiabilidade de maneira descentralizada para garantir controle social.</p>

<p>Por isso, a Candidatura Monica Seixas e a Bancada Pretas do PSOL está registrando todas suas doações financeiras para comprovar a integridade e honestidade do processo de captação de recursos.</p>`,
  },
  rewards: 'Rewards',
  rewardsIntro: 'Este projeto oferece recompensas em troca do seu apoio. Selecione uma recompensa abaixo.',
  totalAmount: 'Arrecadados',
  totalDonations: 'Doações recebidas',
  useTerms: 'Termos de uso',
  waiting: 'Aguardando',
};
