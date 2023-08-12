<script lang="ts">
	import TextField, { Input } from '@smui/textfield';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button from '@smui/button';

	export let open = false;
	export let onClose = () => {};
	export let onCreate = (username: string) => {};

	let newUsername = '';
	let usernameError = '';

	function validateUsername() {
		if (newUsername.length <= 0) {
			usernameError = 'Username is required.';
			return false;
		} else {
			usernameError = ''; // Clear the error
			return true;
		}
	}

	function handleCreateUser() {
		if (!validateUsername()) return;
		onCreate(newUsername);
		newUsername = ''; // Clear the input after creation
	}
</script>

<Dialog bind:open>
	<Title>Create New User</Title>
	<Content class="!p-6">
		<TextField
			label="Username"
			bind:value={newUsername}
			variant="outlined"
		/>
		<!-- Display error message if there is one -->
		{#if usernameError}<p class="text-red-500 mt-2">{usernameError}</p>{/if}
	</Content>
	<Actions>
		<Button on:click={handleCreateUser}>Create</Button>
		<Button on:click={onClose} variant="text">Close</Button>
	</Actions>
</Dialog>
