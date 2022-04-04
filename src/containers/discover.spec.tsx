import { waitFor } from '@testing-library/react';

import {
	GetDiscoverPageDataDocument,
	GetDiscoverPageDataQuery,
	RecordingContentType,
	SequenceContentType,
} from '@lib/generated/graphql';
import { buildLoader, buildStaticRenderer } from '@lib/test/helpers';
import Discover, { getStaticProps } from '@pages/[language]/discover';

const renderPage = buildStaticRenderer(Discover, getStaticProps, {
	language: 'en',
});
const loadData = buildLoader<GetDiscoverPageDataQuery>(
	GetDiscoverPageDataDocument,
	{
		recentTeachings: {
			nodes: [
				{
					title: 'the_sermon_title',
					canonicalPath: 'the_sermon_path',
					recordingContentType: RecordingContentType.Sermon,
					persons: [],
				},
			],
		},
		trendingTeachings: {
			nodes: [
				{
					recording: {
						title: 'the_sermon_title2',
						canonicalPath: 'the_sermon_path',
						recordingContentType: RecordingContentType.Sermon,
						persons: [],
					},
				},
			],
		},
		storySeasons: {
			nodes: [
				{
					title: 'the_story_title',
					canonicalPath: 'the_story_path',
					contentType: SequenceContentType.StorySeason,
					speakers: {
						nodes: [],
					},
					recordings: {
						nodes: [],
					},
					allRecordings: {
						aggregate: {
							count: 0,
						},
					},
				},
			],
		},
		conferences: {
			nodes: [
				{
					title: 'the_conference_title',
					canonicalPath: 'the_conference_path',
					sequences: {
						nodes: [],
					},
					recordings: {
						nodes: [],
					},
					allSequences: {
						aggregate: {
							count: 0,
						},
					},
					allRecordings: {
						aggregate: {
							count: 0,
						},
					},
				},
			],
		},
		blogPosts: {
			nodes: [
				{
					image: {
						url: 'the_post_image_url',
					},
					publishDate: '2019-12-03T09:54:33Z',
					title: 'the_post_title',
					teaser: 'the_post_teaser',
					canonicalPath: 'the_post_path',
					readingDuration: 9 * 60,
				},
			],
		},
	}
);

describe('discover page', () => {
	it('renders titles', async () => {
		loadData();

		const { getByText } = await renderPage();

		await waitFor(() => {
			expect(getByText('the_sermon_title')).toBeInTheDocument();
		});
	});
});
