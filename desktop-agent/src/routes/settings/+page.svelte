<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let accountEmail = $state("");
  let loggingOut = $state(false);
  let logoutError = $state("");

  let manualDate = $state(new Date().toISOString().slice(0, 10));
  let manualHours = $state(0);
  let manualMinutes = $state(0);
  let manualSubmitting = $state(false);
  let manualError = $state("");
  let manualSuccess = $state("");

  onMount(() => {
    loadAccount();
  });

  async function loadAccount() {
    try {
      const email = await invoke<string | null>("get_account_email");
      accountEmail = email ?? "";
    } catch (e) {
      accountEmail = "";
    }
  }

  async function handleLogout() {
    if (loggingOut) return;
    loggingOut = true;
    logoutError = "";

    try {
      await invoke("logout");
      await goto("/auth");
    } catch (e) {
      logoutError = "Logout failed. Please try again.";
    } finally {
      loggingOut = false;
    }
  }

  async function submitManualTime() {
    if (manualSubmitting) return;
    manualSubmitting = true;
    manualError = "";
    manualSuccess = "";

    const hours = Number(manualHours);
    const minutes = Number(manualMinutes);

    try {
      await invoke("add_manual_time", {
        date: manualDate,
        hours,
        minutes
      });
      manualSuccess = "Manual time added.";
    } catch (e) {
      manualError = typeof e === "string" ? e : "Failed to add manual time.";
    } finally {
      manualSubmitting = false;
    }
  }
</script>

<main class="settings-container">
  <header class="settings-header">
    <div>
      <p class="eyebrow">Settings</p>
      <h1>Agent Preferences</h1>
      <p class="subtext">Configure privacy, tracking, and account options.</p>
    </div>
    <button class="primary-button" onclick={() => (location.hash = "manual-time")}
      >Add Manual Time</button
    >
  </header>

  <section class="card">
    <h2>Privacy</h2>
    <div class="row">
      <div>
        <h3>Screenshot Capture</h3>
        <p>Temporarily disable or enable screenshot capture.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
    <div class="row">
      <div>
        <h3>Blur Sensitive Apps</h3>
        <p>Automatically blur applications marked as sensitive.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
    <div class="row">
      <div>
        <h3>Exclude Windows</h3>
        <p>Add specific windows to exclude from tracking.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
  </section>

  <section class="card">
    <h2>Tracking</h2>
    <div class="row">
      <div>
        <h3>Idle Timeout</h3>
        <p>Adjust how long before idle time is recorded.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
    <div class="row">
      <div>
        <h3>Screenshot Frequency</h3>
        <p>Control how often screenshots are captured.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
    <div class="row">
      <div>
        <h3>Activity Sensitivity</h3>
        <p>Tune keyboard and mouse sensitivity thresholds.</p>
      </div>
      <button class="ghost-button" disabled>Coming Soon</button>
    </div>
  </section>

  <section class="card" id="manual-time">
    <h2>Manual Time</h2>
    <p class="subtext">Log time for days when you were offline.</p>
    <div class="manual-grid">
      <label>
        Date
        <input type="date" bind:value={manualDate} />
      </label>
      <label>
        Hours
        <input type="number" min="0" bind:value={manualHours} />
      </label>
      <label>
        Minutes
        <input type="number" min="0" max="59" bind:value={manualMinutes} />
      </label>
    </div>
    <div class="manual-actions">
      <button class="primary-button" onclick={submitManualTime} disabled={manualSubmitting}>
        {manualSubmitting ? "Saving..." : "Save Manual Time"}
      </button>
      {#if manualSuccess}
        <span class="success">{manualSuccess}</span>
      {/if}
      {#if manualError}
        <span class="error">{manualError}</span>
      {/if}
    </div>
  </section>

  <section class="card">
    <h2>Account</h2>
    <div class="row">
      <div>
        <h3>Signed in</h3>
        <p>{accountEmail || "Unknown user"}</p>
      </div>
      <button class="ghost-button" disabled>Sync: Active</button>
    </div>
    <div class="row">
      <div>
        <h3>Data Usage</h3>
        <p>Metrics uploaded every minute when active.</p>
      </div>
      <button class="ghost-button" disabled>View Stats</button>
    </div>
    <div class="row">
      <div>
        <h3>Logout</h3>
        <p>Sign out to stop tracking on this device.</p>
      </div>
      <button class="outline-button" onclick={handleLogout} disabled={loggingOut}>
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
    {#if logoutError}
      <div class="error">{logoutError}</div>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #132326;
    color: #f3f4f6;
  }

  .settings-container {
    padding: 2rem;
    max-width: 860px;
    margin: 0 auto;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.65rem;
    color: #9ca3af;
    margin: 0 0 0.5rem 0;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.6rem;
    color: #f9fafb;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.15rem;
  }

  .subtext {
    margin: 0;
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .card {
    background-color: #1f2937;
    border-radius: 12px;
    border: 1px solid #374151;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-top: 1px solid #374151;
  }

  .row:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
  }

  .row p {
    margin: 0;
    color: #9ca3af;
    font-size: 0.85rem;
  }

  .primary-button {
    background-color: #ea580c;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .ghost-button {
    background: transparent;
    border: 1px solid #374151;
    color: #9ca3af;
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    font-size: 0.75rem;
  }

  .outline-button {
    background: transparent;
    border: 1px solid #ea580c;
    color: #ea580c;
    padding: 0.5rem 0.9rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .manual-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .manual-grid label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
  }

  .manual-grid input {
    background-color: #111827;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #f3f4f6;
    padding: 0.5rem 0.6rem;
  }

  .manual-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .success {
    color: #22c55e;
    font-size: 0.8rem;
  }

  .error {
    color: #fca5a5;
    font-size: 0.8rem;
  }

  @media (max-width: 640px) {
    .settings-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
