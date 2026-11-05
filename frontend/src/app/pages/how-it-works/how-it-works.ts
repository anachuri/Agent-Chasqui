import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink],
  templateUrl: './how-it-works.html',
})
export class HowItWorks {
  readonly i18n = inject(TranslationService);

  readonly agentWallet = environment.agentWallet;
  readonly agentTag = environment.agentTag;
  readonly chainId = environment.chainId;
  readonly explorerAddress = environment.explorerUrl;

  readonly shortWallet = `${environment.agentWallet.slice(0, 6)}…${environment.agentWallet.slice(-4)}`;

  constructor() {
    this.i18n.setPageTitle('how.metaTitle');
  }
}
