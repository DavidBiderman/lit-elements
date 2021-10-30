
import { LitElement, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from "lit/directives/repeat.js";
import MockService from "../../services/mock-service";
import KEY_MAPPING from "../../utils/keymapper.utils"
import autocompleteStyle from './autocomplete.style';

declare const fuzzysort: any;

@customElement('auto-complete')
class AutocompleteElement extends LitElement {
    readonly searchOptions = {
        limit: 20,
        threshold: -4000,
        allowTypo: true
    };
    readonly upDownKeys = [KEY_MAPPING.UP_ARROW, KEY_MAPPING.DOWN_ARROW];    
    private data!: Array<string>;
    
    @property() results: Array<{value: string, markup: string}> = []; 
    @property() selected: number = -1;
  
    constructor() {
        super();
    }

    static override get styles() {
        return [autocompleteStyle];
    }
    
    // init
    override connectedCallback() {
        super.connectedCallback();
        this.data = MockService.getData();
        this.data.forEach((datum: string) => datum = fuzzysort.prepare(datum));
        document.querySelector('body')?.addEventListener('focusout', this.clear);
    }

    // cleanup
    override disconnectedCallback() {
        super.disconnectedCallback();
        document.querySelector('body')?.removeEventListener('focusout', this.clear);
    }
    
    valueUpdated = (e: any) => {
        if (e.target.value.length > 2) {
            const searchResults = fuzzysort.go(e.target.value, this.data, this.searchOptions);
            this.results = searchResults.map((result: any) => ({value: result.target, markup:fuzzysort.highlight(result)}));
        } else {
            this.results = [];
        }
    }

    itemSelected = (item: string) => {
        if (item) {
            console.log(item);
            this.clear();
        }
    }

    moveSelected = (e:any) => {
        if (e.which === KEY_MAPPING.DOWN_ARROW && this.selected < this.results.length - 1) {
            this.selected++; 
        } else if (e.which === KEY_MAPPING.UP_ARROW && this.selected > -1) {
            this.selected--;
        }
        if (this.selected > -1 && this.selected < this.results.length - 1) {
            const focusEl = (this.renderRoot.querySelectorAll('.result-item')[this.selected] as HTMLElement);
            focusEl.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
        }
    }

    clear = () => {
        this.results = [];
        (this.renderRoot.querySelector('#search-box') as HTMLInputElement).value = '';
        this.selected = -1;
    }

    keyPressed = (e: any) => {
        if (e.which === KEY_MAPPING.ESCAPE_KEY) {
            this.clear();
            return;
        } 
        if (this.upDownKeys.includes(e.which)) { 
            this.moveSelected(e);
            return;
        }
        if (e.which === KEY_MAPPING.ENTER_KEY && this.selected > -1) {
            this.itemSelected(this.results[this.selected].value);
            return;
        }
    }

    override render = () => {
        return html`
            <div id="container" tabindex="0" @keydown=${this.keyPressed}>
                <form autocomplete="off" @submit=${(e:any) => e.preventDefault()}>
                    <label for="search-box">Clipboard</label>
                    <input id="search-box" type="text" placeholder="Search..." @input=${this.valueUpdated}/>
                </form>
                <div id="results">
                    <ul id="result-items">
                        ${repeat(this.results, (result) => result, 
                            (result, index) => html`<li class="result-item ${this.selected === index ? 'selected' : ''}" @click=${() => this.itemSelected(result.value)}>
                                                <img class="clipboard-image" src="../assets/clipboard.svg"/>
                                                <p>${unsafeHTML(result.markup)}</p>
                                            </li>`)}
                    </ul>    
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "auto-complete": AutocompleteElement,
    }
}
