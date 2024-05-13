interface GenderData {
  values: {
    gender: string;
  };
}

const showGenderedVersion = (terms: Record<string, string>, gender: string = 'other') => terms[gender] || terms.other;

export default {
  _currencySymbol: 'R$',
  backToCampaign: 'Voltar à campanha',
  callToFAQ: {
    message: 'Dúvidas sobre esse projeto? {0}',
    textLink: 'Confira as respostas às Perguntas Frequentes',
  },
  campaignBy: 'Por',
  closeError: 'Fechar mensagem de erro',
  chooseThisReward: 'Selecionar essa recompensa',
  credits: {
    fundraiserLabel: 'Responsável por esta página',
    poweredBy: 'Campanha proporcionada por',
  },
  creditCard: {
    fullName: 'Nome impresso no cartão de crédito',
    number: 'Número do cartão',
    expirationDate: 'Vencimento',
    name: 'Nome no cartão',
    validationCode: 'CVV',
  },
  donateWithoutReward: 'Doe sem recompensa',
  donationForm: {
    birthDate: 'Data de nascimento',
    city: 'Cidade',
    declaration: `Ao completar essa transação, declaro que minhas doações não ultrapassam 10% dos meus rendimentos brutos do ano anterior, a origem do dinheiro não é estrangeira e não sou concessionário ou permissionário de serviço público.

Declaro estar ciente que, ao realizar uma doação, por conta da legislação eleitoral, os seus dados (nome completo, CPF, valor individual de cada doação, forma de pagamento, data das doações) poderão ser visualizados de forma pública no site do candidato e na aba transparência e concordo com os [termos de doação](https://participe.votolegal.com.br/files/Termo%20de%20uso%20e%20Politica%20de%20privacidade%20(unificado)%20-%20Voto%20Legal%20-%202020%402020-09-23.pdf).`,

    donationExpenses: {
      expenses: 'Custos de operação',
      grossAmount: 'Valor da doação',
      label: 'Doar os custos de operação',
      message: 'Nem toda a sua doação vai para **{campaignName}**. Para maximizar seu impacto, você pode doar também o valor dos custos de operação.',
      netAmount: 'Recebido por {campaignName}',
    },

    donationPaymentSummary: 'Resumo da doação',
    donationTo: 'Doação {campaignName}',
    email: 'E-mail',
    editValue: 'Mudar valor',
    extendedAddress: 'Complemento',
    familyName: 'Sobrenome',
    iDoNotKnowMyPostalCode: 'Não sei o meu CEP',
    name: 'Nome',
    naturalPersonIdentificationAgreement: 'Estou ciente de que o pagamento deve ser realizado por este CPF e divergências podem causar seu cancelamento e estorno.',
    number: 'Número',
    pendingMessages: {
      gettingAddress: 'Buscando endereço...',
      validatingDevice: 'Validando dispositivo...',
      creatingDonation: 'Criando doação...',
      validatingCreditCard: 'Validando cartão de crédito...',
      payingDonation: 'Pagando doação',
    },
    phoneNumber: 'Telefone',
    postalCode: 'CEP',
    safeTransaction: 'Ambiente seguro. © DoarPara',
    state: 'Estado',
    street: 'Endereço',
    submit: 'Doar {amount}',
  },
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
  errors: {
    adBlocker: 'Há um bloqueador de anúncios impedindo o processador de pagamentos.',
    is_invalid: 'Valor inválido',

    404: {
      title: 'Oops!',
      message: 'A candidatura que você procura não foi encontrada.',
    },

    generic: {
      title: 'Oops!',
      message: 'Ocorreu um erro.',
    },

    server: {
      title: 'Oops!',
      message: 'Ocorreu um erro interno, mas não se preocupe. Estamos cientes e trabalhando na correção.',
    },

    VotoLegalFP: 'Um componente essencial falhou em carregar',
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
  noDonations: 'Não há doações',
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
  paymentMethod: 'Meio de pagamento',
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
    description: `**{campaignName}** registra todas suas doações em um cartório cívico digital para comprovar e manter a autenticidade da sua doação. Essa rede de informações é vinculada a uma das mais seguras e confiáveis redes do mundo, que é a [Blockchain do DECRED](https://dcrdata.decred.org/). Esses números são a referência sobre as doações realizadas.

É fundamental que as plataformas de financiamento coletivo, sociedade e o TSE tenham garantias que as informações ofereçam integridade e confiabilidade de maneira descentralizada para garantir controle social.

Por isso, **{campaignName}** está registrando todas suas doações financeiras para comprovar a integridade e honestidade do processo de captação de recursos.`,
  },
  rewards: 'Rewards',
  rewardsIntro: 'Este projeto oferece recompensas em troca do seu apoio. Selecione uma recompensa abaixo.',
  toExposeData: 'Exibir',
  totalAmount: 'Arrecadados',
  totalAmountByDonationsPerSource: '{percentage}% por {numberOfDonations} doações ({source})',
  totalDonations: 'Doações recebidas',
  useTerms: 'Termos de uso',
  waiting: 'Aguardando...',
  visitWebsite: 'Visitar página inicial',
};
