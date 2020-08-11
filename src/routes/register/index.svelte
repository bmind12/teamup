<script>
    import { goto, stores } from '@sapper/app';
    import { post } from 'api.js';
    // import ListErrors from '../_components/ListErrors.svelte';

    const { session } = stores();
    let email = '';
    let password = '';
    let errors = null;

    async function handleSubmit(event) {
        const response = await post('auth/register', { email, password });

        errors = response.errors; // TODO handle network errors

        console.log('### response.user', response.user);
        if (response.user) {
            $session.user = response.user;
            goto('/users/me');
        }
    }
</script>

<style>
    form div {
        margin-bottom: 10px;
    }

    label {
        display: inline-block;
        width: 100px;
    }
</style>

<svelte:head>
    <title>Sign in</title>
</svelte:head>

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="email">email</label>
        <input
            id="email"
            type="email"
            placeholder="youremail@gmail.com"
            bind:value={email}
            required />
    </div>
    <div>
        <label for="password">password</label>
        <input
            id="password"
            type="password"
            placeholder="password"
            bind:value={password}
            required />
    </div>
    <div>
        <button type="submit">Sign up</button>
    </div>
</form>
