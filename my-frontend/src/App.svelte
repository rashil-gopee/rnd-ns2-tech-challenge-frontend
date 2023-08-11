<script lang="ts">
	import { onMount } from 'svelte';
	import { GraphQLClient } from 'graphql-request';
	import Users from './lib/Users.svelte';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	// import {
	//   TopAppBar,
	//   Row,
	//   Section,
	//   Title,
	//   NavigationIcon,
	//   ActionItem
	// } from '@smui/top-app-bar';
	import Drawer, { AppContent, Content } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import IconButton from '@smui/icon-button';
	import NavigationIcon from '@smui/icon-button';

	let open = true;
	function toggleDrawer() {
		open = !open;
	}

	const PAGE_SIZE = 10;
	let users = [];
	let currentPage = 1;
	let totalOfPage = 1;
	let newUsername = '';
	let isDialogOpen = false;

	// Function to fetch users with pagination
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

	// Fetch users when the component mounts
	onMount(async () => {
		await fetchUsers();
	});

	// Function to fetch next page
	async function nextPage() {
		if (currentPage < totalOfPage) {
			currentPage = currentPage + 1;
			await fetchUsers();
		}
	}

	// Function to fetch previous page
	async function prevPage() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
			await fetchUsers();
		}
	}
</script>

<TopAppBar>
	<Row>
		<Section>
			<NavigationIcon>
				<IconButton on:click={toggleDrawer} class="material-icons">
					menu
				</IconButton>
			</NavigationIcon>
			<Title>Harvest Tech Challenge</Title>
		</Section>
		<!-- You can also add other action items in the header if needed. -->
		<!-- <Section alignEnd actionItems>
      <ActionItem>
        <IconButton class="material-icons">more_vert</IconButton>
      </ActionItem>
    </Section> -->
	</Row>
</TopAppBar>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open>
		<Content>
			<List>
				<Item
					on:click={() => {
						/* Navigate or do something */
					}}>Menu Item 1</Item
				>
				<Item
					on:click={() => {
						/* Navigate or do something */
					}}>Menu Item 2</Item
				>
				<Item
					on:click={() => {
						/* Navigate or do something */
					}}>Menu Item 3</Item
				>
			</List>
		</Content>
	</Drawer>

	<div
		class="main-content mt-16 p-6"
		style={open ? 'margin-left: 256px;' : ''}
	>
		<main>
			<h1>Harvest Tech Challenge</h1>
			<Users
				{users}
				{currentPage}
				{totalOfPage}
				on:next={nextPage}
				on:prev={prevPage}
			/>
		</main>
	</div>
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
