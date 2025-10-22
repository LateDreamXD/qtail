declare type QtailFormData = {
	nick: string,
	tail: string,
	compatible?: boolean,
}

export default {
	get: (): QtailFormData | null => JSON.parse(localStorage.getItem('lastForm') || 'null'),
	set: (form: QtailFormData) => localStorage.setItem('lastForm', JSON.stringify(form)),
	rm: () => localStorage.removeItem('lastForm'),
}
