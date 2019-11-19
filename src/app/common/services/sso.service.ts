import { Injectable } from '@angular/core';
import { SiteService } from './site.service';
import { Client } from '../../services/api/client';
import { Session } from '../../services/session';

@Injectable()
export class SsoService {
  protected readonly minds = window.Minds;

  constructor(
    protected site: SiteService,
    protected client: Client,
    protected session: Session
  ) {
    this.listen();
  }

  listen() {
    this.session.isLoggedIn((is: boolean) => {
      if (is) {
        this.auth();
      }
    });
  }

  isRequired(): boolean {
    return this.site.isProDomain;
  }

  async connect() {
    try {
      const connect: any = await this.client.postRaw(
        `${this.minds.site_url}api/v2/sso/connect`
      );

      if (connect && connect.token && connect.status === 'success') {
        // TODO: Use headers
        const authorization: any = await this.client.post(
          'api/v2/sso/authorize',
          {
            token: connect.token,
          }
        );

        this.session.inject(window.Minds.user);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async auth() {
    try {
      const connect: any = await this.client.post('api/v2/sso/connect');

      if (connect && connect.token && connect.status === 'success') {
        // TODO: Use headers
        await this.client.postRaw(
          `${this.minds.site_url}api/v2/sso/authorize`,
          {
            token: connect.token,
          }
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}