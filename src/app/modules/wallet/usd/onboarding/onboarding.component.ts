import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api';

import { requiredFor, optionalFor } from './onboarding.validators';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { WalletUSDTermsComponent } from '../terms.component';
import { Session } from '../../../../services/session';
import { BTCSettingsComponent } from '../../../payments/btc/settings.component';

@Component({
  selector: 'm-walletUsd__onboarding',
  templateUrl: 'onboarding.component.html',
})
export class WalletUSDOnboardingComponent implements OnInit {
  form: FormGroup;
  inProgress: boolean = false;
  restrictAsVerified: boolean = false;
  eligible: boolean;

  minds = window.Minds;
  merchant: any;
  error: string;

  @Input() edit: boolean = false;

  @Output() completed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private client: Client,
    private cd: ChangeDetectorRef,
    private router: Router,
    protected overlayModal: OverlayModalService,
    private session: Session
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      ssn: ['', requiredFor(['US'], { ignore: this.edit })],
      personalIdNumber: [
        '',
        requiredFor(['CA', 'HK', 'SG'], { ignore: this.edit }),
      ],
      firstName: ['', optionalFor(['JP'])],
      lastName: ['', optionalFor(['JP'])],
      gender: ['', requiredFor(['JP'])],
      dob: ['', Validators.required],
      street: ['', optionalFor(['JP'])],
      city: ['', optionalFor(['JP', 'SG'])],
      state: ['', requiredFor(['AU', 'CA', 'IE', 'US'])],
      postCode: ['', optionalFor(['HK', 'JP'])],
      phoneNumber: ['', Validators.required],
      stripeAgree: ['', Validators.required],
    });

    this.restrictAsVerified = false;

    if (this.merchant) {
      if (this.edit) {
        this.merchant.stripeAgree = true;
        this.restrictAsVerified = this.merchant.verified;
      }

      this.form.patchValue(this.merchant);
    }

    if (this.session.getLoggedInUser().nsfw.length > 0) {
      this.eligible = false;
    } else {
      this.eligible = true;
    }

    this.disableRestrictedFields();
  }

  @Input('merchant') set _merchant(value) {
    if (!value) {
      return;
    }

    this.restrictAsVerified = false;

    if (this.form) {
      if (this.edit) {
        value.stripeAgree = true;
      }

      this.form.patchValue(value);
    }

    this.merchant = value;
    this.restrictAsVerified = this.merchant.verified;
    this.disableRestrictedFields();
  }

  submit() {
    if (!this.edit) {
      this.onboard();
    } else {
      this.update();
    }
  }

  async onboard() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.error = '';

    try {
      const response = <any>(
        await this.client.put('api/v2/wallet/usd/account', this.form.value)
      );
      this.inProgress = false;

      if (!this.minds.user.programs) this.minds.user.programs = [];
      this.minds.user.programs.push('affiliate');

      this.minds.user.merchant = {
        id: response.account.id,
        service: 'stripe',
      };

      this.router.navigate(['/wallet/usd/']);
    } catch (e) {
      this.inProgress = false;
      this.error = e.message;
      this.detectChanges();
    }
  }

  update() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.error = '';

    this.client
      .post('api/v2/wallet/usd/account', this.form.value)
      .then((response: any) => {
        this.inProgress = false;
        this.completed.emit(response);
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message;
        this.detectChanges();
      });
  }

  disableRestrictedFields() {
    if (!this.form) {
      return;
    }

    const action = this.restrictAsVerified ? 'disable' : 'enable';

    this.form.controls.firstName[action]();
    this.form.controls.lastName[action]();
    this.form.controls.gender[action]();
    this.form.controls.dob[action]();
    this.form.controls.street[action]();
    this.form.controls.city[action]();
    this.form.controls.state[action]();
    this.form.controls.postCode[action]();
    this.form.controls.phoneNumber[action]();
  }

  isCountry(countries: string[]) {
    const currentCountry = this.form.controls.country.value;
    return countries.indexOf(currentCountry) > -1;
  }

  showTerms() {
    this.overlayModal.create(WalletUSDTermsComponent).present();
  }

  openBtc() {
    this.overlayModal.create(BTCSettingsComponent, {}).present();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
