<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { GraphQLClient } from 'graphql-request';
	import Users from './lib/Users.svelte';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import Drawer, { AppContent, Content } from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import NavigationIcon from '@smui/icon-button';
	import { Router, Link, Route } from 'svelte-navigator';
	import Sidenav from './lib/Sidenav.svelte';
	import Home from './lib/Home.svelte';

	let open = true;

	let users = [];
	let pageSize: number;
	let currentPage: number;
	let totalOfPage: number;
	let totalOfRecord: number;

	let currentAbortController: AbortController | null = null;

	const ENDPOINT =
		'https://rnd-ns2-tech-challenge-next-be.vercel.app/api/graphql';

	async function fetchUsers(page: number, size: number) {
		if (currentAbortController) {
			currentAbortController.abort();
		}

		currentAbortController = new AbortController();
		const signal = currentAbortController.signal;

		const query = `
		query Users($page: Int, $pageSize: Int) {
          Users(pagination: { page: $page, pageSize: $pageSize }) {
			data {
				id
				username
				companies {
				id
				name
				}
			}
			meta {
				pagination {
				page
				pageSize
				totalOfPage
				totalOfRecord
				}
			}
			}
		}
      `;

		const variables = {
			page: page,
			pageSize: size,
		};

		const client = new GraphQLClient(ENDPOINT, {
			mode: 'cors',
			signal: signal,
		});

		try {
			const response = await client.request<UsersResponse>(
				query,
				variables
			);

			const {
				Users: {
					data,
					meta: { pagination },
				},
			} = response;

			users = data;
			pageSize = pagination.pageSize;
			currentPage = pagination.page;
			totalOfPage = pagination.totalOfPage;
			totalOfRecord = pagination.totalOfRecord;
		} catch (error) {
			if (error.name === 'AbortError') {
				console.log('Request was aborted');
			} else {
				console.error('Error fetching users:', error);
			}
		}
	}

	async function createUser(event: CustomEvent<{ username: string }>) {
		const { username: newUsername } = event.detail;
		if (!newUsername) return;

		const mutation = `
        mutation ($username: String!) {
            createUser(username: $username) {
                id
                username
            }
        }
    `;

		const variables = {
			username: newUsername,
		};

		const client = new GraphQLClient(ENDPOINT);

		try {
			await client.request(mutation, variables);
			const lastPage = Math.ceil(totalOfRecord / pageSize);
			fetchUsers(lastPage, pageSize);
		} catch (error) {
			console.error('Error creating user:', error);
		}
	}

	function handleNavigation(
		event: CustomEvent<{ page: number; pageSize: number }>
	) {
		event.stopPropagation();
		const pageOptions = event.detail;
		const { page, pageSize } = pageOptions;
		currentPage = page;
		fetchUsers(page, pageSize);
	}

	function toggleDrawer() {
		open = !open;
	}

	onDestroy(() => {
		if (currentAbortController) {
			currentAbortController.abort();
		}
	});
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<TopAppBar class="relative flex-shrink-0">
		<Row>
			<Section>
				<NavigationIcon>
					<IconButton on:click={toggleDrawer} class="material-icons">
						menu
					</IconButton>
				</NavigationIcon>
				<Title>Harvest Tech Challenge</Title>
			</Section>
		</Row>
	</TopAppBar>

	<Router>
		<div class="flex-grow overflow-hidden">
			<div class="drawer-container flex h-full">
				<Drawer
					variant="dismissible"
					bind:open
					class="h-full overflow-y-auto"
				>
					<Content class="h-full">
						<Sidenav />
					</Content>
				</Drawer>

				<div
					class={`main-content p-6 flex-grow overflow-y-auto ${
						open ? 'ml-64' : ''
					}`}
				>
					<main class="h-full w-full">
						<Route path="/" component={Home} />

						<Route path="/users" let:params>
							<Users
								{users}
								{currentPage}
								{totalOfPage}
								{totalOfRecord}
								{pageSize}
								on:navigate={handleNavigation}
								on:createUser={createUser}
							/>
						</Route>
					</main>
				</div>
			</div>
		</div>
	</Router>
</div>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.read-the-docs {
		color: #888;
	}
</style>
