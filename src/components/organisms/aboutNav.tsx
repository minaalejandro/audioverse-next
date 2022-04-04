import { useRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import Mininav from '@components/molecules/mininav';
import { getNavigationItems } from '@lib/getNavigationItems';
import useLanguageRoute from '@lib/useLanguageRoute';

import styles from './aboutNav.module.scss';

type Props = {
	current: string;
};

export default function AboutNav({ current }: Props): JSX.Element {
	const languageRoute = useLanguageRoute();
	const router = useRouter();
	const intl = useIntl();
	const item = getNavigationItems(router, intl, languageRoute).find(
		({ key }) => key === 'story'
	);
	return (
		<div className={styles.wrapper}>
			<Mininav
				items={(item?.children || []).map(({ label, href, key }) => ({
					id: label,
					label,
					url: href as string,
					isActive: current === key,
				}))}
			/>
		</div>
	);
}
