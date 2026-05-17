#!/bin/bash
set -e

echo "[entrypoint] Starting CCTV AI Backend..."

ADDRESS_FILE="/app/backend/chain/evidence_address.txt"
DEPLOY_NEEDED=1

if [ -s "$ADDRESS_FILE" ]; then
    echo "[entrypoint] Contract address file found at $(cat $ADDRESS_FILE)"
    if python -c "
from web3 import Web3
import os, pathlib, sys
w3 = Web3(Web3.HTTPProvider(os.getenv('WEB3_PROVIDER','http://ganache:8155')))
address = pathlib.Path('$ADDRESS_FILE').read_text().strip()
if not w3.is_connected():
    sys.exit(1)
code = w3.eth.get_code(Web3.to_checksum_address(address))
sys.exit(0 if len(code) > 0 else 1)
"; then
        DEPLOY_NEEDED=0
        echo "[entrypoint] Existing contract bytecode verified"
    else
        echo "[entrypoint] Saved contract address is missing on-chain bytecode; redeploying..."
    fi
else
    echo "[entrypoint] No contract address found - deploying EvidenceLog contract..."
fi

if [ "$DEPLOY_NEEDED" = "1" ]; then
    for i in $(seq 1 20); do
        python -c "
from web3 import Web3
import os, sys
w3 = Web3(Web3.HTTPProvider(os.getenv('WEB3_PROVIDER','http://ganache:8155')))
sys.exit(0 if w3.is_connected() else 1)
" && break
        echo "[entrypoint] Waiting for Ganache... ($i/20)"
        sleep 3
    done
    python contracts/deploy_contract.py && echo "[entrypoint] Contract deployed" || echo "[entrypoint] Contract deploy failed - blockchain logging will be disabled"
fi

exec uvicorn backend.main:app --host 0.0.0.0 --port 8153
