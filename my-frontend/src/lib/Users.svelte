<!-- DataTable.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Label } from '@smui/common';
	import IconButton from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button from '@smui/button';
	import Chip, { Set, Text } from '@smui/chips';
	import TextField, { Input } from '@smui/textfield';

	import DataTable, {
		Body,
		Cell,
		Head,
		Pagination,
		Row,
	} from '@smui/data-table';
	import AddUserDialog from './AddUserDialog.svelte';

	export let users = [];
	export let currentPage = 1;
	export let totalOfPage = 1;
	export let totalOfRecord = 0;
	let pageSizeOptions = [10, 20, 50, 100];
	let pageSize = pageSizeOptions[0];

	const dispatch = createEventDispatcher();

	function createUser(username: string) {
		dispatch('createUser', { username: username });
	}

	function openDialog() {
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	$: if (typeof pageSize === 'number') {
		navigate(currentPage, pageSize);
	}

	let newUsername = '';
	let isDialogOpen = false;

	function navigate(page: number, size: number) {
		dispatch('navigate', { page, pageSize: size });
	}

	onMount(async () => {
		navigate(currentPage, pageSize);
	});
</script>

<h1>Harvest Tech Challenge</h1>

<Button on:click={openDialog} raised class="mb-6 mt-6">Add New User</Button>

<DataTable table$aria-label="User list" style="width: 100%;">
	<Head>
		<Row>
			<Cell numeric>ID</Cell>
			<Cell>Username</Cell>
			<Cell>Companies</Cell>
		</Row>
	</Head>
	<Body>
		{#each users as user (user.id)}
			<Row>
				<Cell numeric>{user.id}</Cell>
				<Cell>{user.username}</Cell>
				<Cell>
					<Set
						chips={user.companies.map((company) => company.name)}
						let:chip
						nonInteractive
					>
						<Chip {chip}>
							<Text>{chip}</Text>
						</Chip>
					</Set>
				</Cell>
			</Row>
		{/each}
	</Body>

	<Pagination slot="paginate">
		<svelte:fragment slot="rowsPerPage">
			<Label>Rows Per Page</Label>
			<Select variant="outlined" bind:value={pageSize}>
				{#each pageSizeOptions as option}
					<Option value={option}>{option}</Option>
				{/each}
			</Select>
		</svelte:fragment>
		<svelte:fragment slot="total">
			Page {currentPage} of {totalOfPage} ({totalOfRecord} records)
		</svelte:fragment>

		<IconButton
			class="material-icons"
			action="first-page"
			title="First page"
			on:click={() => navigate(1, pageSize)}
			disabled={currentPage === 1}
		>
			first_page
		</IconButton>

		<IconButton
			class="material-icons"
			action="prev-page"
			title="Prev page"
			on:click={() => navigate(currentPage - 1, pageSize)}
			disabled={currentPage === 1}
		>
			chevron_left
		</IconButton>
		<IconButton
			class="material-icons"
			action="next-page"
			title="Next page"
			on:click={() => navigate(currentPage + 1, pageSize)}
			disabled={currentPage === totalOfPage}
		>
			chevron_right
		</IconButton>

		<IconButton
			class="material-icons"
			action="last-page"
			title="Last page"
			on:click={() => navigate(totalOfPage, pageSize)}
			disabled={currentPage === totalOfPage}
		>
			last_page
		</IconButton>
	</Pagination>
</DataTable>

<AddUserDialog
	bind:open={isDialogOpen}
	onClose={closeDialog}
	onCreate={createUser}
/>

<style>
</style>
