type Id = string | number;

type Date = string;

type Theme = 'default' | 'blue' | 'green' | 'orange' | 'red';

interface SubNationalEntities {
  name: string;
  abbr: string;
}

type Office = 'municipal_council' | 'city_hall' | 'state_legislature' | 'state_government' | 'federal_chamber' | 'senate' | 'presidency';

type Gender = 'male' | 'female' | 'other' | 'prefer not to say';

type PaymentMethod = 'pro_forma_invoice' | 'credit_card' | 'instant_payment_platform';

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

type PledgeValue = number | 'custom';

export interface Reward {
  id: Id;
  name: string;
  description: string;
  minimum_value: number;
  total_available: number;
  total_of_supporters: number;
  image: string;
}

export interface RaisedAmount {
  source: string;
  value: number;
}

interface Donation {
  id: Id;
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
  total_amount: number | RaisedAmount[];
  total_donations: number;
  pledge_list: PledgeValue[];
  minimum_donation: number;
  maximum_donation: number;
  payment_method_list: PaymentMethod[];
  reward_list: Reward[];

  cover: ImageOrSet;
  video: string;
  theme: Theme;
  preamble: string;
  description: string;
  sharingImage: Image;

  campaign_section_list: CampaignSection[];

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
