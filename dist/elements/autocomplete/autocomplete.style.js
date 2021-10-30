import { css } from "lit";
const autocompleteStyle = css `
#container {
    width: 35vw;
    padding: 1vw;
    margin: auto;
    background-color: #484848;
    color: #FFF;
}
label {
    margin-right: 5%;
}
#search-box {
    width: 60%;
    height: 2vw;
    font-size: 1em;
    padding-left: 1%;
    background-color: #383838;
    color: #FFF;
}
#search-box::placeholder {
    color: #FFF;
}
#results {
    width: 100%;
    max-height: 50vh;
    overflow: auto;
}
#result-items {
    list-style-type: none;
    padding: 0;
}
.result-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 1%;
}
.result-item.selected {
    background-color: #37175B;
}
.result-item .clipboard-image {
    height: 3vh;
    margin-right: 5%;
    filter: contrast(0) hue-rotate(50deg) sepia(100) brightness(1.2);
}
.result-item b {
    color: #72E703;
}
`;
export default autocompleteStyle;
//# sourceMappingURL=autocomplete.style.js.map