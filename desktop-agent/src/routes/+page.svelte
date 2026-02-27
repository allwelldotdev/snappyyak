<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";

  let activityData = $state({
    keyboard_count: 0,
    mouse_count: 0,
    active_app: "Loading...",
    tracking_paused: false
  });
  
  let intervalId: ReturnType<typeof setInterval>;
  let loggingOut = $state(false);
  let logoutError = $state("");
  let accountEmail = $state("");
  let manualOpen = $state(false);
  let manualDate = $state(new Date().toISOString().slice(0, 10));
  let manualHours = $state(0);
  let manualMinutes = $state(0);
  let manualSubmitting = $state(false);
  let manualError = $state("");
  let manualSuccess = $state("");

  async function fetchActivity() {
    try {
      activityData = await invoke("get_current_activity");
    } catch (e) {
      console.error("Failed to fetch activity:", e);
    }
  }

  onMount(() => {
    fetchActivity();
    intervalId = setInterval(fetchActivity, 1000);
    loadAccount();
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
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
      manualOpen = false;
    } catch (e) {
      manualError = typeof e === "string" ? e : "Failed to add manual time.";
    } finally {
      manualSubmitting = false;
    }
  }
</script>

<main class="container">
  <h1>SnappyYak Agent</h1>
  <p class="status {activityData.tracking_paused ? 'paused' : 'active'}">
    {activityData.tracking_paused ? "Tracking Paused" : "Tracking Active"}
  </p>
  <div class="toolbar">
    <button class="primary-button" onclick={() => (manualOpen = true)}>
      Add Manual Time
    </button>
  </div>

  <div class="metrics">
    <div class="card">
      <div class="label">Current Application</div>
      <div class="value">{activityData.active_app || "None"}</div>
    </div>
    
    <div class="card double">
      <div class="metric-row">
        <span>Keyboard Strokes</span>
        <span class="count">{activityData.keyboard_count}</span>
      </div>
      <div class="metric-row">
        <span>Mouse Movements</span>
        <span class="count">{activityData.mouse_count}</span>
      </div>
    </div>
  </div>

  <div class="settings">
    <div class="card">
      <div class="label">Account</div>
      <div class="account-row">
        <div class="account-details">
          <span class="account-status">Signed in</span>
          <span class="account-email">{accountEmail || "Unknown user"}</span>
        </div>
        <button class="logout-button" onclick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
      {#if logoutError}
        <div class="error">{logoutError}</div>
      {/if}
    </div>
  </div>

  {#if manualOpen}
    <div
      class="modal-backdrop"
      role="button"
      tabindex="0"
      onclick={() => (manualOpen = false)}
      onkeydown={(e) => {
        if (e.key === "Escape" || e.key === "Enter") manualOpen = false;
      }}
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
      >
        <h2>Add Manual Time</h2>
        <p class="modal-subtitle">Log time for a specific work day.</p>
        <div class="modal-grid">
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
        {#if manualError}
          <div class="error">{manualError}</div>
        {/if}
        <div class="modal-actions">
          <button class="secondary-button" onclick={() => (manualOpen = false)}>
            Cancel
          </button>
          <button class="primary-button" onclick={submitManualTime} disabled={manualSubmitting}>
            {manualSubmitting ? "Saving..." : "Save Manual Time"}
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #132326; /* brand-dark */
    color: #f3f4f6;
    overflow: hidden;
  }
  
  .container {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #f9fafb;
  }

  .status {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .status::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status.active {
    color: #10b981; /* green indicator */
  }

  .status.active::before {
    background-color: #10b981;
  }

  .status.paused {
    color: #ea580c; /* brand-orange */
  }

  .status.paused::before {
    background-color: #ea580c;
  }

  .metrics {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .toolbar {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .primary-button {
    background-color: #ea580c; /* brand-orange */
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .secondary-button {
    background-color: transparent;
    color: #f3f4f6;
    border: 1px solid #374151;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .settings {
    margin-top: 1.5rem;
    width: 100%;
  }

  .card {
    background-color: #1f2937;
    border-radius: 8px;
    padding: 1.25rem;
    border: 1px solid #374151;
    width: 100%;
    box-sizing: border-box;
  }

  .label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.125rem;
    font-weight: 500;
    color: #ea580c; /* brand-orange */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .metric-row:not(:last-child) {
    border-bottom: 1px solid #374151;
  }

  .count {
    font-weight: 600;
    color: #4F46E5; /* brand-indigo */
  }

  .account-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .account-details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .account-status {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .account-email {
    font-size: 0.8rem;
    color: #f3f4f6;
  }

  .logout-button {
    background-color: transparent;
    color: #ea580c; /* brand-orange */
    border: 1px solid #ea580c;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .logout-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    margin-top: 0.75rem;
    font-size: 0.75rem;
    color: #fca5a5;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .modal {
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    padding: 1.5rem;
    width: 100%;
    max-width: 420px;
    box-sizing: border-box;
  }

  .modal h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    color: #f9fafb;
  }

  .modal-subtitle {
    margin: 0 0 1rem 0;
    font-size: 0.85rem;
    color: #9ca3af;
  }

  .modal-grid {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .modal-grid label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
  }

  .modal-grid input {
    background-color: #111827;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #f3f4f6;
    padding: 0.5rem 0.6rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
</style>
