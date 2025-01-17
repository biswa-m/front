/**
 * Activity Object
 */
import { WireRewardsStruc } from '../modules/wire/interfaces/wire.interfaces';

export interface MindsActivityObject {
  activity: Array<any>;
  pinned: Array<any>;
  allow_comments: boolean;
}

export interface MindsBlogEntity {
  guid: string;
  title: string;
  description: string;
  ownerObj: any;
  spam?: boolean;
  deleted?: boolean;
  paywall?: boolean;
  wire_threshold?: any;
  mature?: boolean;
  slug?: string;
  route?: string;
  header_bg?: string;
  mature_visibility?: boolean;
  monetized?: boolean;
  time_created?: number;
  time_published?: number;
  access_id?: number;
  license?: string;
  allow_comments: boolean;
}

export interface Message {}

export interface KeyVal {
  key: string;
  value: any;
}

export interface Tag {
  tag: string;
  label: string;
  selected?: boolean;
}

export enum ChannelMode {
  PUBLIC = 0,
  MODERATED = 1,
  CLOSED = 2,
}

export interface MindsUser {
  guid: string;
  name: string;
  username: string;
  chat?: boolean;
  icontime: number;
  blocked?: boolean;
  carousels?: any[] | boolean;
  city?: string;
  social_profiles?: KeyVal[];
  wire_rewards?: WireRewardsStruc;
  spam?: boolean;
  deleted?: boolean;
  banned?: any;
  pinned_posts?: Array<string>;
  show_boosts?: boolean;
  merchant?: any;
  briefdescription?: string;
  activity_count?: number;
  supporters_count?: number;
  subscribers_count?: number;
  subscriptions_count?: number;
  impressions?: number;
  subscribed?: boolean;
  rating?: number;
  eth_wallet?: string;
  is_admin?: boolean;
  is_mature?: boolean;
  mature_lock?: boolean;
  tags?: Array<string>;
  toaster_notifications?: boolean;
  pro?: boolean;
  pro_published?: boolean;
  pro_settings?: {
    logo_image: string;
    tag_list?: Tag[];
    background_image: string;
    title: string;
    headline: string;
    one_line_headline: string;
    footer_text: string;
    footer_links: { href: string; title: string }[];
    scheme: string;
    featured_content?: Array<string>;
    tile_ratio?: string;
    styles?: { [key: string]: string };
    domain: string;
    has_custom_logo?: boolean;
    has_custom_background?: boolean;
  };
  mode: ChannelMode;
}

export interface MindsGroup {
  guid: string;
  name: string;
  banner: boolean;
}
