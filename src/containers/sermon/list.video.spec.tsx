import {
	loadSermonListData,
	loadSermonListPagePathsData,
} from '@containers/sermon/list.all.spec';
import {
	GetSermonListPageDataDocument,
	GetSermonListPagePathsDataDocument,
} from '@lib/generated/graphql';
import { buildStaticRenderer, mockedFetchApi } from '@lib/test/helpers';
import { getStaticPaths } from '@pages/[language]/teachings/video/page/[i]';
import SermonList, {
	getStaticProps,
} from '@pages/[language]/teachings/video/page/[i]';

const renderPage = buildStaticRenderer(SermonList, getStaticProps, {
	i: '1',
	language: 'en',
});

describe('sermon video list page', () => {
	it('gets video count', async () => {
		await getStaticPaths();

		expect(mockedFetchApi).toBeCalledWith(GetSermonListPagePathsDataDocument, {
			variables: { language: 'ENGLISH', hasVideo: true },
		});
	});

	it('generates filtered pages', async () => {
		loadSermonListPagePathsData(1);

		const result = await getStaticPaths();

		expect(result.paths).toContain('/es/teachings/video/page/1');
	});

	it('gets video filtered sermons', async () => {
		loadSermonListData();

		await renderPage({
			params: {
				i: '1',
				language: 'en',
			},
		});

		expect(mockedFetchApi).toBeCalledWith(GetSermonListPageDataDocument, {
			variables: {
				language: 'ENGLISH',
				hasVideo: true,
				first: 12,
				offset: 0,
			},
		});
	});

	it('includes filter in pagination', async () => {
		loadSermonListData();

		const { getByText } = await renderPage();
		const link = getByText('1') as HTMLAnchorElement;

		expect(link.href).toContain('/en/teachings/video/page/1');
	});
});
