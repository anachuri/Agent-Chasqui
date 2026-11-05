import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  Language,
  TranslationKey,
  TRANSLATIONS,
} from './translations';

const STORAGE_KEY = 'chasqui.language';
const LOCALES: Record<Language, string> = {
  es: 'es-AR',
  en: 'en-US',
  pt: 'pt-BR',
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  readonly language = signal<Language>(this.readStoredLanguage());
  readonly locale = computed(() => LOCALES[this.language()]);

  private readonly pageTitleKey = signal<TranslationKey>('meta.title');

  constructor() {
    effect(() => {
      const language = this.language();
      const title = this.t(this.pageTitleKey());
      const description = this.t('meta.description');

      this.document.documentElement.lang = language;
      this.document.title = title;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', description);
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Storage can be unavailable (private mode, restricted contexts).
    }
  }

  setPageTitle(key: TranslationKey): void {
    this.pageTitleKey.set(key);
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    const value =
      TRANSLATIONS[this.language()][key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key;

    if (!params) return value;

    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  }

  private readStoredLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && this.isLanguage(stored)) return stored;
    } catch {
      // Ignore unavailable storage and fall back to the default language.
    }
    return DEFAULT_LANGUAGE;
  }

  private isLanguage(value: string): value is Language {
    return LANGUAGES.some((option) => option.code === value);
  }
}
