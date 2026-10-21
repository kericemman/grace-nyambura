# Hostinger VPS deployment

This project is prepared for this production layout:

- Public React site: `https://gracenyambura.com`
- Optional public alias: `https://www.gracenyambura.com`
- Express API: `https://app.gracenyambura.com`
- API process: `127.0.0.1:5003`, reachable only through Nginx
- Database: MongoDB Atlas
- Media: Cloudinary
- Transactional email: Resend

Commands below assume Ubuntu 24.04 LTS and a Git repository containing this project. Replace placeholders such as `YOUR_VPS_IP`, `YOUR_GIT_REPOSITORY`, and email addresses before running them.

## 1. Provision the VPS

1. In Hostinger hPanel, create or open the VPS.
2. Install **Ubuntu 24.04 LTS (plain OS)**.
3. Add your SSH public key in hPanel.
4. Record the VPS public IPv4 address.
5. Take a snapshot before making major infrastructure changes.

## 2. Point DNS to the VPS

In the DNS zone for `gracenyambura.com`, create these records:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `YOUR_VPS_IP` | 300 initially |
| A | `www` | `YOUR_VPS_IP` | 300 initially |
| A | `app` | `YOUR_VPS_IP` | 300 initially |

Remove conflicting A or AAAA records for these names. Wait until all three names resolve to the VPS:

```bash
dig +short gracenyambura.com
dig +short www.gracenyambura.com
dig +short app.gracenyambura.com
```

Do not request certificates until DNS resolves correctly.

## 3. Create a non-root administrator

Connect initially as root using Hostinger's web terminal or SSH:

```bash
ssh root@YOUR_VPS_IP
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Open a second terminal and confirm `ssh deploy@YOUR_VPS_IP` works before changing SSH settings.

Then edit `/etc/ssh/sshd_config` and set:

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Validate and reload SSH:

```bash
sudo sshd -t
sudo systemctl reload ssh
```

Keep the existing root session open until the new login is confirmed.

## 4. Patch the server and configure firewalls

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx ufw fail2ban unattended-upgrades curl ca-certificates
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo systemctl enable --now fail2ban
sudo systemctl enable --now unattended-upgrades
```

In Hostinger's managed VPS firewall, allow inbound TCP ports `22`, `80`, and `443`. Do not expose port `5003` or MongoDB ports.

## 5. Install Node.js 22

Install the current Node.js 22 LTS release from NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
node --version
npm --version
```

The Node version must satisfy the project's `>=20.19` requirement.

## 6. Create the application account and directory

```bash
sudo useradd --system --home /var/www/grace --shell /usr/sbin/nologin graceapp
sudo usermod -aG graceapp www-data
sudo mkdir -p /var/www/grace /etc/grace
sudo chown deploy:graceapp /var/www/grace
sudo chmod 2750 /var/www/grace
```

Clone the repository as the `deploy` user:

```bash
git clone YOUR_GIT_REPOSITORY /var/www/grace/current
cd /var/www/grace/current
sudo chown -R deploy:graceapp /var/www/grace/current
sudo find /var/www/grace/current -type d -exec chmod 2750 {} \;
sudo find /var/www/grace/current -type f -exec chmod 0640 {} \;
```

For a private repository, configure a read-only Git deploy key instead of storing a GitHub password on the VPS.

## 7. Configure external services

### MongoDB Atlas

1. Create a dedicated production database user with access only to the `grace` database.
2. Generate a long unique password and URL-encode characters used inside the connection URI.
3. In Atlas Network Access, allow the VPS public IP as `/32`.
4. Do not use `0.0.0.0/0` for long-term production access.

### Cloudinary

Use a production Cloudinary cloud and copy its cloud name, API key, and API secret. Keep the API secret only in the server environment file.

### Resend

1. Add and verify `gracenyambura.com` in Resend.
2. Add Resend's SPF and DKIM DNS records exactly as shown in the Resend dashboard.
3. Use a verified sender such as `Grace Nyambura <hello@gracenyambura.com>`.
4. Send a test message and confirm it passes SPF and DKIM before launch.

## 8. Create production secrets and environment variables

Generate three different secrets:

```bash
openssl rand -hex 64
openssl rand -hex 64
openssl rand -hex 64
```

Copy the template, then edit it as root:

```bash
sudo cp /var/www/grace/current/server/.env.production.example /etc/grace/grace-api.env
sudo nano /etc/grace/grace-api.env
sudo chown root:graceapp /etc/grace/grace-api.env
sudo chmod 0640 /etc/grace/grace-api.env
```

Required production values include MongoDB, the three random secrets, Cloudinary, Resend, and the admin notification email. Keep:

```env
NODE_ENV=production
HOST=127.0.0.1
PORT=5003
CLIENT_ORIGIN=https://gracenyambura.com
COOKIE_DOMAIN=.gracenyambura.com
```

Never commit `/etc/grace/grace-api.env`, paste it into chat, or place secrets in `client/.env.production`.

## 9. Build the application

The frontend API URL is public build-time configuration:

```bash
cd /var/www/grace/current
cp client/.env.production.example client/.env.production
npm ci
npm run build
npm test -w server
sudo chown -R deploy:graceapp /var/www/grace/current
sudo find /var/www/grace/current -type d -exec chmod 2750 {} \;
sudo find /var/www/grace/current -type f -exec chmod 0640 {} \;
```

Do not run Vite's development server in production. Nginx serves `client/dist` directly.

## 10. Install the API service

```bash
sudo cp deploy/systemd/grace-api.service /etc/systemd/system/grace-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now grace-api
sudo systemctl status grace-api --no-pager
sudo journalctl -u grace-api -n 100 --no-pager
```

Confirm the process listens only on loopback:

```bash
sudo ss -lntp | grep 5003
curl http://127.0.0.1:5003/api/v1/health
```

The listening address must be `127.0.0.1:5003`, not `0.0.0.0:5003`.

## 11. Install Nginx

```bash
sudo cp deploy/nginx/gracenyambura.conf /etc/nginx/sites-available/gracenyambura.conf
sudo ln -s /etc/nginx/sites-available/gracenyambura.conf /etc/nginx/sites-enabled/gracenyambura.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Restart Nginx once after adding `www-data` to the application group so the worker processes receive the new group membership:

```bash
sudo systemctl restart nginx
```

Before HTTPS is enabled, verify:

```bash
curl -I http://gracenyambura.com
curl http://app.gracenyambura.com/api/v1/health
```

## 12. Enable HTTPS

After DNS propagation:

```bash
sudo certbot --nginx \
  -d gracenyambura.com \
  -d www.gracenyambura.com \
  -d app.gracenyambura.com
sudo certbot renew --dry-run
```

Choose HTTP-to-HTTPS redirection when prompted. After Certbot updates Nginx, add this header inside each HTTPS `server` block:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Then validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Do not add HSTS until all three hostnames work correctly over HTTPS.

## 13. Create or verify the administrator

Set `BOOTSTRAP_ADMIN_EMAIL` and a unique password of at least 12 characters in `/etc/grace/grace-api.env`, then run:

```bash
cd /var/www/grace/current
sudo bash -c 'set -a; source /etc/grace/grace-api.env; set +a; npm run bootstrap:admin -w server'
```

After the administrator exists, remove `BOOTSTRAP_ADMIN_PASSWORD` from the environment file and restart the API:

```bash
sudo nano /etc/grace/grace-api.env
sudo systemctl restart grace-api
```

## 14. Verify the production site

Run these checks:

```bash
curl -I https://gracenyambura.com
curl -I https://www.gracenyambura.com
curl https://app.gracenyambura.com/api/v1/health
curl -I https://app.gracenyambura.com/api/v1/auth/session
```

Then verify in a browser:

1. Public pages and direct refreshes load without 404 errors.
2. Admin login works at `https://gracenyambura.com/admin/login`.
3. The browser sends API requests only to `https://app.gracenyambura.com`.
4. Admin create, update, upload, and logout actions work; this confirms the shared CSRF cookie configuration.
5. Contact, partnership, testimonial, and subscription forms save successfully.
6. Confirmation and admin notification emails arrive.
7. The unsubscribe link opens the confirmation page and changes the subscriber status.
8. Uploaded images render from Cloudinary.
9. Cookies named `grace_access` and `grace_refresh` are `Secure`, `HttpOnly`, and `SameSite=Strict`.

## 15. Deploy future updates

```bash
cd /var/www/grace/current
git fetch --prune
git checkout main
git pull --ff-only
npm ci
npm run build
npm test -w server
sudo systemctl restart grace-api
sudo systemctl reload nginx
curl https://app.gracenyambura.com/api/v1/health
```

For safer releases, take a VPS snapshot before dependency or infrastructure changes. If a release fails, check `journalctl -u grace-api`, Nginx's error log, and the browser network panel before rolling back.

## 16. Ongoing operations

- Apply Ubuntu security updates regularly and reboot when the kernel requires it.
- Review `sudo journalctl -u grace-api` and `/var/log/nginx/error.log`.
- Keep MongoDB Atlas backups or point-in-time recovery enabled.
- Keep a documented restore test, not only a backup schedule.
- Rotate application, database, Cloudinary, and Resend credentials after suspected exposure.
- Renew and test certificates; Certbot installs a renewal timer automatically.
- Review admin accounts and remove inactive access.
- Raise DNS TTL after the launch is stable.
