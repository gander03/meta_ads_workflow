# Navigate to the directory of the script
cd "$(dirname "$0")"

chmod +x run_app.sh
chmod +x run_frontend.sh
chmod +x run_backend.sh
source ~/.bash_profile

# Open a new Terminal window and run run_frontend.sh from the same directory
osascript <<EOF
tell application "Terminal"
    do script "cd '$(pwd)'; ./run_frontend.sh"
end tell
EOF


osascript <<EOF
tell application "Terminal"
    do script "cd '$(pwd)'; ./run_backend.sh"
end tell
EOF
