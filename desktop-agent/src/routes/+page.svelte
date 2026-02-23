<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount, onDestroy } from "svelte";

  let activityData = $state({
    keyboard_count: 0,
    mouse_count: 0,
    active_app: "Loading..."
  });
  
  let intervalId: ReturnType<typeof setInterval>;

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
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

<main class="container">
  <h1>SnappyYak Agent</h1>
  <p class="status">Tracking Active</p>

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
    color: #10b981; /* green indicator */
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
    background-color: #10b981;
  }

  .metrics {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
</style>
