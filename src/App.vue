<script setup lang="ts">
import { onBeforeMount, ref, version as vue_version } from 'vue';
import Qtail from 'qtail-js';
import lastForm from './modules/lastForm';

const qtail = new Qtail();
const nick = ref<string>('');
const tail = ref<string>('');
const compatible = ref<boolean>(true);
const keepLastForm = ref<boolean>(JSON.parse(localStorage.getItem('keepLastForm') || 'false'));

const resultDefaultValue = '(｡-_-｡)Zzzz...';
const result = ref<string>(resultDefaultValue);

const debug_mode = ref<boolean>(import.meta.env.DEV);
const debug_info = {
	env: import.meta.env.DEV? 'dev': 'prod',
	host: location.hostname,
	version,
	theme: 'aero',
	libs: {
		'qtail-js': Qtail.version.join('.'),
		typescript: ts_version,
		vite: vite_version,
		vue: vue_version
	},
	// @ts-ignore
	platform: 'userAgentData' in navigator? navigator.userAgentData.platform: navigator.platform,
	// @ts-ignore
	isMobile: 'userAgentData' in navigator? navigator.userAgentData.mobile:
			  matchMedia('(max-width: 768px)').matches
}

const generate_qtail = () => {
	if(!nick.value || !tail.value) return;
	try {
		qtail.update(nick.value, tail.value, compatible.value);
		result.value = qtail.generate();
		if(keepLastForm.value)
			lastForm.set({ nick: nick.value, tail: tail.value, compatible: compatible.value });
	} catch (e: any) {
		console.error(`error during generation: ${e.message}`, e?.stack);
		result.value = `xwx 出错惹! 详细信息请查看控制台 ${e.message}`;
	}
}

const copy_qtail = async(target: HTMLButtonElement) => {
	if(!result.value || result.value === resultDefaultValue) return;
	try {
		await navigator.clipboard.writeText(result.value);
		target.textContent = '复制成功!';
		setTimeout(() => {
			target.textContent = '复制结果';
		}, 2000);
	} catch (e: any) {
		console.error(`error during copy: ${e.message}`, e?.stack);
		alert(`复制失败! 原因: ${e.message}\n详细信息请查看控制台`);
	}
}

const keepLFSW = () => {
	localStorage.setItem('keepLastForm', keepLastForm.value.toString());
}

const showHelpCenter = ref<boolean>(false);
const used_libs = [
	{ name: 'qtail-js', url: 'https://github.com/LateDreamXD/qtail-js', license: 'MPL-2.0' },
	{ name: 'Typescript', url: 'https://www.typescriptlang.org/', license: 'Apache-2.0' },
	{ name: 'Vue.js', url: 'https://vuejs.org/', license: 'MIT' },
	{ name: 'Vite', url: 'https://vitejs.dev/', license: 'MIT' }
];

const closeWindow = (id: string) => {
	document.getElementById(id)?.classList.add('onclose');
	setTimeout(() => {
		switch(id) {
			case 'help_center':
				showHelpCenter.value = false;
				break;
			default:
				break;
		}
	}, 200);
}

const help_center_click_times = ref(0);
const help_click_callback = () => {
	console.log('help_click_callback', showHelpCenter.value, help_center_click_times.value)
	if(help_center_click_times.value > 4) return;
	if(help_center_click_times.value === 4) {
		debug_mode.value = !0;
		help_center_click_times.value = 114514;
		return;
	}
	help_center_click_times.value++;
}

onBeforeMount(async() => {
	if(!!lastForm.get()) (keepLastForm.value = !0) && keepLFSW();
	if(keepLastForm.value) {
		const last = lastForm.get();
		if(last) {
			nick.value = last.nick;
			tail.value = last.tail;
			compatible.value = last.compatible || true;
			generate_qtail();
		}
	}
	(await import('./modules/browser-title-helper')).updateTitle(debug_info);
});
</script>

<template>
	<main class="aero">
		<span class="title_panel">
			<span class="title">
				<img class="icon" src="/favicon.png?url" alt="icon" @click.prevent="" />
				qtail v{{ debug_info.version }}
				<sup v-if="debug_mode" v-text="debug_info.env"></sup>
				<span v-if="!debug_info.isMobile"> - at {{ debug_info.host }}</span>
			</span>
			<span class="btns_panel">
				<button class="icon" title="帮助" @click.prevent="(showHelpCenter=!0)&&help_click_callback()">
					<!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 160c0-53 43-96 96-96s96 43 96 96c0 42.7-27.9 78.9-66.5 91.4-28.4 9.2-61.5 35.3-61.5 76.6l0 24c0 17.7 14.3 32 32 32s32-14.3 32-32l0-24c0-1.7 .6-4.1 3.5-7.3 3-3.3 7.9-6.5 13.7-8.4 64.3-20.7 110.8-81 110.8-152.3 0-88.4-71.6-160-160-160S0 71.6 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm96 352c22.1 0 40-17.9 40-40s-17.9-40-40-40-40 17.9-40 40 17.9 40 40 40z"/></svg>
				</button>
				<button class="icon" @click.prevent="" disabled>
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 8c-0.0684 0-0.133-0.013-0.195-0.0391-0.0586-0.026-0.111-0.0618-0.156-0.107-0.0456-0.0456-0.0814-0.0977-0.107-0.156-0.026-0.0618-0.0391-0.127-0.0391-0.195s0.013-0.132 0.0391-0.19c0.026-0.0618 0.0618-0.116 0.107-0.161 0.0456-0.0488 0.0977-0.0863 0.156-0.112 0.0618-0.026 0.127-0.0391 0.195-0.0391h9c0.0683 0 0.132 0.013 0.19 0.0391 0.0618 0.026 0.116 0.0635 0.161 0.112 0.0456 0.0456 0.0814 0.0993 0.107 0.161 0.0261 0.0586 0.0391 0.122 0.0391 0.19s-0.013 0.133-0.0391 0.195c-0.026 0.0586-0.0618 0.111-0.107 0.156-0.0456 0.0456-0.0993 0.0814-0.161 0.107-0.0586 0.026-0.122 0.0391-0.19 0.0391h-9z"/></svg>
				</button>
				<button class="icon" @click.prevent="" disabled>
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m9.8 4h-3.6c-0.577 0-0.949 7.8e-4 -1.23 0.0239-0.272 0.0222-0.372 0.0599-0.422 0.0851-0.188 0.0959-0.341 0.249-0.437 0.437-0.0252 0.0494-0.0629 0.15-0.0851 0.422-0.0232 0.283-0.0239 0.656-0.0239 1.23v3.6c0 0.577 7.8e-4 0.949 0.0239 1.23 0.0222 0.272 0.0599 0.372 0.0851 0.422 0.0959 0.188 0.249 0.341 0.437 0.437 0.0494 0.0252 0.15 0.0629 0.422 0.0851 0.283 0.0231 0.656 0.0239 1.23 0.0239h3.6c0.577 0 0.949-8e-4 1.23-0.0239 0.272-0.0222 0.372-0.0599 0.422-0.0851 0.188-0.0959 0.341-0.249 0.437-0.437 0.0252-0.0495 0.0629-0.15 0.0851-0.422 0.0231-0.283 0.0239-0.656 0.0239-1.23v-3.6c0-0.577-8e-4 -0.949-0.0239-1.23-0.0222-0.272-0.0599-0.372-0.0851-0.422-0.0959-0.188-0.249-0.341-0.437-0.437-0.0495-0.0252-0.15-0.0629-0.422-0.0851-0.283-0.0232-0.656-0.0239-1.23-0.0239zm-6.58 0.092c-0.218 0.428-0.218 0.988-0.218 2.11v3.6c0 1.12 0 1.68 0.218 2.11 0.192 0.376 0.498 0.682 0.874 0.874 0.428 0.218 0.988 0.218 2.11 0.218h3.6c1.12 0 1.68 0 2.11-0.218 0.376-0.192 0.682-0.498 0.874-0.874 0.218-0.428 0.218-0.988 0.218-2.11v-3.6c0-1.12 0-1.68-0.218-2.11-0.192-0.376-0.498-0.682-0.874-0.874-0.428-0.218-0.988-0.218-2.11-0.218h-3.6c-1.12 0-1.68 0-2.11 0.218-0.376 0.192-0.682 0.498-0.874 0.874z" clip-rule="evenodd" fill-rule="evenodd"/></svg>
				</button>
				<button class="icon" @click.prevent="" disabled>
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m8 8.71-4.15 4.15c-0.0976 0.0977-0.215 0.146-0.352 0.146-0.143 0-0.264-0.0472-0.361-0.142-0.0944-0.0977-0.142-0.218-0.142-0.361 0-0.137 0.0488-0.254 0.146-0.352l4.15-4.15-4.15-4.15c-0.0976-0.0976-0.146-0.216-0.146-0.356 0-0.0684 0.013-0.133 0.0391-0.195 0.026-0.0618 0.0618-0.114 0.107-0.156 0.0456-0.0456 0.0993-0.0814 0.161-0.107s0.127-0.0391 0.195-0.0391c0.137 0 0.254 0.0488 0.352 0.146l4.15 4.15 4.15-4.15c0.0977-0.0976 0.216-0.146 0.356-0.146 0.0683 0 0.132 0.013 0.19 0.0391 0.0618 0.026 0.116 0.0618 0.161 0.107 0.0456 0.0456 0.0814 0.0993 0.107 0.161 0.0261 0.0586 0.0391 0.122 0.0391 0.19 0 0.14-0.0488 0.259-0.146 0.356l-4.15 4.15 4.15 4.15c0.0977 0.0977 0.146 0.215 0.146 0.352 0 0.0683-0.013 0.133-0.0391 0.195-0.026 0.0618-0.0618 0.116-0.107 0.161-0.0423 0.0456-0.0944 0.0814-0.156 0.107-0.0619 0.0261-0.127 0.0391-0.195 0.0391-0.14 0-0.259-0.0488-0.356-0.146l-4.15-4.15z"/></svg>
				</button>
			</span>
		</span>

		<div class="work_space">
			<div class="from_panel">
				<span class="input_panel">
					<label for="nick">昵称</label>
					<input id="nick" name="nick" type="text" v-model="nick" placeholder="晚梦"
						required @input="generate_qtail" />
				</span>
				<span class="input_panel">
					<label for="tail">尾巴</label>
					<input id="tail" name="tail" type="text" v-model="tail" placeholder="喵~"
						required @input="generate_qtail" />
				</span>
				<span class="input_panel">
					<label for="result">结果</label>
					<input id="result" name="result" type="text" v-model="result" readonly />
				</span>
			</div>

			<span class="options_panel">
				<span>
					<label for="compatible">兼容模式<span class="tooltip">新版本 QQ 已经和谐了旧的反转符号，你需要打开它才能保证尾巴能正确反转</span></label>
					<input type="checkbox" role="switch" id="compatible" v-model="compatible" @change="generate_qtail" />
				</span>
				<span><label for="keep_last_form">保存上次内容</label><input type="checkbox" role="switch" id="keep_last_form" v-model="keepLastForm" @change="keepLFSW" /></span>
				<span><button v-if="false" class="normal" @click.prevent="">试试手气?</button>
				<button class="normal" style="--bgc: rgb(var(--primary-color)); --hbgc: rgba(var(--primary-color), 0.8);--tc: #ffe;" @click.prevent="copy_qtail($event.target as HTMLButtonElement)">复制结果</button></span>
			</span>

			<button v-if="!1" class="icon" @click.prevent="(showHelpCenter=!0)&&help_click_callback()" title="开放源代码" style="position: absolute;left: 0;bottom: 0;">
				<svg width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 11c-0.552 0-1 0.448-1 1v5c0 0.552 0.448 1 1 1s1-0.448 1-1v-5c0-0.552-0.448-1-1-1z"/><path d="m13.2 7c0 0.69-0.56 1.25-1.25 1.25s-1.25-0.56-1.25-1.25 0.56-1.25 1.25-1.25 1.25 0.56 1.25 1.25z" /><path d="m24 12c0 6.63-5.37 12-12 12-6.63 0-12-5.37-12-12 0-6.63 5.37-12 12-12 6.63 0 12 5.37 12 12zm-1 0c0 6.08-4.92 11-11 11-6.08 0-11-4.92-11-11 0-6.08 4.92-11 11-11 6.08 0 11 4.92 11 11z" clip-rule="evenodd" fill-rule="evenodd"/></svg>
			</button>
		</div>
	</main>

	<div v-if="showHelpCenter" id="help_center" class="aero" style="">
		<span class="title_panel">
			<span class="title">
				帮助中心 - qtail
			</span>
			<span class="btns_panel">
				<button class="icon" @click.prevent="" disabled>
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 8c-0.0684 0-0.133-0.013-0.195-0.0391-0.0586-0.026-0.111-0.0618-0.156-0.107-0.0456-0.0456-0.0814-0.0977-0.107-0.156-0.026-0.0618-0.0391-0.127-0.0391-0.195s0.013-0.132 0.0391-0.19c0.026-0.0618 0.0618-0.116 0.107-0.161 0.0456-0.0488 0.0977-0.0863 0.156-0.112 0.0618-0.026 0.127-0.0391 0.195-0.0391h9c0.0683 0 0.132 0.013 0.19 0.0391 0.0618 0.026 0.116 0.0635 0.161 0.112 0.0456 0.0456 0.0814 0.0993 0.107 0.161 0.0261 0.0586 0.0391 0.122 0.0391 0.19s-0.013 0.133-0.0391 0.195c-0.026 0.0586-0.0618 0.111-0.107 0.156-0.0456 0.0456-0.0993 0.0814-0.161 0.107-0.0586 0.026-0.122 0.0391-0.19 0.0391h-9z"/></svg>
				</button>
				<button class="icon" @click.prevent="" disabled>
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m9.8 4h-3.6c-0.577 0-0.949 7.8e-4 -1.23 0.0239-0.272 0.0222-0.372 0.0599-0.422 0.0851-0.188 0.0959-0.341 0.249-0.437 0.437-0.0252 0.0494-0.0629 0.15-0.0851 0.422-0.0232 0.283-0.0239 0.656-0.0239 1.23v3.6c0 0.577 7.8e-4 0.949 0.0239 1.23 0.0222 0.272 0.0599 0.372 0.0851 0.422 0.0959 0.188 0.249 0.341 0.437 0.437 0.0494 0.0252 0.15 0.0629 0.422 0.0851 0.283 0.0231 0.656 0.0239 1.23 0.0239h3.6c0.577 0 0.949-8e-4 1.23-0.0239 0.272-0.0222 0.372-0.0599 0.422-0.0851 0.188-0.0959 0.341-0.249 0.437-0.437 0.0252-0.0495 0.0629-0.15 0.0851-0.422 0.0231-0.283 0.0239-0.656 0.0239-1.23v-3.6c0-0.577-8e-4 -0.949-0.0239-1.23-0.0222-0.272-0.0599-0.372-0.0851-0.422-0.0959-0.188-0.249-0.341-0.437-0.437-0.0495-0.0252-0.15-0.0629-0.422-0.0851-0.283-0.0232-0.656-0.0239-1.23-0.0239zm-6.58 0.092c-0.218 0.428-0.218 0.988-0.218 2.11v3.6c0 1.12 0 1.68 0.218 2.11 0.192 0.376 0.498 0.682 0.874 0.874 0.428 0.218 0.988 0.218 2.11 0.218h3.6c1.12 0 1.68 0 2.11-0.218 0.376-0.192 0.682-0.498 0.874-0.874 0.218-0.428 0.218-0.988 0.218-2.11v-3.6c0-1.12 0-1.68-0.218-2.11-0.192-0.376-0.498-0.682-0.874-0.874-0.428-0.218-0.988-0.218-2.11-0.218h-3.6c-1.12 0-1.68 0-2.11 0.218-0.376 0.192-0.682 0.498-0.874 0.874z" clip-rule="evenodd" fill-rule="evenodd"/></svg>
				</button>
				<button class="icon close" @click.prevent="closeWindow('help_center')" title="Close">
					<svg class="icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m8 8.71-4.15 4.15c-0.0976 0.0977-0.215 0.146-0.352 0.146-0.143 0-0.264-0.0472-0.361-0.142-0.0944-0.0977-0.142-0.218-0.142-0.361 0-0.137 0.0488-0.254 0.146-0.352l4.15-4.15-4.15-4.15c-0.0976-0.0976-0.146-0.216-0.146-0.356 0-0.0684 0.013-0.133 0.0391-0.195 0.026-0.0618 0.0618-0.114 0.107-0.156 0.0456-0.0456 0.0993-0.0814 0.161-0.107s0.127-0.0391 0.195-0.0391c0.137 0 0.254 0.0488 0.352 0.146l4.15 4.15 4.15-4.15c0.0977-0.0976 0.216-0.146 0.356-0.146 0.0683 0 0.132 0.013 0.19 0.0391 0.0618 0.026 0.116 0.0618 0.161 0.107 0.0456 0.0456 0.0814 0.0993 0.107 0.161 0.0261 0.0586 0.0391 0.122 0.0391 0.19 0 0.14-0.0488 0.259-0.146 0.356l-4.15 4.15 4.15 4.15c0.0977 0.0977 0.146 0.215 0.146 0.352 0 0.0683-0.013 0.133-0.0391 0.195-0.026 0.0618-0.0618 0.116-0.107 0.161-0.0423 0.0456-0.0944 0.0814-0.156 0.107-0.0619 0.0261-0.127 0.0391-0.195 0.0391-0.14 0-0.259-0.0488-0.356-0.146l-4.15-4.15z"/></svg>
				</button>
			</span>
		</span>

		<div class="work_space" style="height: 420px; overflow-y: auto;">
			<img src="https://about.latedream.cn/avatar" style="position: fixed;opacity: 0.2;width: auto;height: inherit;object-fit: fill;margin: -0.25rem;filter: blur(4px);pointer-events: none;" />

			<p>如何使用 qtail？</p>
			<ol>
				<li>在输入框中输入你的昵称和尾巴</li>
				<li>点击生成按钮，即可生成新的昵称</li>
				<li>复制后设置为你的 QQ 昵称或者群昵称即可</li>
			</ol>

			<p>* 兼容模式说明：新版本 QQ 已经和谐了旧的反转符号，你需要打开它才能保证尾巴能正确反转</p>

			<hr />

			<p>qtail 使用了这些库:</p>
			<ul style="">
				<li v-for="lib in used_libs">
					{{ lib.name }}: {{ lib.license }} 许可证 - <a :href="lib.url">主页</a>
				</li>
			</ul><br />
			<p>qtail 以 MPL-2.0 许可开源, <a href="https://github.com/LateDreamXD/qtail">查看源代码</a></p>
			<br />
		</div>
	</div>

	<div v-if="debug_mode" class="debug_info">
		<details style="width: fit-content;">
			<summary>debug info</summary>
			<pre v-text="JSON.stringify(debug_info, null, 2)"></pre>
		</details>
	</div>

	<footer style="text-align: right; margin-top: 1.25em;">
		<span style="display: block;">
			&copy; 2024 <a href="https://about.latedream.cn/" target="_blank" rel="noopener noreferrer">
			晚梦</a> 版权所有
		</span>
		<span style="display: block;">本站与腾讯公司或 QQ 团队没有从属关系</span>
		<a v-if="false" href="https://github.com/LateDreamXD/qtail"
			target="_blank" rel="noopener noreferrer">View on GitHub</a>
	</footer>
</template>

<style lang="scss">
/** 已经燃尽了 -- @LateDreamXD 2025/09/27 */

@keyframes windowOpen {
	from {
		bottom: -100%;
		transform: scaleX(0.2);
	}
	to {
		bottom: 30%;
		transform: scaleX(1);
	}
}
@keyframes windowClose {
	from {
		bottom: 30%;
		opacity: 1;
		transform: scaleX(1) scaleY(1);
	}
	to {
		bottom: 30%;
		opacity: 0;
		transform: scaleX(0) scaleY(0);
	}
}
@media screen and (max-width: 800px) {
	@keyframes windowOpen {
		from {
			bottom: -100%;
			transform: scaleX(0.2);
		}
		to {
			bottom: 10%;
			transform: scaleX(1);
		}
	}
}
:root {
	color-scheme: light;
	interpolate-size: allow-keywords;
	transition: var(--background-color) 0.5s ease;

	--border-radius: 6px;
	--blur-radius: 24px;
	--border-color: rgba(255, 255, 255, 0.18);

	--primary-color: 239, 130, 190;
	--text-color: 0, 0, 0;
	--background-color: 255, 255, 255;
	--shadow-color: 142, 142, 142;
	@media (prefers-color-scheme: dark) {
		color-scheme: dark;
		background: linear-gradient(164deg, #4e082e 0%, #ff0095 40%, #030349 100%);

		--text-color: 185, 185, 185;
		--background-color: 22, 23, 23;
		--shadow-color: 14, 14, 14;
	}
}
::selection {
	background-color: rgba(255, 255, 0, 0.4);
}
*:has(>.tooltip) {
	position: relative;
	cursor: help;
	&::before {
		display: block;
		content: '';
		position: absolute;
		border-bottom: 1px dashed currentColor;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
	}
	.tooltip {
		pointer-events: none;
		position: absolute;
		min-width: 250px;
		max-width: max-content;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.25em 0.5em;
		border: 1px solid rgba(var(--text-color), 0.8);
		border-radius: var(--border-radius);
		background-color: rgba(var(--background-color), 0.8);
		backdrop-filter: blur(var(--blur-radius));
		color: rgb(var(--text-color));
		font-size: 0.8em;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	&:hover .tooltip, &:focus .tooltip {
		opacity: 1;
	}
}
body {
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(164deg, #ff7ec5 0%, #9b9b9b 40%, #0b0bff 100%);
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	@media (prefers-color-scheme: dark) {
		background: linear-gradient(164deg, #4e082e 0%, #ff0095 40%, #030349 100%);
	}
}
a {
	color: rgb(var(--primary-color));
	text-decoration: none;
	position: relative;
	&::before {
		display: block;
		content: '';
		position: absolute;
		background-color: currentColor;
		left: 0;
		bottom: 0;
		width: 0;
		height: 1px;
		transition: width 0.2s ease-in-out;
	}
	&:hover {
		color: rgba(var(--primary-color), 0.8);
		&::before {
			width: 100%;
		}
	}
}
code {
	font-family: 'Cascadia Code', 'Fira Code', 'Lucida Console', Consolas, 黑体, monospace;
	background-color: #000;
	border-radius: var(--border-radius);
	padding: 0.2em 0.4em;
}
hr {
	margin: 1.25em auto !important;
}
footer {
	position: fixed;
	right: 0.25em;
	bottom: 0.25em;
	opacity: 0.4;
}

// window
.aero {
	border-radius: var(--border-radius);
	backdrop-filter: blur(var(--blur-radius));
	color: rgba(var(--text-color), 0.8);
	background-color: rgba(var(--background-color), 0.15);
	border: 1px solid var(--border-color);
	box-shadow: rgba(var(--shadow-color), 0.19) 0px 6px 15px 0px;

	position: fixed;
	// top: 10%;
	left: calc(100% - 30% - 450px);
	width: 450px;
	height: auto;

	animation: windowOpen 0.2s ease-in-out forwards;
	&.onclose {
		animation: windowClose 0.2s ease-in-out forwards;
	}
}
.title_panel {
	padding: 0.45em 0.25em;
	display: flex;
	justify-content: space-between;
	user-select: none;
	.title {
		color: #eee;
	}
}
.work_space {
	position: relative;
	padding: 0.25em;
	width: calc(100% - 1rem);
	margin: auto;
	margin-bottom: 0.25em;
	border: 1px solid var(--border-color);
	color: rgb(var(--text-color));
	background-color: rgb(var(--background-color));

	>* {
		display: block;
		width: 80%;
		margin: 0.5em auto;
	}
}
.icon {
	width: 1rem;
	height: 1rem;
	fill: currentColor;
	user-select: none;
	-webkit-user-drag: none;
}
button.icon {
	color: rgb(var(--text-color));
	width: auto;
	height: auto;
	border: 0;
	cursor: pointer;
	background: none;
	&[disabled] {
		opacity: 0.4 !important;
		cursor: not-allowed;
	}
	&:hover {
		opacity: 0.8;
	}
	&.close:hover {
		opacity: 1;
		color: #fff;
		background-color: #f00;
	}
}
.options_panel {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	align-content: flex-end;
	align-items: flex-end;
	justify-content: space-around;
	min-height: 120px;
}
.debug_info {
	width: fit-content;
	position: fixed;
	top: 0.25em;
	right: 0.25em;
	padding: 0.25em;
	color: rgb(var(--text-color));
	background-color: rgba(var(--background-color), 0.18);
	backdrop-filter: blur(var(--blur-radius));
	border-radius: var(--border-radius);
	transition: height 0.4s ease-in-out;
	summary {
		cursor: pointer;
		user-select: none;
		outline: none;
	}
	pre {
		margin: 0;
		padding: 4px;
		font-size: 14px;
		font-family: 'Cascadia Code', 'Fira Code', 'Lucida Console', Consolas, monospace;
		background-color: #000;
		color: #fffa;
	}
}

// form
.input_panel {
	width: 100%;
	margin: 0.5em 0;
	display: flex;
	>* {
		padding: 0.5em;
		font-size: 1rem;
	}
	>label {
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		color: rgb(var(--background-color));
		background-color: rgb(var(--text-color));
		text-align: center;
		width: 15%;
	}
	>input {
		border: 1px solid rgb(var(--text-color));
		border-left-width: 0;
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		outline: none;
		width: 85%;
		color: rgb(var(--text-color));
		background-color: transparent;
		&:required, &[required] {
			border-color: rgba(var(--primary-color), 0.6);
		}
	}
}

input[type="checkbox"][role="switch"] {
	appearance: none;
	margin: 0;
	margin-inline-start: 0.25em;
	margin-inline-end: 0.25em;
	width: 2.5em;
	height: 1.25em;
	border: 1px solid rgba(var(--text-color), 0.8);
	border-radius: 1.25em;
	position: relative;
	vertical-align: middle;
	cursor: pointer;
	background-color: rgba(var(--primary-color), 0.4);
	transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
	&::before {
		position: absolute;
		display: block;
		content: '';
		aspect-ratio: 1;
		height: 100%;
		border-radius: 50%;
		background-color: rgb(var(--text-color));
		box-shadow: 0 3px 8px rgba(var(--text-color), 0.4);
		font-size: 100%;
		transition: margin 0.1s ease-in-out, background-color 0.2s ease-in-out;
	}
	&::after {
		position: absolute;
		color: #fff;
		content: 'O';
		display: block;
		left: 50%;
		transition: left 0.1s ease-in-out;
	}
	&:checked {
		background-color: rgba(var(--primary-color), 0.6);
		&::before {
			background-color: rgb(var(--primary-color));
			margin-inline-start: calc(2.5em - 1.25em);
			box-shadow: 0 3px 8px rgba(0, 255, 0, 0.4);
		}
		&::after {
			color: #0f0;
			content: 'I';
			left: 25%;
		}
	}
	&:focus, &:hover {
		outline: none;
		border-color: rgba(var(--primary-color), 0.8);
	}
}

button.normal, a[role="button"] {
	--tc: #000;
	--bgc: rgb(var(--text-color));
	--hbgc: rgb(var(--text-color));
	display: inline-block;
	margin: 0.5em 0 0.5em 0.5em;
	padding: 0.25em;
	font-size: 1rem;
	background-color: var(--bgc);
	border: 4px solid transparent;
	border-radius: var(--border-radius);
	outline: none;
	color: var(--tc);
	cursor: pointer;
	transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
	&:hover {
		background-color: var(--hbgc);
		border-color: rgba(var(--primary-color), 0.4);
	}
}

// mobile
@media screen and (max-width: 768px) {
	body {
		overflow: hidden;
	}
	.aero {
		bottom: 50% !important;
		left: calc(100% - 90%);
		width: 80%;
		* {
			font-size: 0.8rem;
		}
	}
}
</style>
