import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../common/api/client.service';
import { MindsTitle } from '../../../services/ux/title';
import { REASONS } from '../../../services/list-options';
import { JurySessionService } from '../juryduty/session/session.service';

@Component({
  selector: 'm-reports__banned',
  templateUrl: 'banned.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannedComponent {
  minds = window.Minds;
  appeals = [];

  constructor(
    private client: Client,
    private sessionService: JurySessionService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAppeal();
  }

  async loadAppeal() {
    try {
      let response: any = await this.client.get(
        `api/v2/moderation/appeals/review`
      );
      this.appeals = response.appeals;
      this.detectChanges();
    } catch (e) {}
  }

  get reason() {
    const parts = this.minds.user.ban_reason.split('.');
    const isStrike = parseInt(parts[0]) === 14;
    const reasonCode = isStrike ? parseInt(parts[1]) : parseInt(parts[0]);
    const subReasonCode = isStrike
      ? parseInt(parts[2] || 0)
      : parseInt(parts[1] || 0);

    let friendlyString = '';

    if (isStrike) {
      friendlyString = 'exceeding 3 strikes for ';
    }

    return (
      friendlyString +
      this.sessionService.getReasonString({
        reason_code: reasonCode,
        sub_reason_code: subReasonCode,
      })
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
