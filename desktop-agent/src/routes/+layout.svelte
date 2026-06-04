<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { invoke } from "@tauri-apps/api/core";
    import { listen } from "@tauri-apps/api/event";
    import { page } from "$app/stores";

    let unlistenLogout: (() => void) | null = null;
    let unlistenSettings: (() => void) | null = null;
    let unlistenManualTime: (() => void) | null = null;

    onMount(async () => {
        try {
            unlistenLogout = await listen("auth:logout", async () => {
                await goto("/auth");
            });
            unlistenSettings = await listen("navigate:settings", async () => {
                await goto("/settings");
            });
            unlistenManualTime = await listen("navigate:manual_time", async () => {
                await goto("/settings#manual-time");
            });
        } catch (e) {
            console.error("Failed to register logout listener:", e);
        }

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

    onDestroy(() => {
        if (unlistenLogout) {
            unlistenLogout();
        }
        if (unlistenSettings) {
            unlistenSettings();
        }
        if (unlistenManualTime) {
            unlistenManualTime();
        }
    });
</script>

<slot />
