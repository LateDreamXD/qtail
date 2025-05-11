import qtail from "qtail-js";

// input
const nickInput = document.querySelector('#nick') as HTMLInputElement;
const tailInput = document.querySelector('#tail') as HTMLInputElement;

function updateResult(nick: string = nickInput.value, tail: string = tailInput.value) {
	const Qtail = new qtail(nick, tail, true);
	const result = Qtail.generate();
	(document.querySelector('#result') as HTMLInputElement).value = result;
}

function initListeners() {

	nickInput?.addEventListener('change', () => updateResult());
	tailInput?.addEventListener('change', () => updateResult());

	const copyBtn = document.querySelector('#copy-btn');

	copyBtn?.addEventListener('click', async function(e) {
		e.preventDefault();
		await navigator.clipboard.writeText((document.querySelector('#result') as HTMLInputElement).value);
		copyBtn.innerHTML = '<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m13.7 4.19c0.31 0.274 0.339 0.748 0.0649 1.06l-5.75 6.5c-0.134 0.152-0.324 0.243-0.526 0.252-0.202 0.0096-0.4-0.0628-0.548-0.201l-3.75-3.5c-0.303-0.283-0.319-0.757-0.0366-1.06 0.283-0.303 0.757-0.319 1.06-0.0366l3.19 2.97 5.24-5.92c0.274-0.31 0.748-0.339 1.06-0.0648z" clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"/></svg>';
		copyBtn?.classList.toggle('success');
		setTimeout(() => {
			copyBtn.innerHTML = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m7.5 3c-1.38 0-2.5 1.12-2.5 2.5v8c0 1.38 1.12 2.5 2.5 2.5h6c1.38 0 2.5-1.12 2.5-2.5v-8c0-1.38-1.12-2.5-2.5-2.5h-6zm-1.5 2.5c0-0.828 0.672-1.5 1.5-1.5h6c0.828 0 1.5 0.672 1.5 1.5v8c0 0.828-0.672 1.5-1.5 1.5h-6c-0.828 0-1.5-0.672-1.5-1.5v-8z" clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"/><path d="m8 6.5c0-0.276 0.224-0.5 0.5-0.5h4c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-4c-0.276 0-0.5-0.224-0.5-0.5z" fill="currentColor"/><path d="m8 9.5c0-0.276 0.224-0.5 0.5-0.5h4c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-4c-0.276 0-0.5-0.224-0.5-0.5z" fill="currentColor"/><path d="m8 12.5c0-0.276 0.224-0.5 0.5-0.5h3c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-3c-0.276 0-0.5-0.224-0.5-0.5z" fill="currentColor"/><path d="m0 2.5c0-1.38 1.12-2.5 2.5-2.5h6c0.979 0 1.83 0.562 2.24 1.38 0.152 0.303-0.104 0.618-0.443 0.618-0.227 0-0.422-0.149-0.549-0.338-0.269-0.399-0.726-0.662-1.24-0.662h-6c-0.828 0-1.5 0.672-1.5 1.5v8c0 0.828 0.672 1.5 1.5 1.5h1c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-1c-1.38 0-2.5-1.12-2.5-2.5v-8z" fill="currentColor"/></svg>';
			copyBtn?.classList.toggle('success');
		}, 2500);
	});
}

initListeners();