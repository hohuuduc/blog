import { Directive, Input, type OnChanges, type SimpleChanges } from '@angular/core';
import { strings, type Languages, type Strings } from '@utils/lang';

@Directive()
class BaseComponent implements OnChanges {
  @Input() lang: Languages = 'vi';

  protected getString: (key: Strings) => string = (key: Strings) => strings[this.lang][key] ?? key;

  ngOnChanges(changes: SimpleChanges): void {
    if (!('lang' in changes)) {
      return;
    }

    const nextLang = changes['lang'].currentValue as Languages;
    if (!nextLang || !strings[nextLang]) {
      return;
    }

    this.getString = (key: Strings) => strings[nextLang][key] ?? key;
  }
}

export default BaseComponent;
