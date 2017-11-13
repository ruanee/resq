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
  code text,
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