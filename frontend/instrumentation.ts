export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.VOC_DISABLE_RECONCILER === '1') return;
  const { startReconciler } = await import('./src/lib/reconciler');
  startReconciler();
}
