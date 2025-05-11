import qtail from "qtail-js";

document.title = `qtailw v${___VERSION___}`;
document.querySelector('#version')!.innerHTML = `&nbsp;v${___VERSION___}`;

document.querySelector('#qtail-version')!.innerHTML = `v${qtail.version.join('.')}`;

if(import.meta.env.DEV) {
	console.log('DEV MODE');
	document.querySelector('#version')!.innerHTML += `<span style="color: #ffff00;">&nbsp;DEV</span>`;
}