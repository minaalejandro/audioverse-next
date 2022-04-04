import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when } from 'jest-when';
import Cookies from 'js-cookie';
import React from 'react';

import withAuthGuard from '@components/HOCs/withAuthGuard';
import {
	GetWithAuthGuardDataDocument,
	RegisterSocialDocument,
} from '@lib/generated/graphql';
import { loadRouter, mockedFetchApi, renderWithIntl } from '@lib/test/helpers';

function render() {
	const Comp = withAuthGuard(() => <>hello world</>);
	return renderWithIntl(<Comp />);
}

describe('withAuthGuard', () => {
	beforeEach(() => loadRouter({ query: {} }));
	it('displays login if no email', async () => {
		when(mockedFetchApi)
			.calledWith(GetWithAuthGuardDataDocument, expect.anything())
			.mockResolvedValue({
				me: {
					user: {
						email: null,
					},
				},
			});

		const { getByPlaceholderText } = await render();

		expect(getByPlaceholderText('jane@example.com')).toBeInTheDocument();
	});

	it('offers social login', async () => {
		const { getByText } = await render();

		expect(getByText('Login with Google')).toBeInTheDocument();
	});

	it('displays content on successful social login', async () => {
		Cookies.get = jest.fn().mockReturnValue({ avSession: 'abc123' });

		const { getByText, queryByText } = await render();

		expect(queryByText('hello world')).not.toBeInTheDocument();

		when(mockedFetchApi)
			.calledWith(RegisterSocialDocument, expect.anything())
			.mockResolvedValue({
				loginSocial: {
					errors: [],
					authenticatedUser: {
						sessionToken: 'the_token',
					},
				},
			});

		when(mockedFetchApi)
			.calledWith(GetWithAuthGuardDataDocument, expect.anything())
			.mockResolvedValue({
				me: {
					user: {
						email: 'the_email',
					},
				},
			});

		userEvent.click(getByText('Login with Google'));

		await waitFor(() => {
			expect(getByText('hello world')).toBeInTheDocument();
		});
	});
});
