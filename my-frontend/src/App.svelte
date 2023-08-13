<script lang="ts">
	import { onMount } from 'svelte';
	import { GraphQLClient } from 'graphql-request';
	import Users from './lib/Users.svelte';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import Drawer, { AppContent, Content } from '@smui/drawer';
	import List, { Item } from '@smui/list';
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

	async function fetchUsers(page: number, size: number) {
		console.log('fetchUsers', page, size);
		const endpoint =
			'https://rnd-ns2-tech-challenge-next-be.vercel.app/api/graphql';
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

		const client = new GraphQLClient(endpoint);
		const response = await client.request<UsersResponse>(query, variables);
		console.log('response', response);
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
	}

	async function createUser(newUsername) {
		if (!newUsername) return;

		console.log('newUsername', newUsername);
	}

	function handleNavigation(
		event: CustomEvent<{ page: number; pageSize: number }>
	) {
		const pageOptions = event.detail;
		const { page, pageSize } = pageOptions;
		currentPage = page;
		fetchUsers(page, pageSize);
	}

	function toggleDrawer() {
		open = !open;
	}
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
								on:navigate={handleNavigation}
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
