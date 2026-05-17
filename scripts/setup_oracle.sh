#!/bin/bash
# ============================================================
#  MOB SURVEILLANCE SYSTEM — Oracle Cloud VM setup
#  Ubuntu 22.04 ARM (Ampere A1) — run ONCE on the VM
#  Usage: chmod +x scripts/setup_oracle.sh && ./scripts/setup_oracle.sh
# ============================================================

set -e

echo "==> Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

echo "==> Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Adding current user to docker group..."
sudo usermod -aG docker $USER

echo "==> Opening firewall ports 80 and 443..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

echo ""
echo "✅ Done! Log out, log back in, upload your project, then run:"
echo "   docker compose -f docker-compose.prod.yml up -d"
