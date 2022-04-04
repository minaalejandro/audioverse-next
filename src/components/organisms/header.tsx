import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import useLanguageRoute from '@lib/useLanguageRoute';

import styles from './header.module.scss';

const Header = (): JSX.Element => {
	const languageRoute = useLanguageRoute();
	return (
		<header className={styles.header}>
			<h1>
				<Link href={`/${languageRoute}`}>
					<a className={styles.link}>
						<Image
							src="/img/logo.svg"
							alt="AudioVerse"
							width={161}
							height={23}
						/>
					</a>
				</Link>
			</h1>
		</header>
	);
};

export default Header;
