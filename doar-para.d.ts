type id = string|number;

type Date = string;

type Theme = 'default' | 'blue' | 'green' | 'orange' | 'red';

interface subNationalEntities {
  name: string;
  abbr: string;
};

type Office = 'câmara municipal' | 'prefeitura' | 'câmara estadual' | 'governo estadual' | 'câmara federal' | 'senado' | 'presidência';

type Gender = 'male' | 'female' | 'other' | 'prefer not to say';

type PaymentMethod = 'pro_forma_invoice' | 'credit_card' | 'instant_payment_platform';

type CampaignSections = 'description' | 'donations' | 'faq' | 'goals' | 'rewards' | 'testimonies';

interface PoliticalParty {
  ballot_number: string;
  name: string;
  abbreviation: string;
}

type Image = string | { url: string; width: number; height: number };

interface LegalEntity {
  name: string;
  legal_entities_id: string;

  city: string;
  state: subNationalEntities;

  logotype: Image;
  slug: string;
}

interface Candidate {
  name: string;
  natural_person_id: string;
  political_party: PoliticalParty;
  gender: Gender;

  city: string;
  state: subNationalEntities;

  office: string;
  ballot_number: string;

  logotype: Image;
  slug: string;
}

type FundRaiser = Required<Partial<Candidate> & Partial<LegalEntity>>;

type ContactService = 'instagram' | 'mastodon' | 'tiktok' | 'website' | 'twitter' | 'whatsapp';

export interface ContactMethods {
  [ContactService: string]: string; // Dictionary with contact methods as keys and URLs as values
}

export interface Goal {
  amount: number;
  title: string;
  description: string;
}

type PledgeValue = number | 'custom';

export interface Reward {
  id: id;
  name: string;
  description: string;
  minimum_value: number;
  total_available: number;
  total_of_supporters: number;
  image: string;
}

interface Donation {
  id: id;
  creation_date: Date;
  payment_method: PaymentMethod;
  amount: number;
  donor_name: string;
  donor_natural_person_id: string;
}

// API endpoints ///////////////////////////////////////////////////////////////

export interface Campaign {
  slug: string;
  name: string;

  fundraiser: FundRaiser;

  contact_methods: ContactMethods;

  is_recurrent: boolean;
  is_flexible_funding: boolean;
  is_election_campaign: boolean;
  total_amount: number;
  total_donations: number;
  pledge_list: PledgeValue[];
  payment_method_list: PaymentMethod[];
  reward_list: Reward[];

  cover: Image;
  video: string;
  theme: Theme;
  preamble: string;
  description: string;

  campaign_section_list: CampaignSections[];

  goal_list: Goal[];
}

export interface DonationList {
  list: Donation[];
  has_more: boolean;
  pagination_marker?: string;
}

export interface FAQ {
  list: {
    question: string;
    answer: string;
  }[];
}
