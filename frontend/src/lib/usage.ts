import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function logProxyCall(userId: string, agentId: string) {
  try {
    await query(
      `INSERT INTO usage_logs (id, user_id, agent_id, date, messages_sent, api_calls, input_tokens, output_tokens, total_tokens)
       VALUES ($1, $2, $3, NOW(), 0, 1, 0, 0, 0)`,
      [uuidv4(), userId, agentId]
    );
  } catch (err) {
    console.error('[usage] failed to log proxy call', err);
  }
}
