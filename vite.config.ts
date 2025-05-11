import {defineConfig} from 'vite';

export default defineConfig({
	base: './',
	define: {
		'___VERSION___': JSON.stringify(process.env.npm_package_version)
	}
});