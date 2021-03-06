import Link from 'next/link';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading2 from '@components/atoms/heading2';
import Heading6 from '@components/atoms/heading6';
import { IBibleVersion } from '@lib/api/bibleBrain';
import { makeBibleVersionRoute } from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

import BibleVersionTypeLockup from '../bibleVersionTypeLockup';

import CardBibleBook from './bibleBook';
import styles from './bibleVersion.module.scss';

import Card from '.';

interface Props {
	version: IBibleVersion;
}

export default function CardBibleVersion({ version }: Props): JSX.Element {
	const languageRoute = useLanguageRoute();
	const { id, title, books } = version;

	return (
		<Card>
			<Link href={makeBibleVersionRoute(languageRoute, id)}>
				<a className={styles.column}>
					<BibleVersionTypeLockup />
					<Heading2 className={styles.title}>{title}</Heading2>
					<Heading6 sans uppercase loose className={styles.booksLabel}>
						<FormattedMessage
							id="cardBibleVersion__booksLabel"
							defaultMessage="66 Books"
						/>
					</Heading6>
					{books.slice(0, 2).map((book) => (
						<div className={styles.book} key={book.book_id}>
							<CardBibleBook book={book} isOptionalLink />
						</div>
					))}
					<Heading6
						large
						loose
						sans
						unpadded
						uppercase
						className={styles.showAll}
					>
						<FormattedMessage
							id="cardBibleVersion__showAll"
							defaultMessage="Show All"
						/>
					</Heading6>
				</a>
			</Link>
		</Card>
	);
}
