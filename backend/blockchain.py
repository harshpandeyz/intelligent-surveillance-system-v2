import os
import json
import hashlib
from dotenv import load_dotenv

load_dotenv()

WEB3_PROVIDER = os.getenv("WEB3_PROVIDER", "http://127.0.0.1:8155")
PRIVATE_KEY = os.getenv("GANACHE_PRIVATE_KEY")

CHAIN_DIR = os.path.join(os.path.dirname(__file__), "chain")
ABI_PATH = os.path.join(CHAIN_DIR, "evidence_abi.json")
ADDR_PATH = os.path.join(CHAIN_DIR, "evidence_address.txt")

_w3 = None
_acct = None
_contract = None
_blockchain_available = False


def _init_blockchain():
    global _w3, _acct, _contract, _blockchain_available
    try:
        from web3 import Web3
        w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))
        if not w3.is_connected():
            print("[BLOCKCHAIN] Ganache not reachable — blockchain logging disabled.")
            return
        acct = w3.eth.account.from_key(PRIVATE_KEY)
        with open(ABI_PATH, "r") as f:
            abi = json.load(f)
        contract_address = open(ADDR_PATH).read().strip()
        contract = w3.eth.contract(address=contract_address, abi=abi)
        _w3, _acct, _contract = w3, acct, contract
        _blockchain_available = True
        print("[BLOCKCHAIN] Connected to Ganache ✅")
    except Exception as e:
        print(f"[BLOCKCHAIN] Init failed (blockchain disabled): {e}")


def ensure_blockchain_ready():
    """Lazy retry: attempt to connect if not already connected."""
    global _blockchain_available
    if not _blockchain_available:
        _init_blockchain()


# Attempt connection at import time; failure is non-fatal
try:
    _init_blockchain()
except Exception as _e:
    print(f"[BLOCKCHAIN] Startup init skipped: {_e}")


def compute_sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            h.update(data)
    return h.hexdigest()


def _signed_raw_transaction(signed_tx):
    return getattr(signed_tx, "raw_transaction", None) or getattr(signed_tx, "rawTransaction")


def log_event_on_chain(hash_hex: str, metadata: str, enc_file_path: str = None):
    ensure_blockchain_ready()   # lazy retry in case Ganache wasn't ready at boot
    if not _blockchain_available:
        raise RuntimeError("Blockchain not available — Ganache offline or misconfigured.")

    if hash_hex.startswith("0x"):
        hash_hex = hash_hex[2:]

    try:
        hash_bytes = bytes.fromhex(hash_hex)
    except ValueError:
        if enc_file_path and os.path.exists(enc_file_path):
            hash_hex = compute_sha256_file(enc_file_path)
            hash_bytes = bytes.fromhex(hash_hex)
        else:
            raise ValueError(f"Invalid hex hash and no valid file to regenerate: {hash_hex}")

    nonce = _w3.eth.get_transaction_count(_acct.address)
    tx = _contract.functions.logEvent(hash_bytes, metadata).build_transaction({
        "from": _acct.address,
        "nonce": nonce,
        "gas": 500000,
        "gasPrice": _w3.to_wei("20", "gwei"),
    })
    signed = _acct.sign_transaction(tx)
    tx_hash = _w3.eth.send_raw_transaction(_signed_raw_transaction(signed))
    receipt = _w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt.transactionHash.hex()
