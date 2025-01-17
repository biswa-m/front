import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Session } from '../../services/session';
import currency, { Currency } from '../../helpers/currency';

export type UpgradeOptionInterval = 'yearly' | 'monthly';

export type UpgradeOptionCurrency = Currency;

@Component({
  selector: 'm-upgrades__upgradeOptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrade-options.component.html',
})
export class UpgradeOptionsComponent {
  minds = window.Minds;

  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'usd';

  constructor(public session: Session) {}

  get intervalCurrencyQueryParams() {
    return { i: this.interval, c: this.currency };
  }

  get plusPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.minds.upgrades.plus.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.minds.upgrades.plus.monthly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.minds.upgrades.plus.monthly[this.currency],
          this.currency
        ),
        offerFrom: null,
      };
    }
  }

  get proPricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.minds.upgrades.pro.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.minds.upgrades.pro.monthly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.minds.upgrades.pro.monthly[this.currency],
          this.currency
        ),
        offerFrom: null,
      };
    }
  }
}
