<script lang="ts">
	import { onMount } from 'svelte';
	import { GraphQLClient } from 'graphql-request';
	import Users from './lib/Users.svelte';
	import UsersTable from './lib/UsersTable.svelte';

	const PAGE_SIZE = 20;
	let users = [];
	let currentPage = 1;
	let totalOfPage = 1;

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

	// Fetch users when the component mounts
	onMount(async () => {
		await fetchUsers();
	});

	// Function to fetch next page
	async function nextPage() {
		if (currentPage < totalOfPage) {
			currentPage++;
			await fetchUsers();
		}
	}

	// Function to fetch previous page
	async function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			await fetchUsers();
		}
	}
</script>

<main>
	<h1>Harvest Tech Challenge</h1>
	<UsersTable
		{users}
		{currentPage}
		{totalOfPage}
		on:next={nextPage}
		on:prev={prevPage}
	/>
	<!-- <Users {users} /> -->

	<!-- <button on:click={prevPage} disabled={currentPage === 1}
		>Previous Page</button
	>
	<button on:click={nextPage} disabled={currentPage === totalOfPage}
		>Next Page</button
	> -->
</main>

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
