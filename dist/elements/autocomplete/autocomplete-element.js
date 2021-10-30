var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from "lit/directives/repeat.js";
import MockService from "../../services/mock-service";
import KEY_MAPPING from "../../utils/keymapper.utils";
import autocompleteStyle from './autocomplete.style';
let AutocompleteElement = class AutocompleteElement extends LitElement {
    constructor() {
        var _a;
        super();
        this.searchOptions = {
            limit: 20,
            threshold: -4000,
            allowTypo: true
        };
        this.upDownKeys = [KEY_MAPPING.UP_ARROW, KEY_MAPPING.DOWN_ARROW];
        this.results = [];
        this.selected = -1;
        this.valueUpdated = (e) => {
            if (e.target.value.length > 2) {
                const searchResults = fuzzysort.go(e.target.value, this.data, this.searchOptions);
                this.results = searchResults.map((result) => ({ value: result.target, markup: fuzzysort.highlight(result) }));
            }
            else {
                this.results = [];
            }
        };
        this.itemSelected = (item) => {
            if (item) {
                console.log(item);
                this.clear();
            }
        };
        this.moveSelected = (e) => {
            if (e.which === KEY_MAPPING.DOWN_ARROW && this.selected < this.results.length - 1) {
                this.selected++;
            }
            else if (e.which === KEY_MAPPING.UP_ARROW && this.selected > -1) {
                this.selected--;
            }
            if (this.selected > -1 && this.selected < this.results.length - 1) {
                const focusEl = this.renderRoot.querySelectorAll('.result-item')[this.selected];
                focusEl.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
            }
        };
        this.clear = () => {
            this.results = [];
            this.renderRoot.querySelector('#search-box').value = '';
            this.selected = -1;
        };
        this.keyPressed = (e) => {
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
        };
        this.render = () => {
            return html `
            <div id="container" tabindex="0" @keydown=${this.keyPressed}>
                <form autocomplete="off" @submit=${(e) => e.preventDefault()}>
                    <label for="search-box">Clipboard</label>
                    <input id="search-box" type="text" placeholder="Search..." @input=${this.valueUpdated}/>
                </form>
                <div id="results">
                    <ul id="result-items">
                        ${repeat(this.results, (result) => result, (result, index) => html `<li class="result-item ${this.selected === index ? 'selected' : ''}" @click=${() => this.itemSelected(result.value)}>
                                                <img class="clipboard-image" src="../assets/clipboard.svg"/>
                                                <p>${unsafeHTML(result.markup)}</p>
                                            </li>`)}
                    </ul>    
                </div>
            </div>
        `;
        };
        this.data = MockService.getData();
        this.data.forEach((datum) => fuzzysort.prepare(datum));
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.addEventListener('focusout', () => this.clear());
    }
    static get styles() {
        return [autocompleteStyle];
    }
};
__decorate([
    property()
], AutocompleteElement.prototype, "results", void 0);
__decorate([
    property()
], AutocompleteElement.prototype, "selected", void 0);
AutocompleteElement = __decorate([
    customElement('auto-complete')
], AutocompleteElement);
//# sourceMappingURL=autocomplete-element.js.map