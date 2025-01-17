import { Component, Input } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { BoostConsoleFilter } from '../../console/console.component';

@Component({
  selector: 'm-boost-publisher--payouts',
  templateUrl: 'payouts.component.html',
})
export class BoostPublisherPayoutsComponent {
  _filter: BoostConsoleFilter;

  minds: Minds = window.Minds;

  startDate: string;
  inProgress: boolean = false;
  payoutRequestInProgress: boolean = false;

  constructor(public session: Session, private client: Client) {}

  submit(publisher: boolean) {
    this.inProgress = true;
    this.minds.user.show_boosts = true;
    this.client
      .post(`api/v1/settings/${this.minds.user.guid}`, {
        show_boosts: publisher,
      })
      .then(() => {
        this.inProgress = false;
      })
      .catch(() => {
        this.minds.user.show_boosts = false;
        this.inProgress = false;
      });
  }

  isMerchant() {
    const user = this.session.getLoggedInUser();
    return user && user.merchant;
  }

  requestPayout() {
    this.payoutRequestInProgress = true;
    this.client
      .post('api/v1/payout')
      .then(() => {
        this.payoutRequestInProgress = false;
      })
      .catch(() => {
        this.payoutRequestInProgress = false;
      });
  }
}
