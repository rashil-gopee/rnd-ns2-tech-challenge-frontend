<script lang="ts">
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import TextField, { Input } from '@smui/textfield';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button from '@smui/button';

	export let open = false;
	export let onClose = () => {};
	export let onCreate = (username: string) => {};

	const username = field('username', '', [required()]);
	const userForm = form(username);

	function handleCreateUser(event: Event) {
		event.stopPropagation();
		event.preventDefault();

		userForm.validate();
		if ($userForm.valid) {
			onCreate($username.value);
			handleClose();
		}
	}

	function handleClose() {
		userForm.reset();
		onClose();
	}

	$: if (!open) {
		userForm.reset();
	}
</script>

<Dialog bind:open>
	<Title>Create New User</Title>
	<Content class="!p-6">
		<TextField
			label="Username"
			bind:value={$username.value}
			variant="outlined"
		/>
		{#if $userForm.hasError('username.required')}
			<div>Username is required</div>
		{/if}
	</Content>
	<Actions>
		<Button on:click={handleCreateUser}>Create</Button>
		<Button type="button" on:click={handleClose} variant="text"
			>Close</Button
		>
	</Actions>
</Dialog>
