import startCase from 'lodash/startCase';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

import { IBaseProps } from '@containers/base';
import SongBookDetail, {
	SongBooksDetailProps,
} from '@containers/song/books/detail';
import { BIBLE_BOOKS, REVALIDATE } from '@lib/constants';
import { getSongBooksDetailPageData } from '@lib/generated/graphql';
import getIntl from '@lib/getIntl';
import { getLanguageIdByRoute } from '@lib/getLanguageIdByRoute';
import { getLanguageRoutes } from '@lib/getLanguageRoutes';
import { makeBibleMusicRoute } from '@lib/routes';

export default SongBookDetail;

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ language: string; book: string }>): Promise<
	GetStaticPropsResult<SongBooksDetailProps & IBaseProps>
> {
	const book = (params?.book as string).replace(/-/g, ' ');
	const language = getLanguageIdByRoute(params?.language);
	const intl = await getIntl(language);

	const { musicTracks } = await getSongBooksDetailPageData({
		language,
		book,
	}).catch(() => ({ musicTracks: { nodes: [] } }));

	return {
		props: {
			book,
			musicTracks: musicTracks.nodes || [],
			title: intl.formatMessage(
				{
					id: 'songBook__title',
					defaultMessage: '{book} Scripture Songs',
				},
				{
					book: startCase(book),
				}
			),
		},
		revalidate: REVALIDATE,
	};
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const routes = getLanguageRoutes();
	const sets = routes.map((r) =>
		BIBLE_BOOKS.map((b) => makeBibleMusicRoute(r, b))
	);

	return {
		paths: sets.flat(),
		fallback: 'blocking',
	};
}
