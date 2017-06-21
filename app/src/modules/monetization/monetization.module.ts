import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { WalletModule } from '../wallet/wallet.module';
import { MonetizationOverviewModule } from './monetization.overview.module';
import { WalletPointsTransactionsComponent } from '../wallet/transactions/points.component';
import { MonetizationMarketingComponent } from './marketing.component';
import { MonetizationOnboardingComponent } from './onboarding/onboarding.component';
import { AffiliateMarketingComponent } from './affiliate/marketing.component';
import { AffiliateTermsComponent } from './affiliate/terms.component';
import { RevenueConsoleComponent } from './revenue/console.component';
import { RevenueGraphComponent } from './revenue/graph.component';
import { RevenueLedgerComponent } from './revenue/ledger.component';
import { RevenueOptionsComponent } from './revenue/options.component';


const monetizationRoutes : Routes = [
  { path: 'affiliates',  component: AffiliateMarketingComponent },
  { path: 'monetization', component: MonetizationMarketingComponent },
  { path: 'wallet/revenue', component: RevenueConsoleComponent,
    children: [
      { path: '', redirectTo: 'earnings', pathMatch: 'full' },
      { path: 'points', component: WalletPointsTransactionsComponent },
      { path: 'earnings', component: RevenueLedgerComponent },
      { path: 'payouts', component: RevenueLedgerComponent },
      { path: 'options', component: RevenueOptionsComponent }
    ]
  }
]

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    WalletModule,
    MonetizationOverviewModule,
    RouterModule.forChild(monetizationRoutes)
  ],
  declarations: [
    MonetizationMarketingComponent,
    MonetizationOnboardingComponent,
    AffiliateMarketingComponent,
    AffiliateTermsComponent,
    RevenueConsoleComponent,
    RevenueGraphComponent,
    RevenueLedgerComponent,
    RevenueOptionsComponent
  ],
  exports: [
    MonetizationMarketingComponent,
    MonetizationOnboardingComponent,
    AffiliateMarketingComponent,
    AffiliateTermsComponent,
    RevenueConsoleComponent,
    RevenueGraphComponent,
    RevenueLedgerComponent,
    RevenueOptionsComponent,
    RouterModule
  ],
  entryComponents: [ MonetizationMarketingComponent, AffiliateMarketingComponent, RevenueConsoleComponent ]
})

export class MonetizationModule {}
