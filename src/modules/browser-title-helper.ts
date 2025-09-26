export const updateTitle = (info: {
	version: string; env: string; host: string;
}) => document.title = `qtail v${info.version}^${info.env} - at ${info.host}`;
