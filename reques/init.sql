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
  answer jsonb,
  user_name character varying(255),
  mod_date timestamp with time zone,
  CONSTRAINT questions_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);