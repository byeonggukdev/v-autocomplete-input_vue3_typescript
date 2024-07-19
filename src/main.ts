import { defineCustomElement } from "vue"
import VAutocompleteInput from "./components/VAutocompleteInput.ce.vue"

const VAutocompleteInputComponent = defineCustomElement(VAutocompleteInput)
customElements.define("v-autocomplete-input", VAutocompleteInputComponent)
