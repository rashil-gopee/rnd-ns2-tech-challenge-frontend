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
	function toggleDrawer() {
		open = !open;
	}

	let PAGE_SIZE = 10;
	let users = [];
	let currentPage = 1;
	let totalOfPage = 1;
	let newUsername = '';
	let isDialogOpen = false;

	async function fetchUsers() {
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
              }
            }
          }
        }
      `;

		const variables = {
			page: currentPage,
			pageSize: PAGE_SIZE,
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
		totalOfPage = pagination.totalOfPage;
	}

	async function createUser() {
		if (!newUsername) return;

		// Add your mutation logic here...

		closeDialog();
		// Optionally: Refresh user list after adding.
		// fetchUsers();
	}

	function openDialog() {
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	onMount(async () => {
		await fetchUsers();
	});

	async function nextPage() {
		if (currentPage < totalOfPage) {
			currentPage = currentPage + 1;
			await fetchUsers();
		}
	}

	async function prevPage() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
			await fetchUsers();
		}
	}

	function handlePageSizeChange(event: CustomEvent<number>) {
		const newPageSize = event.detail;
		PAGE_SIZE = newPageSize;
		currentPage = 1;
		fetchUsers();
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
							<h1>Harvest Tech Challenge</h1>
							<Users
								{users}
								{currentPage}
								{totalOfPage}
								on:next={nextPage}
								on:prev={prevPage}
								on:changePageSize={handlePageSizeChange}
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
