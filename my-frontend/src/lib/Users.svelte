<!-- DataTable.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Label } from '@smui/common';
	import IconButton from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button from '@smui/button';
	import Chip, { Set, Text } from '@smui/chips';
	import TextField, { Input } from '@smui/textfield';

	export let onChangePageSize = () => {};

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
	$: currentPage = currentPage;
	$: totalOfPage = totalOfPage;

	const dispatch = createEventDispatcher();

	let pageSizeOptions = [10, 20, 50, 100];

	let PAGE_SIZE = pageSizeOptions[0];
	$: start = (currentPage - 1) * PAGE_SIZE;
	$: end = Math.min(start + PAGE_SIZE, PAGE_SIZE * currentPage);

	function nextPage() {
		dispatch('next');
	}

	function prevPage() {
		dispatch('prev');
	}

	async function createUser() {
		if (!newUsername) return;

		// Add your mutation logic here...

		// closeDialog();
		// Optionally: Refresh user list after adding.
		// fetchUsers();
	}

	function openDialog() {
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	$: if (typeof PAGE_SIZE === 'number') {
		dispatch('changePageSize', PAGE_SIZE);
	}

	let newUsername = '';
	let isDialogOpen = false;
</script>

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
			<Select variant="outlined" bind:value={PAGE_SIZE}>
				{#each pageSizeOptions as option}
					<Option value={option}>{option}</Option>
				{/each}
			</Select>
		</svelte:fragment>
		<svelte:fragment slot="total">
			{start + 1}-{end} of {PAGE_SIZE * totalOfPage}
		</svelte:fragment>

		<IconButton
			class="material-icons"
			action="prev-page"
			title="Prev page"
			on:click={prevPage}
			disabled={currentPage === 1}
		>
			chevron_left
		</IconButton>
		<IconButton
			class="material-icons"
			action="next-page"
			title="Next page"
			on:click={nextPage}
			disabled={currentPage === totalOfPage}
		>
			chevron_right
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
