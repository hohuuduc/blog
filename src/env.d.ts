/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@analogjs/astro-angular/client" />

declare global {
  interface ImportMetaEnv {
    readonly ONLY_PAGE?: string;
    readonly URL_PAGE?: string;
    readonly PUBLIC_URL_PAGE?: string;
  }
}
export {};
