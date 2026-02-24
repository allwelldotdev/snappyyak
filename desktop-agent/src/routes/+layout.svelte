<script lang="ts">
    import { onMount, tick } from "svelte";
    import { goto } from "$app/navigation";
    import { invoke } from "@tauri-apps/api/core";
    import { page } from "$app/stores";

    onMount(async () => {
        try {
            const isAuthenticated = await invoke<boolean>("check_auth");
            const isAuthRoute = $page.url.pathname.startsWith("/auth");

            if (!isAuthenticated && !isAuthRoute) {
                await goto("/auth");
            } else if (isAuthenticated && isAuthRoute) {
                await goto("/");
            }
        } catch (e) {
            console.error("Auth check failed:", e);
        }
    });
</script>

<slot />
