import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign, CampaignPayment } from "../campaigns.type";
import { CampaignsService } from '../campaigns.service';
import { Subscription } from 'rxjs';
import { Tag } from '../../../hashtags/types/tag';
import { CampaignPaymentsService } from '../campaign-payments.service';

@Component({
  providers: [CampaignsService, CampaignPaymentsService],
  selector: 'm-boost-campaigns-creator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'creator.component.html',
})
export class BoostCampaignsCreatorComponent implements OnInit, OnDestroy {

  isEditing: boolean = false;

  urn: string;

  campaign: Campaign;

  inProgress: boolean = false;

  currentError: string = '';

  protected route$: Subscription;

  constructor(
    protected service: CampaignsService,
    protected payments: CampaignPaymentsService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.reset();

    this.route$ = this.route.params.subscribe(params => {
      if (params.from || params.type) {
        this.createFrom(params as { from, type });
      }

      if (params.urn && this.urn !== params.urn) {
        this.urn = params.urn;
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.route$.unsubscribe();
  }

  createFrom({ type, from }) {
    this.reset();

    if (type) {
      // TODO: Validate that it's a valid type
      this.campaign.type = type;
    }

    if (from) {
      this.campaign.entity_urns = [from];
    }

    this.detectChanges();
  }

  async load() {
    if (!this.urn) {
      this.isEditing = false;
      this.reset();
      this.detectChanges();
      return;
    }

    this.isEditing = true;
    this.campaign = void 0;
    this.inProgress = true;
    this.detectChanges();

    try {
      const campaign = await this.service.get(this.urn);

      this.campaign = campaign;
    } catch (e) {
      console.error('BoostCampaignsCreatorComponent', e);
      this.currentError = (e && e.message) || 'Unknown error. Check your browser console.';
      this.campaign = void 0;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  reset() {
    this.campaign = {
      name: '',
      type: 'newsfeed',
      budget: 5,
      entity_urns: [],
      hashtags: [],
      start: Date.now(),
      end: Date.now() + (5 * 24 * 60 * 60 * 1000),
      impressions: 0,
    };

    this.currentError = '';

    this.calcImpressions();
  }

  calcImpressions() {
    this.campaign.impressions = (this.campaign.budget || 0) * 1000;
  }

  onTagsAdded(tags: Tag[]) {
    const tagValues = tags.map(tag => tag.value);

    this.campaign.hashtags.push(...tagValues);
  }

  onTagsRemoved(tags: Tag[]) {
    const tagValues = tags.map(tag => tag.value);

    this.campaign.hashtags = this.campaign.hashtags.filter(hashtag => tagValues.indexOf(hashtag) === -1)
  }

  onStartDateChange(date) {
    this.campaign.start = Date.parse(date);
  }

  onEndDateChange(date) {
    this.campaign.end = Date.parse(date);
  }

  canSubmit() {
    return this.service.validate(this.campaign);
  }

  get types() {
    return this.service.getTypes();
  }

  async submit() {
    if (!this.canSubmit() || this.inProgress) {
      return;
    }

    this.currentError = '';
    this.inProgress = true;
    this.detectChanges();

    try {
      if (!this.isEditing && (!this.campaign.checksum || !this.campaign.client_guid)) {
        const { guid, checksum } = await this.service.prepare(this.campaign);

        this.campaign.client_guid = guid;
        this.campaign.checksum = checksum;
      }

      let payment: CampaignPayment = null;
      let amountDue = this.payments.calculateAmountDue(this.campaign, this.isEditing);

      if (amountDue > 0) {
        payment = await this.payments.pay(this.campaign, amountDue);

        if (!payment) {
          this.currentError = '';
          this.inProgress = false;

          this.detectChanges();
          return;
        }
      }

      const campaign = !this.isEditing ?
        await this.service.create(this.campaign, payment) :
        await this.service.update(this.campaign, payment);

      // NOTE: Keeping inProgress true until redirection happens
      setTimeout(() => {
        // TODO: Use RxJS as timer, little delay so we wait for ES to be updated
        this.router.navigate(['/boost/campaigns', campaign.urn]);
      }, 1000);
    } catch (e) {
      console.error('BoostCampaignsCreatorComponent', e);
      this.currentError = (e && e.message) || 'Unknown error. Check your browser console.';
      this.inProgress = false;
    }

    this.detectChanges();
  }

  async cancel($event?) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (this.inProgress) {
      return;
    }

    // TODO: Use a nice modal
    if (!confirm(`Are you sure? There's no UNDO from cancelling a campaign. You will receive a refund.`)) {
      return;
    }

    this.currentError = '';
    this.inProgress = true;
    this.detectChanges();

    try {
      await this.service.cancel(this.campaign);

      // NOTE: Keeping inProgress true until redirection happens
      setTimeout(() => {
        // TODO: Use RxJS as timer, little delay so we wait for ES to be updated
        this.router.navigate(['/boost/campaigns', this.campaign.urn]);
      }, 1000);
    } catch (e) {
      console.error('BoostCampaignsCreatorComponent', e);
      this.currentError = (e && e.message) || 'Unknown error. Check your browser console.';
      this.inProgress = false;
    }

    this.detectChanges();
  }

  get amountDue(): number {
    return this.payments.calculateAmountDue(this.campaign, this.isEditing);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}