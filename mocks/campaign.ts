import type { Campaign } from '../doar-para.d.ts';

const campaign: Campaign = {
  name: 'Lorem ipsum',
  slug: 'campanha-1',
  cover: 'https://foo.bar/cover.jpg',
  video: 'https://www.youtube.com/watch?v=t8DhTOXghtA',
  theme: 'blue',

  contact_methods: {
    instagram: 'https://www.instagram.com/foradoplastico/',
    mastodon: 'https://fosstodon.org/@gohugoio',
    tiktok: '',
    website: 'https://foradoplastico.com.br/',
    twitter: 'https://twitter.com/foradoplastico',
    whatsapp: '',
  },
  pledge_list: [
    1000,
    2000,
    'custom', // Including "custom" as a string
  ],
  recurrence: true,
  fundraiser: {
    name: 'John Doe',
    natural_person_id: '90420112030', // CPF
    legal_entities_id: '22955591000193', // CNPJ

    gender: 'male',
    state: 'BA',
    city: 'Caraguataí',

    office: 'câmara municipal',
    ballot_number: '1234',
    political_party: {
      ballot_number: '99',
      name: 'Partido das coisas',
      abbreviation: 'PC',
    },
  },
  total_amount: 50000,
  total_donations: 1000,
  preamble: 'Minima eveniet sapiente deserunt nobis vel sit id quibusdam. Ipsum autem earum quia repellat. Totam totam et. Amet libero vel aut. Sunt voluptatem quos veritatis tenetur expedita repellendus iure laudantium asperiores.',

  description: '<p>Natus porro illo et est perferendis. Ex sint soluta est quae eos eum deserunt praesentium. Minus et consequuntur voluptates.</p><p>Corrupti asperiores praesentium est tempore velit ab. Aut dolorem soluta odit. In voluptates culpa sed quo. Placeat odit quia est aut voluptatem et odio porro.</p><p>Ratione repudiandae aperiam quia qui necessitatibus consequuntur consequatur reprehenderit ratione. Necessitatibus eius non numquam nesciunt non magni provident iusto. Nisi dolor dolorem excepturi explicabo repellendus consequatur sint animi.</p>', // already parsed to save a dependency
  campaign_section_list: [
    'description',
    'donations',
    'faq',
    'goals',
    'rewards',
    'testimonies',
  ],
  goal_list: [
    {
      amount: 10000,
      description: 'Reach <strong>more</strong> supporters', // already parsed to save a dependency
    },
    {
      amount: 100000,
      description: 'Reach <strong>even more</strong> supporters', // already parsed to save a dependency
    },
  ],
  payment_method_list: [
    'pro_forma_invoice',
    'credit_card',
    'instant_payment_platform',
  ],
  reward_list: [
    {
      id: '1582f967-76c3-42c5-bca3-35be389a1463',
      name: 'Reward 1',
      image: 'https://placehold.in/300x150.png',
      description: 'Description of Reward 1',
      minimumValue: 50,
      totalAvailable: 100,
    },
    {
      id: 'ac644abf-9e92-49c6-82fb-dff685f59d28',
      name: 'Reward 2',
      image: 'https://placehold.in/300x150.png',
      description: 'Description of Reward 2',
      minimumValue: 100,
      totalAvailable: 50,
    },
  ],
};

export default campaign;
