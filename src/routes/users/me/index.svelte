<script>
    import { stores } from '@sapper/app';

    const { session, page, preloading } = stores();
</script>

<svelte:head>
    <title>User</title>
</svelte:head>

<div>Hello, {$session.user.email}</div>
