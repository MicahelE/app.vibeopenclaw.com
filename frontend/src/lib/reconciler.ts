import Docker from 'dockerode';
import { query } from './db';

const docker = new Docker();
const INTERVAL_MS = 30_000;
const FLAP_THRESHOLD = 3;

let started = false;
let timer: NodeJS.Timeout | null = null;

interface AgentRow {
  id: string;
  status: string;
  container_id: string | null;
  port: number | null;
}

export function startReconciler() {
  if (started) return;
  started = true;
  console.log('[reconciler] starting (interval', INTERVAL_MS, 'ms)');
  void runOnce();
  timer = setInterval(() => void runOnce(), INTERVAL_MS);
  if (typeof timer.unref === 'function') timer.unref();
}

export function stopReconciler() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  started = false;
}

async function runOnce() {
  try {
    const result = await query(
      `SELECT id, status, container_id, port
         FROM agents
        WHERE status NOT IN ('DELETED', 'CREATING')
          AND container_id IS NOT NULL`
    );
    for (const row of result.rows as AgentRow[]) {
      try {
        await reconcileOne(row);
      } catch (err: any) {
        console.error('[reconciler] failed for', row.id, err?.message);
      }
    }
  } catch (err: any) {
    console.error('[reconciler] tick failed:', err?.message);
  }
}

async function reconcileOne(row: AgentRow) {
  if (!row.container_id) return;

  let info;
  try {
    info = await docker.getContainer(row.container_id).inspect();
  } catch (err: any) {
    if (err?.statusCode === 404) {
      if (row.status !== 'ERROR') {
        await query(
          "UPDATE agents SET status = 'ERROR', port = NULL WHERE id = $1",
          [row.id]
        );
        console.log('[reconciler]', row.id, 'container missing -> ERROR');
      }
      return;
    }
    throw err;
  }

  const state = info.State;
  const restartCount = (info as { RestartCount?: number }).RestartCount ?? 0;
  const flapping = state.Restarting === true || restartCount >= FLAP_THRESHOLD;

  let target: string | null = null;
  if (flapping) target = 'ERROR';
  else if (state.Running) target = 'RUNNING';
  else if (state.Status === 'exited' || state.Status === 'dead') {
    target = state.ExitCode === 0 ? 'STOPPED' : 'ERROR';
  } else if (state.Paused) target = 'STOPPED';

  if (!target || target === row.status) return;

  await query('UPDATE agents SET status = $1 WHERE id = $2', [target, row.id]);
  console.log('[reconciler]', row.id, row.status, '->', target,
    flapping ? `(restartCount=${restartCount})` : `(${state.Status})`);
}
