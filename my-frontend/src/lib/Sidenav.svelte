<script>
	import { useLocation } from 'svelte-navigator';
	import List, { Item } from '@smui/list';
	import { Link } from 'svelte-navigator';

	const location = useLocation();

	const menuItems = [
		{ path: '/', label: 'Home' },
		{ path: '/menuItem2', label: 'Menu Item 2' },
		// add more menu items as needed
	];

	$: activePath = $location.pathname;
</script>

<List>
	{#each menuItems as item}
		<Link to={item.path}>
			<Item activated={activePath === item.path}>{item.label}</Item>
		</Link>
	{/each}
</List>
