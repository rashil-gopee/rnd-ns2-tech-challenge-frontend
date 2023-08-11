<!-- DataTable.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Label } from '@smui/common';
	import IconButton from '@smui/icon-button';
	import Select, { Option } from '@smui/select';
	import DataTable, {
		Body,
		Cell,
		Head,
		Pagination,
		Row,
	} from '@smui/data-table';

	export let users = [];
	export let currentPage = 1;
	export let totalOfPage = 1;

	const dispatch = createEventDispatcher();

	const PAGE_SIZE = 20;
	let start = (currentPage - 1) * PAGE_SIZE;
	let end = Math.min(start + PAGE_SIZE, users.length);

	function nextPage() {
		dispatch('next');
	}

	function prevPage() {
		dispatch('prev');
	}
</script>

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
					{#each user.companies as company (company.id)}
						{company.name}<br />
					{/each}
				</Cell>
			</Row>
		{/each}
	</Body>

	<Pagination slot="paginate">
		<svelte:fragment slot="rowsPerPage">
			<Label>Rows Per Page</Label>
			<Select variant="outlined" value={PAGE_SIZE} disabled>
				<Option value={PAGE_SIZE}>{PAGE_SIZE}</Option>
			</Select>
		</svelte:fragment>
		<svelte:fragment slot="total">
			{start + 1}-{end} of {users.length * totalOfPage}
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
