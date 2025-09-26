import { version as vite_version, type UserConfig } from 'vite';
import { version as ts_version } from 'typescript';
import vue from '@vitejs/plugin-vue';

export default <UserConfig>{
	base: './',
	define: {
		'version': JSON.stringify(process.env.npm_package_version),
		'vite_version': JSON.stringify(vite_version),
		'ts_version': JSON.stringify(ts_version)
	},
	plugins: [vue()],
	build: {
		modulePreload: { polyfill: true },
		rollupOptions: {
			output: {
				manualChunks: {
					'vue': ['vue']
				}
			}
		}
	}
};
