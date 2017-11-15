create extension "uuid-ossp";

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

--drop TABLE public.tempquest;
CREATE TABLE public.tempquest
(
  title text,
  item1 text,
  item2 text,
  item3 text,
  item4 text,
  item5 text,
  answer text,
  explains text default '',
  type text,
  create_date timestamp with time zone default now()
)
WITH (
  OIDS=FALSE
);
/**
COPY public.tempquest(title,item1,item2,item3,item4,item5,answer)
 FROM 'F:/work/quest/SETEST/SETEST.csv' WITH (FORMAT csv);
 
 insert into questions(id, type, title, choices, answer,active, create_date, mod_date)
(select uuid_generate_v4(),'SETEST',title, jsonb_object('{A,B,C,D,E}'::text[],ARRAY[item1,item2,item3,item4,item5]) choices,
	jsonb_object('{ans,explain}'::text[],ARRAY[answer,explains]) answers,'T',now(),now()
	from public.tempquest where title!='﻿title')
*/