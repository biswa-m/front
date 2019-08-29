import { Component } from '@angular/core';
import { ProChannelService } from "../channel.service";
import { Session } from '../../../../services/session';
import { AuthService } from '../../../../services/auth.service';

export interface SocialProfileMeta {

  key: string;
  label: string;
  link: string;
  icon: string;
  customIcon?: boolean;
  domain: string;

}

@Component({
  selector: 'm-pro--channel-footer',
  templateUrl: 'footer.component.html'
})

export class ProChannelFooterComponent {

  constructor(
    protected channelService: ProChannelService,
    protected session: Session,
    protected auth: AuthService,
  ) { }

  private socialProfileMeta: SocialProfileMeta[] = [
    {
      key: 'facebook',
      label: 'Facebook',
      link: 'https://www.facebook.com/:value',
      icon: 'facebook-official',
      domain: 'facebook.com',
    },
    {
      key: 'github',
      label: 'Github',
      link: 'https://github.com/:value',
      icon: 'github',
      domain: 'github.com',
    },
    {
      key: 'twitch',
      label: 'Twitch',
      link: 'https://www.twitch.tv/:value',
      icon: 'twitch',
      domain: 'twitch.tv',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      link: 'https://linkedin.com/in/:value',
      icon: 'linkedin',
      domain: 'linkedin.com',
    },
    {
      key: 'youtube_channel',
      label: 'YouTube Channel',
      link: 'https://www.youtube.com/channel/:value',
      icon: 'youtube',
      domain: 'youtube.com',
    },
    {
      key: 'minds',
      label: 'Minds',
      link: 'https://www.minds.com/:value',
      icon: 'minds',
      customIcon: true,
      domain: 'minds.com',
    },
    {
      key: 'reddit',
      label: 'Reddit',
      link: 'https://www.reddit.com/u/:value',
      icon: 'reddit',
      domain: 'reddit.com',
    },
    {
      key: 'soundcloud',
      label: 'SoundCloud',
      link: 'https://soundcloud.com/:value',
      icon: 'soundcloud',
      domain: 'soundcloud.com'
    },
    {
      key: 'tumblr',
      label: 'Tumblr Site',
      link: 'https://:value.tumblr.com',
      icon: 'tumblr',
      domain: 'tumblr.com',
    },
    {
      key: 'twitter',
      label: 'Twitter',
      link: 'https://twitter.com/:value',
      icon: 'twitter',
      domain: 'twitter.com',
    },
    {
      key: 'github',
      label: 'Github',
      link: 'https://github.com/:value',
      icon: 'github',
      domain: 'github.com',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      link: 'https://www.instagram.com/:value',
      icon: 'instagram',
      domain: 'instagram.com'
    },
    {
      key: 'wikipedia_user',
      label: 'Wikipedia User',
      link: 'https://wikipedia.org/wiki/:value',
      icon: 'wikipedia-w',
      domain: 'wikipedia.com'
    },
    {
      key: 'imdb_user',
      label: 'IMDb User',
      link: 'https://www.imdb.com/name/:value',
      icon: 'imdb',
      domain: 'imdb.com',
    },
    {
      key: 'steam',
      label: 'Steam Profile',
      link: 'https://steamcommunity.com/id/:value/',
      icon: 'steam',
      domain: 'steamcommunity.com',
    },
    {
      key: 'deviantart',
      label: 'Deviantart User',
      link: 'https://:value.deviantart.com/',
      icon: 'deviantart',
      domain: 'deviantart.com',
    },
    {
      key: 'discord',
      label: 'Discord Server',
      link: 'https://discord.me/:value',
      icon: 'discord',
      domain: 'discord.me',
    },
    {
      key: 'flickr',
      label: 'Flickr Profile',
      link: 'https://www.flickr.com/photos/:value/',
      icon: 'flickr',
      domain: 'flickr.com',
    },
    {
      key: 'flipboard',
      label: 'Flipboard Profile',
      link: 'https://www.flipboard.com/:value',
      icon: 'flipboard',
      domain: 'flipboard.com',
    },
    {
      key: 'gitlab',
      label: 'Gitlab Profile',
      link: 'https://www.gitlab.com/:value',
      icon: 'gitlab',
      domain: 'gitlab.com',
    },
    {
      key: 'gitter',
      label: 'Gitter Profile',
      link: 'https://gitter.im/:value',
      icon: 'gitter',
      domain: 'gitter.im',
    },
    {
      key: 'goodreads',
      label: 'Goodreads Profile',
      link: 'https://www.goodreads.com/user/show/:value',
      icon: 'goodreads',
      domain: 'goodreads.com',
    },
    {
      key: 'google_plus',
      label: 'Google Plus Profile',
      link: 'https://plus.google.com/:value',
      icon: 'google-plus',
      domain: 'google.com',
    },
    {
      key: 'mastodon',
      label: 'Mastodon Profile',
      link: 'https://mastodon.social/:value',
      icon: 'mastodon',
      domain: 'mastodon.social',
    },
    {
      key: 'medium',
      label: 'Medium Profile',
      link: 'https://medium.com/:value',
      icon: 'medium-m',
      domain: 'medium.com',
    },
    {
      key: 'patreon',
      label: 'Patreon Profile',
      link: 'https://www.patreon.com/:value',
      icon: 'patreon',
      domain: 'patreon.com',
    },
    {
      key: 'slack',
      label: 'Slack Channel',
      link: 'https://:value.slack.com',
      icon: 'slack',
      domain: 'slack.com',
    },
    {
      key: 'other',
      label: 'Other',
      link: '',
      icon: 'link',
      domain: ''
    }
  ];

  get footerLinks() {
    return this.channelService.currentChannel.pro_settings.footer_links;
  }

  get footerText() {
    return this.channelService.currentChannel.pro_settings.footer_text;
  }

  get footerSocialProfiles() {
    return this.channelService.currentChannel.social_profiles;
  }

  getSocialProfileURL(url: string) {
    if (url.includes('http://') || url.includes('https://')) {
      return url;
    } else {
      return 'http://' + url;
    }
  }

  getSocialProfileIconClass({ key = '' }) {
    let meta = this.getSocialProfileMeta(key),
      domClass;

    if (meta.customIcon) {
      domClass = `m-custom-icon m-custom-icon-${meta.icon}`;
    } else {
      domClass = `fa fa-fw fa-${meta.icon}`;
    }
    return domClass;
  }

  logout() {
    this.auth.logout();
  }

  private getSocialProfileMeta(key: string): SocialProfileMeta {
    let defaultMeta: SocialProfileMeta = {
      key: '', label: '',
      link: '#', icon: 'link', domain: ''
    };

    if (!key) {
      return defaultMeta;
    }

    for (let i in this.socialProfileMeta) {
      if (this.socialProfileMeta[i].key === key) {
        return this.socialProfileMeta[i];
      }
    }

    return defaultMeta;
  }

  get user() {
    return this.channelService.currentChannel;
  }

  get isOwner() {
    return this.session.getLoggedInUser() && this.session.getLoggedInUser().guid == this.user.guid;
  }

  get currentUser() {
    return this.session.getLoggedInUser();
  }

  get currentUsername() {
    return this.session.getLoggedInUser().username;
  }

  get viewProfileHref() {
    return window.Minds.site_url + this.session.getLoggedInUser().username;
  }

  get isStandalone() {
    return Boolean(window.Minds.pro);
  }
}