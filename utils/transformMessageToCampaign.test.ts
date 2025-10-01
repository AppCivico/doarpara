import { describe, expect, it } from 'vitest';
import type { Campaign } from '../doar-para.d';
import transformMessageToCampaign from './transformMessageToCampaign.ts';

const mockCampaign: Campaign = {
  id: '1',
  slug: 'test-campaign',
  name: 'Test Campaign',
  fundraiser: {
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    slug: 'john-doe',
    natural_person_id: '000.000.000-00',
    political_party: {
      ballot_number: '0',
      name: 'Partido',
      abbreviation: 'P',
    },
    gender: 'prefer not to say',
    city: 'City',
    state: {
      name: 'State',
      abbr: 'S'
    },
    office: 'presidency',
    ballot_number: '0',
    legal_entities_id: '00.000.000/0000-00'
  },
  contact_methods: {},
  is_recurrent: false,
  is_flexible_funding: false,
  is_election_campaign: false,
  platforms: [],
  pledge_list: [],
  min_donation_values: [],
  max_donation_value: 1000,
  payment_method_list: [],
  reward_list: [],
  cnpj_approved: false,
  cover: 'https://example.com/cover.jpg',
  video: 'https://youtube.com/watch?v=test',
  theme: 'default',
  preamble: 'Test preamble',
  description: 'Test description',
  sharing_image: 'https://example.com/sharing.jpg',
  campaign_section_list: [],
  goal_list: [],
  refs_videos: [],
};

describe('transformMessageToCampaign', () => {
  it('should transform color to theme', () => {
    const result = transformMessageToCampaign({ color: 'blue' }, mockCampaign);
    expect(result.theme).toBe('blue');
  });

  it('should transform picture to fundraiser.avatar', () => {
    const result = transformMessageToCampaign(
      { picture: 'https://example.com/new-avatar.jpg' },
      mockCampaign,
    );
    expect(result.fundraiser?.avatar).toBe('https://example.com/new-avatar.jpg');
    expect(result.fundraiser?.name).toBe('John Doe');
  });

  it('should transform video_url to video', () => {
    const result = transformMessageToCampaign(
      { video_url: 'https://youtube.com/watch?v=new' },
      mockCampaign,
    );
    expect(result.video).toBe('https://youtube.com/watch?v=new');
  });

  it('should transform video_cover to cover', () => {
    const result = transformMessageToCampaign(
      { video_cover: 'https://example.com/new-cover.jpg' },
      mockCampaign,
    );
    expect(result.cover).toBe('https://example.com/new-cover.jpg');
  });

  it('should transform username to slug', () => {
    const result = transformMessageToCampaign(
      { username: 'new-campaign-slug' },
      mockCampaign,
    );
    expect(result.slug).toBe('new-campaign-slug');
  });

  it('should transform name to fundraiser.name', () => {
    const result = transformMessageToCampaign(
      { name: 'Jane Doe' },
      mockCampaign,
    );
    expect(result.fundraiser?.name).toBe('Jane Doe');
    expect(result.fundraiser?.avatar).toBe('https://example.com/avatar.jpg');
  });

  it('should handle multiple properties at once', () => {
    const result = transformMessageToCampaign(
      {
        color: 'green',
        picture: 'https://example.com/avatar2.jpg',
        video_url: 'https://youtube.com/watch?v=multi',
        username: 'multi-test',
        name: 'Multi Test',
      },
      mockCampaign,
    );

    expect(result.theme).toBe('green');
    expect(result.fundraiser?.avatar).toBe('https://example.com/avatar2.jpg');
    expect(result.fundraiser?.name).toBe('Multi Test');
    expect(result.video).toBe('https://youtube.com/watch?v=multi');
    expect(result.slug).toBe('multi-test');
  });

  it('should preserve existing fundraiser properties when updating picture', () => {
    const result = transformMessageToCampaign(
      { picture: 'https://example.com/new.jpg' },
      mockCampaign,
    );
    expect(result.fundraiser?.slug).toBe('john-doe');
  });

  it('should preserve existing fundraiser properties when updating name', () => {
    const result = transformMessageToCampaign(
      { name: 'New Name' },
      mockCampaign,
    );
    expect(result.fundraiser?.slug).toBe('john-doe');
  });

  it('should merge fundraiser updates when both picture and name are provided', () => {
    const result = transformMessageToCampaign(
      {
        picture: 'https://example.com/new-avatar.jpg',
        name: 'Combined Test',
      },
      mockCampaign,
    );

    expect(result.fundraiser?.avatar).toBe('https://example.com/new-avatar.jpg');
    expect(result.fundraiser?.name).toBe('Combined Test');
    expect(result.fundraiser?.slug).toBe('john-doe');
  });

  it('should ignore unused properties', () => {
    const result = transformMessageToCampaign(
      {
        is_published: true,
        show_external_donations: true,
        faq_tab_active: false,
      },
      mockCampaign,
    );

    expect(result).toEqual({});
  });

  it('should return empty object when no properties are provided', () => {
    const result = transformMessageToCampaign({}, mockCampaign);
    expect(result).toEqual({});
  });
});
