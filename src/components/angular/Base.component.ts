import { Directive, Input, type OnChanges, type SimpleChanges } from "@angular/core";
import { strings, type Languages, type Strings } from "@utils/lang";

@Directive()
class BaseComponent implements OnChanges {
    @Input() lang: Languages = 'vi';

    protected getString = (key: Strings): string => "";

    ngOnChanges(changes: SimpleChanges): void {
        const lang = changes['lang'].currentValue as Languages;
        this.getString = (key: Strings) => strings[lang][key];
    }
}

export default BaseComponent;