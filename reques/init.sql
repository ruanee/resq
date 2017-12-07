create extension "uuid-ossp";
create extension pgcrypto;

-- log db
--drop table public.request_log;
CREATE TABLE public.request_log
(
  id character varying(255) NOT NULL,
  user_name character varying(255),
  session_id character varying(255),
  url character varying(4000),
  request_date timestamp with time zone,
  remote_addr character varying(255),
  consumption bigint,
  params text,
  msg text,
  type character varying(31),
  end_date timestamp with time zone,
  CONSTRAINT request_log_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE public.questions
(
  id character varying(255) NOT NULL,
  type character varying(255),
  title text,
  code text,
  choices jsonb,
  answer jsonb,
  user_name character varying(255),
  create_date timestamp with time zone,
  mod_date timestamp with time zone,
  active character varying(1),
  CONSTRAINT questions_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE public.paper
(
  id character varying(255) NOT NULL,
  type character varying(255),
  title text,
  questions jsonb,
  user_name character varying(255),
  create_date timestamp with time zone,
  mod_date timestamp with time zone,
  active character varying(1),
  CONSTRAINT paper_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


--drop TABLE exam;
CREATE TABLE public.exam
(
  paper character varying(255),
  token text,
  answer jsonb,
  user_name text,
  mod_date timestamp with time zone,
  create_date timestamp with time zone,
  CONSTRAINT exam_pkey PRIMARY KEY (paper,token)
)
WITH (
  OIDS=FALSE
);

---users
CREATE TABLE public.users
(
  id character varying(255) NOT NULL,
  type character varying(255),
  status text,
  user_name text,
  password text,
  roles text,
  create_date timestamp with time zone,
  mod_date timestamp with time zone,
  active character varying(1),
  CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users ADD CONSTRAINT users_user_name UNIQUE (user_name);
/**

select * from request_log order by request_date desc limit 100;

update users set roles='Software Enginerring;Java;sql;SSH;NTC' where user_name ='test';

update users set status ='Active' where user_name='test';

select encode(hmac('miaomiao', '123', 'sha256'), 'hex'),
		encode(hmac('miaomiao', 'pass@123', 'sha256'), 'hex');
		
INSERT INTO public.users( id, type, status, user_name,  create_date, mod_date, active)
    VALUES (uuid_generate_v4(), 'main','Active', 'admin',  now(), now(),'T');

update users set password='ce6f0af232270c52eace2ec2ac949e93f4f85cf291f8d9913f5543e37838f6c3' where user_name='admin';
 
 INSERT INTO public.users( id, type, status, user_name,  create_date, mod_date, active)
    VALUES (uuid_generate_v4(), 'test','Active', 'test',  now(), now(),'T');

update users set password='4c61e0aa42c9fc5c52a69909c8c0b4dcfc14b53112c988ff4a29753ed3b2a7b3' where user_name='test';
 */
--drop TABLE public.tempquest;
--delete from tempquest;
CREATE TABLE public.tempquest
(
  type text,
  chapter text,
  code text,
  title text,
  item1 text,
  item2 text,
  item3 text,
  item4 text,
  item5 text,
  item6 text,
  item7 text,
  item8 text,
  item9 text,
  answer text,
  explains text default '',
  create_date timestamp with time zone default now()
)
WITH (
  OIDS=FALSE
);
/**

delete  from paper;
delete  from questions;

select distinct type from questions;
update questions set type='01 Scope of Software Engineerin' where position('01' in type)>=1;

COPY public.tempquest(type,code,answer,title,item1,item2,item3,item4,item5,item6,item7,item8,item9)
 FROM 'F:/work/quest/samples/data.csv' WITH (FORMAT csv);
 
 insert into questions(id, type,code, title, choices, answer,active, create_date, mod_date)
(select uuid_generate_v4(),type,code,title, jsonb_object('{A,B,C,D,E,F,G,H,I}'::text[],ARRAY[item1,item2,item3,item4,item5,item6,item7,item8,item9]) choices,
	jsonb_object('{ans,explain}'::text[],ARRAY[answer,explains]) answers,'T',now(),now()
	from public.tempquest where title!='﻿title')
	
alter table public.users add column roles text;
alter table public.questions add column chapter text;
alter table public.paper add column chapter text;
update paper set type='Software Enginerring',chapter=title;
update questions set chapter=type, type='Software Enginerring' where create_date<'2017-11-29';
update paper set chapter=title;

delete from paper where chapter is null

select distinct code,type,chapter from questions where (type,chapter) not in (select type,chapter from paper)

*/