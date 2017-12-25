The project is created on Nodejs 8.9.1 (Nodejs 6 is not supported as async function).

--just run following command after download
npm install

--There is globals.js, setup db connection url
install postgresql DB 9.6, create a db then run init.sql, after we can start

--start server
set DEBUG=ques:* & npm start
or
npm start

cd /root/node/resq/reques

curl localhost:3000

killall -KILL node


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

-- recovery db
sudo -u postgres createdb test
sudo -u postgres psql quest
pg_restore -h localhost -p 5432 -U postgres -d test -v "/root/pg/db.backup"

-- backup db
sudo su - dbadmin
--pg_restore --dbname cis_new --verbose /home/myname/cis.backup
--pg_dump quest > /root/pg/quest6.backup
--pg_dump quest > /home/dbadmin/quest6.backup
pg_dump -h localhost -p 5432 -U "dbadmin" -F c -b -v -f /home/dbadmin/quest7.backup quest

--- install git
sudo apt install git

git config --global user.email "xiaogang.ruan@gmail.com"
git config --global user.name "Xiao Gang" 

https://help.ubuntu.com/community/PostgreSQL
https://filezilla-project.org/download.php?type=client

git init --bare /root/node

git clone https://github.com/ruanee/resq.git

ab -n 100 -c 10 http://localhost:3000/
ab -n 1000 -c 100 -C connect.sid=s%3AHQ8DnnX_DEkfzafYuY9_N4uHIww2FeWl.Qu9i5Q%2F9wgaZl19XR7vHJEkwPcKMcQHYMjrXw0p3s9I http://localhost:3000/users/sessions
ab -n 10000 -c 300 -C connect.sid=s%3AHQ8DnnX_DEkfzafYuY9_N4uHIww2FeWl.Qu9i5Q%2F9wgaZl19XR7vHJEkwPcKMcQHYMjrXw0p3s9I "http://localhost:3000/exam/go?id=55f046d4-5628-4ff2-a0d9-264feb7dacbb&page=86&direction=next&answer=D&anc=D.the%20IP%20address%20of%20a%20node&qid=6296b2cf-1caa-444a-b6b9-9a6335432786&token=cea6b449-77b9-c16b-2aef-38a9f4617dbf"

ab -n 300 -c 30 -C JSESSIONID=22D57631E29654EA2FB6BA21B8DC686B "http://192.168.126.88:9990/app/fe/document/so/regular/list/show"

ab -n 100 -c 10 -H "Cooikie:key1=olfsk=olfsk5195140348348259; hblid=7ELuxmeyU4WusTnO3m39N0H00JEA3rLD; optimizelyEndUserId=oeu1505378624532r0.6687514706645463; _ga=GA1.1.1533015577.1484115212; connect.sid=s%3Am4HWDjPcuSkEODrXsOLHtW97U-UYVsf7.x5Z7icdUCixlNRsf%2FJFkWLGGhx6O3ej4PAgkRHjRo3o" http://localhost:3000/users/sessions

ab -n 100 -c 10 http://www.diandianguo.net/
ab -n 100 -c 10 -H "Cooikie:key1=s%3Am4HWDjPcuSkEODrXsOLHtW97U-UYVsf7.x5Z7icdUCixlNRsf%2FJFkWLGGhx6O3ej4PAgkRHjRo3o" "http://www.diandianguo.net"
ab -n 500 -c 20 -C connect.sid=s%3APCbXabIXRw4omm2_QF5XSQ8CSVBKVimc.JQdiKhxSspopCLUE%2BmwK%2BrwcVJ6sFiiINs%2Biubzx4P4 "http://www.diandianguo.net/exam/go?id=55f046d4-5628-4ff2-a0d9-264feb7dacbb&page=86&direction=next&answer=D&anc=D.the%20IP%20address%20of%20a%20node&qid=6296b2cf-1caa-444a-b6b9-9a6335432786&token=a5c8f3a9-137d-2029-ea27-2d9c6535ab4c"


connect.sid
