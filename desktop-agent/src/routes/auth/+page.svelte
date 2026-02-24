<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { goto } from "$app/navigation";

    let email = $state("");
    let password = $state("");
    let errorMessage = $state("");
    let loading = $state(false);

    async function handleLogin(e: Event) {
        e.preventDefault();
        errorMessage = "";
        loading = true;

        try {
            await invoke("login", { email, password });
            await goto("/");
        } catch (err) {
            errorMessage = err as string;
        } finally {
            loading = false;
        }
    }
</script>

<main class="login-container">
    <div class="login-box">
        <h1>Login</h1>
        <p class="subtitle">SnappyYak Agent</p>

        {#if errorMessage}
            <div class="error">{errorMessage}</div>
        {/if}

        <form onsubmit={handleLogin}>
            <div class="input-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    placeholder="employee@company.com"
                />
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    placeholder="Enter password"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
            </button>
        </form>
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        background-color: #132326; /* brand-dark */
        color: #f3f4f6;
    }

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
    }

    .login-box {
        background-color: #1f2937;
        border-radius: 8px;
        padding: 2rem;
        width: 100%;
        max-width: 320px;
        border: 1px solid #374151;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: #f9fafb;
        text-align: center;
    }

    .subtitle {
        text-align: center;
        color: #9ca3af;
        font-size: 0.875rem;
        margin: 0 0 1.5rem 0;
    }

    .error {
        background-color: #fee2e2;
        color: #ef4444;
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        text-align: center;
        border: 1px solid #fecaca;
    }

    .input-group {
        margin-bottom: 1.25rem;
    }

    label {
        display: block;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        color: #d1d5db;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        background-color: #374151;
        border: 1px solid #4b5563;
        border-radius: 4px;
        color: white;
        box-sizing: border-box;
        font-size: 0.875rem;
    }

    input:focus {
        outline: none;
        border-color: #ea580c; /* brand-orange */
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background-color: #ea580c; /* brand-orange */
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
        background-color: #c2410c;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
