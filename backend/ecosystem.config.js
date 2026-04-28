module.exports = {
  apps: [{
    name: 'voc-backend',
    script: 'venv/bin/python',
    args: '-m uvicorn main:app --host 0.0.0.0 --port 8000',
    cwd: '/opt/vibeopenclaw/backend',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
    },
    log_file: '/opt/vibeopenclaw/backend/logs/combined.log',
    out_file: '/opt/vibeopenclaw/backend/logs/out.log',
    error_file: '/opt/vibeopenclaw/backend/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
