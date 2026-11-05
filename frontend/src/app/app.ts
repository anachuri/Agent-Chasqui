import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslationService } from './core/i18n/translation.service';
import { Language } from './core/i18n/translations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  readonly i18n = inject(TranslationService);

  setLanguage(event: Event): void {
    this.i18n.setLanguage((event.target as HTMLSelectElement).value as Language);
  }
}
