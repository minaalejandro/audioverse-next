import findKey from 'lodash/findKey';

import { LANGUAGES } from './constants';
import { Language } from './generated/graphql';

export function getValidLanguage(language: string | undefined): Language {
	const langKey = findKey(
		LANGUAGES,
		(l) => l.base_url === language
	) as Language;

	if (!langKey) throw Error('Missing or invalid language');

	return langKey;
}
