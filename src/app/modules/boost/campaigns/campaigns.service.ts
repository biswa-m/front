import { Injectable } from '@angular/core';
import { Campaign, CampaignDeliveryStatus, CampaignPayment, CampaignType } from './campaigns.type';
import { Client } from '../../../services/api/client';
import isInt from '../../../helpers/is-int';
import getGuidFromUrn from '../../../helpers/get-guid-from-urn';

export type CampaignsServiceListOptions = {
  limit?: number;
  offset?: string;
}

@Injectable()
export class CampaignsService {

  constructor(
    protected client: Client,
  ) {
  }

  async list(opts: CampaignsServiceListOptions = {}): Promise<{ campaigns: Array<Campaign>, 'load-next'?: string }> {
    const queryString = {
      limit: opts.limit || 12,
      offset: opts.offset || '',
    };

    return await this.client.get(`api/v2/boost/campaigns`, queryString) as any;
  }

  async get(urn: string): Promise<Campaign> {
    const campaigns: Campaign[] = (await this.client.get(`api/v2/boost/campaigns/${urn}`) as any).campaigns;

    if (typeof campaigns[0] === 'undefined') {
      return null;
    }

    return {
      ...campaigns[0],
      original_campaign: JSON.parse(JSON.stringify(campaigns[0])),
    };
  }

  isEditable(campaign: Campaign): boolean {
    return (['pending', 'created', 'approved'] as CampaignDeliveryStatus[])
      .indexOf(campaign.delivery_status) > -1;
  }

  validate(campaign: Campaign): boolean {
    // TODO: Validate data ranges, etc

    return campaign &&
      campaign &&
      campaign.name &&
      campaign.type &&
      campaign.budget &&
      campaign.budget > 0 &&
      isInt(campaign.budget) &&
      campaign.entity_urns &&
      campaign.entity_urns.length &&
      campaign.start &&
      campaign.end &&
      campaign.start <= campaign.end;
  }

  async prepare(campaign: Campaign): Promise<{ checksum: string, guid: string }> {
    if (campaign.entity_urns.length !== 1) {
      throw new Error('Campaigns without a single entity are unsupported');
    }

    const entityGuid = getGuidFromUrn(campaign.entity_urns[0]);

    const { guid, checksum } = await this.client.get(`api/v2/boost/prepare/${entityGuid}`) as any;

    if (!guid) {
      throw new Error('Cannot generate GUID');
    }

    return { guid, checksum };
  }

  async create(campaign: Campaign, payment?: CampaignPayment): Promise<Campaign> {
    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    const data = { ...campaign };

    if (payment) {
      data['nonce'] = payment;
    }

    return (await this.client.post(`api/v2/boost/campaigns`, data) as any).campaign;
  }

  async update(campaign: Campaign, payment?: CampaignPayment): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    const data = { ...campaign };

    if (payment) {
      data['nonce'] = payment;
    }

    return (await this.client.post(`api/v2/boost/campaigns/${campaign.urn}`, data) as any).campaign;
  }

  async cancel(campaign: Campaign): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    return (await this.client.delete(`api/v2/boost/campaigns/${campaign.urn}`) as any).campaign;
  }

  getTypes(): Array<{ id: CampaignType, label: string, disabled?: boolean }> {
    return [
      {
        id: 'newsfeed',
        label: 'Newsfeed'
      },
      {
        id: 'content',
        label: 'Sidebar'
      },
      {
        id: 'banner',
        label: 'Banner',
        disabled: true
      },
      {
        id: 'video',
        label: 'Video',
        disabled: true
      }
    ];
  }

  getDeliveryStatuses(): Array<{ id: CampaignDeliveryStatus, label: string }> {
    return [
      {
        id: 'pending',
        label: 'Pending',
      },
      {
        id: 'created',
        label: 'Created',
      },
      {
        id: 'failed',
        label: 'Failed',
      },
      {
        id: 'approved',
        label: 'Active',
      },
      {
        id: 'rejected',
        label: 'Rejected',
      },
      {
        id: 'revoked',
        label: 'Cancelled',
      },
      {
        id: 'completed',
        label: 'Completed',
      },
    ];
  }
}