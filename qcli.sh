wget https://desktop-release.q.us-east-1.amazonaws.com/latest/amazon-q.deb
sudo apt-get install -f
sudo dpkg -i amazon-q.deb
sudo apt update
sudo apt upgrade
sudo apt --fix-broken install                
