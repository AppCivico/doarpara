import type { Campaign } from '../doar-para.d.ts';

type MessageProperties = {
  is_published?: boolean;
  color?: string;
  picture?: string;
  video_url?: string;
  video_cover?: string;
  show_external_donations?: boolean;
  faq_tab_active?: boolean;
  username?: string;
  name?: string;
};

export default function transformMessageToCampaign(
  properties: MessageProperties,
  currentCampaign: Campaign,
): Partial<Campaign> {
  const transformed: Partial<Campaign> = {};

  if (properties.color !== undefined) {
    transformed.theme = properties.color as Campaign['theme'];
  }

  if (properties.picture !== undefined) {
    transformed.fundraiser = {
      ...currentCampaign.fundraiser,
      avatar: properties.picture,
    };
  }

  if (properties.video_url !== undefined) {
    transformed.video = properties.video_url;
  }

  if (properties.video_cover !== undefined) {
    transformed.cover = properties.video_cover;
  }

  if (properties.username !== undefined) {
    transformed.slug = properties.username;
  }

  if (properties.name !== undefined) {
    transformed.fundraiser = {
      ...currentCampaign.fundraiser,
      ...transformed.fundraiser,
      name: properties.name,
    };
  }

  return transformed;
}
