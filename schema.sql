--
-- PostgreSQL database dump
--

\restrict ntZSj0FY8V5fzsPOAU80YVz0x01H23egXi970rtZS6kYCabyCI5MgDubcykbdqI

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-25 20:37:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.providers (
    providerid integer NOT NULL,
    registeredname character varying(255) NOT NULL,
    hashedpassword character varying(255) NOT NULL,
    salt character varying(64)
);


ALTER TABLE public.providers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: providers_providerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.providers_providerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.providers_providerid_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 221
-- Name: providers_providerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.providers_providerid_seq OWNED BY public.providers.providerid;


--
-- TOC entry 224 (class 1259 OID 16417)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    requestid integer NOT NULL,
    providerid integer,
    companyname character varying(255) NOT NULL,
    userid integer,
    datarequests jsonb NOT NULL,
    status character varying(50) NOT NULL
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16416)
-- Name: requests_requestid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_requestid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_requestid_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 223
-- Name: requests_requestid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_requestid_seq OWNED BY public.requests.requestid;


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    email character varying(255) NOT NULL,
    hashedpassword character varying(255) NOT NULL,
    salt character varying(64)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 4867 (class 2604 OID 16406)
-- Name: providers providerid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.providers ALTER COLUMN providerid SET DEFAULT nextval('public.providers_providerid_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 16420)
-- Name: requests requestid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN requestid SET DEFAULT nextval('public.requests_requestid_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 16392)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 4874 (class 2606 OID 16413)
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (providerid);


--
-- TOC entry 4876 (class 2606 OID 16415)
-- Name: providers providers_registeredname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_registeredname_key UNIQUE (registeredname);


--
-- TOC entry 4878 (class 2606 OID 16428)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (requestid);


--
-- TOC entry 4870 (class 2606 OID 16401)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4872 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 4879 (class 2606 OID 16429)
-- Name: requests requests_providerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_providerid_fkey FOREIGN KEY (providerid) REFERENCES public.providers(providerid);


--
-- TOC entry 4880 (class 2606 OID 16434)
-- Name: requests requests_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


-- Completed on 2026-01-25 20:37:26

--
-- PostgreSQL database dump complete
--

\unrestrict ntZSj0FY8V5fzsPOAU80YVz0x01H23egXi970rtZS6kYCabyCI5MgDubcykbdqI

