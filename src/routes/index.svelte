<script context = 'module'>
    export async function load({fetch}) {
        const res = await fetch('/todos')
        const jsonRes = await res.json()
        return {props: {todos: jsonRes.todos}}
    }
</script>
<script>
	import { onMount } from 'svelte';
	import auth from '../auth-service';
	import { isAuthenticated, user } from '../auth-store';
	import TaskItem from '../components/TaskItem.svelte';

    export let todos
	let auth0Client;
	let newTask;

	onMount(async () => {
		auth0Client = await auth.createClient();

		isAuthenticated.set(await auth0Client.isAuthenticated());
		user.set(await auth0Client.getUser());
	});

	function login() {
		auth.loginWithPopup(auth0Client);
	}

	function logout() {
		auth.logout(auth0Client);
	}

	async function addItem() {
		let newTaskObject = {
			description: newTask,
			completed: false,
			user: $user.email
		};

		console.log(newTaskObject);

		newTask = '';
		try {
			await fetch('/todos', {
				method: 'POST',
				body: JSON.stringify(newTaskObject)
			});
		} catch (err) {
			alert('There was an error.');
		}
        fetchItems()
	}
    async function completeItem() {
        try {
            await fetch ('/todos', {
                method: 'PUT',
                body: JSON.stringify(todo)
            })
        } catch(err) {
            alert('There was an error.');
        }
        fetchItems()
    }
    async function fetchItems() {
        const res = await fetch ('/todos')
        const jsonRes = await res.json()
        todos = jsonRes.todos
    }
</script>

<main>
	<!-- App Bar -->
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<a class="navbar-brand" href="/#">Task Manager</a>
		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			data-target="#navbarText"
			aria-controls="navbarText"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarText">
			<div class="navbar-nav mr-auto user-details">
				{#if $isAuthenticated}
					<span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
				{:else}<span>&nbsp;</span>{/if}
			</div>
			<span class="navbar-text">
				<ul class="navbar-nav float-right">
					{#if $isAuthenticated}
						<li class="nav-item">
							<a class="nav-link" href="/#" on:click={logout}>Log Out</a>
						</li>
					{:else}
						<li class="nav-item">
							<a class="nav-link" href="/#" on:click={login}>Log In</a>
						</li>
					{/if}
				</ul>
			</span>
		</div>
	</nav>

	<!-- Application -->
	{#if !$isAuthenticated}
		<div class="container mt-5">
			<div class="row">
				<div class="col-md-10 offset-md-1">
					<div class="jumbotron">
						<h1 class="display-4">Task Management made Easy!</h1>
						<p class="lead">Instructions</p>
						<ul>
							<li>Login to start &#128272;</li>
							<li>Create Tasks &#128221;</li>
							<li>Tick off completed tasks &#9989;</li>
						</ul>
						<a
							class="btn btn-primary btn-lg mr-auto ml-auto"
							href="/#"
							role="button"
							on:click={login}>Log In</a
						>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="container" id="main-application">
			<div class="row">
				<div class="col-md-6">
					<ul class="list-group">
						{#each todos as item (item._id)}
							<TaskItem task={item} />
						{/each}
					</ul>
				</div>
				<div class="col-md-6">
					<input class="form-control" bind:value={newTask} placeholder="Enter New Task" />
					<br />
					<button type="button" class="btn btn-primary" on:click={addItem}> Add Task </button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	#main-application {
		margin-top: 50px;
	}
</style>
