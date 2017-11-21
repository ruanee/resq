The project is created on Nodejs 8.9.1 (Nodejs 6 is not supported as async function).

--just run following command after download
npm install

--There is globals.js, setup db connection url
install postgresql DB 9.6, create a db then run init.sql, after we can start

--start server
set DEBUG=ques:* & npm start
or
npm start

--- install nodejs
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

--- install postgresql
sudo add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main"
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install postgresql-9.6

---- config postgres
          a. login in use specify version(list all version : pg_lsclusters)
          sudo -u postgres psql --cluster 9.6/main
          sudo -u postgres psql --cluster 10/fm
         
          b. modify default postgres password
          ALTER USER postgres WITH PASSWORD 'postgres';

          c. remote access
          sudo gedit /etc/postgresql/9.6/main/postgresql.conf
          sudo gedit /etc/postgresql/10/fm/postgresql.conf
         
          #listen_addresses = 'localhost' --> listen_addresses = '*'

          sudo gedit /etc/postgresql/9.6/main/pg_hba.conf
          sudo gedit /etc/postgresql/10/fm/pg_hba.conf

          add one line under ipv4(192.168.126.0/24)

          restart server:
          sudo service postgresql restart 9.6
          
--- install git
sudo apt install git

git config --global user.email "you@example.com"
git config --global user.name "Your Name" 

git init --bare /path/to/repository

git clone hostname:/path/to/repository