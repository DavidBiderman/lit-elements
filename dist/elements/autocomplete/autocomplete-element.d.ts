import { LitElement } from "lit";
declare class AutocompleteElement extends LitElement {
    readonly searchOptions: {
        limit: number;
        threshold: number;
        allowTypo: boolean;
    };
    readonly upDownKeys: number[];
    private data;
    results: Array<{
        value: string;
        markup: string;
    }>;
    selected: number;
    static get styles(): import("lit").CSSResult[];
    constructor();
    valueUpdated: (e: any) => void;
    itemSelected: (item: string) => void;
    moveSelected: (e: any) => void;
    clear: () => void;
    keyPressed: (e: any) => void;
    render: () => import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "auto-complete": AutocompleteElement;
    }
}
export {};
//# sourceMappingURL=autocomplete-element.d.ts.map