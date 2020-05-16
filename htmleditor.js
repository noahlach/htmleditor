import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import 'tinymce/tinymce.js';
import 'tinymce/plugins/charmap/plugin.js';
import 'tinymce/plugins/code/plugin.js';
import 'tinymce/plugins/directionality/plugin.js';
import 'tinymce/plugins/fullscreen/plugin.js';
import 'tinymce/plugins/hr/plugin.js';
import 'tinymce/plugins/lists/plugin.js';
import 'tinymce/plugins/preview/plugin.js';
import 'tinymce/plugins/table/plugin.js';
import 'tinymce/themes/silver/theme.js';

class HtmlEditor extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			inline: { type: Boolean },
			noSpellchecker: { type: Boolean, attribute: 'no-spellchecker'},
			_editorId: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get resources() {
		return {
			'ar': { term1: 'Term 1' },
			'da': { term1: 'Term 1' },
			'de': { term1: 'Term 1' },
			'en': { term1: 'Term 1' },
			'es': { term1: 'Term 1' },
			'fr': { term1: 'Term 1' },
			'ja': { term1: 'Term 1' },
			'ko': { term1: 'Term 1' },
			'nl': { term1: 'Term 1' },
			'pt': { term1: 'Term 1' },
			'sv': { term1: 'Term 1' },
			'tr': { term1: 'Term 1' },
			'tr-tr': { term1: 'Term 1' },
			'zh': { term1: 'Term 1' },
			'zh-cn': { term1: 'Term 1' },
			'zh-tw': { term1: 'Term 1' }
		};
	}

	constructor() {
		super();
		this.inline = false;
		this.noSpellchecker = false;
		this._editorId = getUniqueId();
	}

	createRenderRoot() {
		return this;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {

			const textarea = this.shadowRoot
				? this.shadowRoot.querySelector(`#${this._editorId}`)
				: this.querySelector(`#${this._editorId}`);

			const locale = 'en-US';

			// TODO: figure out why we need to wait a frame before calling init
			// TODO: consider whether inline should be a separate component, general organization of features
			// TODO: review allow_script_urls (ideally we can turn this off)
			// TODO: resolve languages (maybe dynamic import)
			// TODO: review resize (monolith specifies both, but this would require enabling statusbar)
			// TODO: deal with fact that tinyMCE inline content styles conflict with prismjs styles
			// TODO: review auto-focus and whether it should be on the API
			// TODO: deal with unsafe
			// TODO: fullpage documents (and styles)
			// TODO: other plugins: d2l_image d2l_isf d2l_equation fullscreen d2l_link d2l_equation d2l_code d2l_preview smallscreen a11ycheck
			// TODO: get enterprise plugins a11ychecker(a11ycheck)
			// NOTE: text style menu: strikethrough superscript subscript
			// NOTE: insert menu: charmap hr d2l_attributes d2l_emoticons
			// NOTE: format menu: numlist indent outdent alignleft alignright aligncenter alignjustify ltr rtl
			// QUESTION: why to class-stream, assignment-editor, and rubric editor turn off object-resizing?
			// QUESTION: our character map and horizontal rule may be better, do we use tiny's?
			// QUESTION: do we want to expose our D2L typography classes in the format menu?
			// QUESTION: do we want style menu like default tiny, or simpler like what we've used previously?
			// QUESTION: stay with previously used font-size formats for backward compat?

			tinymce.init({
				a11ychecker_allow_decorative_images: true,
				allow_html_in_named_anchor: true,
				allow_script_urls: true,
				branding: false,
				browser_spellcheck: !this.noSpellchecker,
				convert_urls: false,
				content_css: '/skins/content/default/content.css',
				directionality: this.dir ? this.dir : 'ltr',
				extended_valid_elements: 'span[*]',
				fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
				inline: this.inline,
				language: locale !== 'en-US' ? locale : null,
				language_url: `/langs/${locale}.js`,
				menubar: false,
				object_resizing : true,
				plugins: 'charmap code directionality fullscreen hr lists preview table',
				relative_urls: false,
				skin_url: '/skins',
				statusbar: false,
				target: textarea,
				toolbar: this.inline
					? 'bold italic underline'
					: 'bold italic underline | strikethrough subscript superscript | bullist numlist | indent outdent | alignleft alignright aligncenter alignjustify | charmap hr | table | forecolor | styleselect fontselect fontsizeselect | undo redo | preview code fullscreen | ltr rtl',
				valid_elements: '*[*]'
			});

		});

	}

	focus() {
		tinymce.EditorManager.get(this._editorId).focus();
	}

	render() {
		if (!this._originalContent) {
			const template = this.querySelector('template');
			if (this.inline) {
				this._originalContent = document.importNode(template.content, true);
			} else {
				const temp = document.createElement('div');
				temp.appendChild(document.importNode(template.content, true));
				this._originalContent = temp.innerHTML;
			}
		}

		if (this.inline) {
			return html`<div id="${this._editorId}">${this._originalContent}</div>`;
		} else {
			return html`<textarea id="${this._editorId}">${this._originalContent}</textarea>`;
		}
	}
}
customElements.define('d2l-htmleditor', HtmlEditor);
