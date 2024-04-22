type Id = string | number;

type Date = string;

type Theme = 'default' | 'blue' | 'green' | 'orange' | 'red';

interface SubNationalEntities {
  name: string;
  abbr: string;
}

type Office = 'municipal_council' | 'city_hall' | 'state_legislature' | 'state_government' | 'federal_chamber' | 'senate' | 'presidency';

type Gender = 'male' | 'female' | 'other' | 'prefer not to say';

export type PaymentMethod = 'pro_forma_invoice' | 'credit_card' | 'instant_payment_platform';

export type ApiError = {
  message?: string,
  statusCode?: number,
  data?: {
    message?: string,
    msg_id?: string,
    error?: string,
  } | any,
};

export type CampaignSection = 'description' | 'donations' | 'faq' | 'goals' | 'rewards' | 'testimonies';

interface PoliticalParty {
  ballot_number: string;
  name: string;
  abbreviation: string;
}

type Image = string | { url: string; width: number; height: number };

type ImageOrSet = Image | Image[];

interface LegalEntity {
  name: string;
  legal_entities_id: string;

  city: string;
  state: SubNationalEntities;

  avatar: Image;
  slug: string;
}

interface Candidate {
  name: string;
  natural_person_id: string;
  political_party: PoliticalParty;
  gender: Gender;

  city: string;
  state: SubNationalEntities;

  office: string;
  ballot_number: string;

  avatar: Image;
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

export type MinDonationValue = {
  method: PaymentMethod,
  value: number,
};

export type PledgeValue = number | 'custom';

export interface Reward {
  id: Id;
  name: string;
  description: string;
  minimum_value: number;
  total_available: number;
  total_of_supporters: number;
  image: string;
}

export interface RaisedAndSource {
  name: string;
  total_donated: number;
  total_donations: number;
  cnpj: string;
  type: string;
  social_name: string;
  recurring_percent: number | string;
  new_donors_percent: number | string;
}

interface Donation {
  id: Id;
  captured_at: Date;
  payment_method: PaymentMethod;
  payment_method_human: string;
  amount: number;
  donor_name: string;
  name: string;
  donor_natural_person_id: string;

  platform: string;
  from_votolegal: boolean | number;
  is_irregular: boolean | number;
  cpf: string;
  transaction_link: string | null;
  digest: string;
  hash: string | null;

  _marker?: string;
}

// API endpoints ///////////////////////////////////////////////////////////////

export interface Campaign {
  slug: string;
  name: string;
  id: string | number;

  fundraiser: FundRaiser;

  contact_methods: ContactMethods;

  is_recurrent: boolean;
  is_flexible_funding: boolean;
  is_election_campaign: boolean;
  platforms: RaisedAndSource[];
  pledge_list: PledgeValue[];
  min_donation_values: MinDonationValue[];

  max_donation_value: number;
  payment_method_list: PaymentMethod[];
  reward_list: Reward[];

  cover: ImageOrSet;
  video: string;
  theme: Theme;
  preamble: string;
  description: string;
  sharing_image: Image;

  campaign_section_list: CampaignSection[];

  goal_list: Goal[];
}

export type CreatedDonation = {
  id: string;
  amount: number;
  captured_at: string | null;
  donor: {
    cpf: string;
    name: string;
  }
  state: 'boleto_authentication' | 'certificate_refused' | 'credit_card_form' | 'pix_expired' | 'wait_for_compensation' | 'waiting_pix_payment';
} | null;

export type DonationMessage = {
  account_id?: string;
  href?: string;
  is_testing?: 0 | 1;
  ref?: string;
  text?: string;
  type: string;
};

export interface DonationResponse {
  donations: Donation[];
  has_more: boolean;
  pagination_marker?: string;
  recurring_percent?: string;
  new_donors_percent?: string;
}

export interface FAQ {
  list: {
    question: string;
    answer: string;
  }[];
}
