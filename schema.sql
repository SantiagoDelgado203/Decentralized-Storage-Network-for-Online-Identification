--
-- PostgreSQL database dump
--

\restrict mkLWr2aI8KOeAhjHhjImhTNPqCGzI04hgJafdKeqUHtqu0NBseRqoujhYrGEwY0

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-08 22:51:59

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
-- TOC entry 219 (class 1259 OID 16440)
-- Name: providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.providers (
    providerid uuid DEFAULT gen_random_uuid() NOT NULL,
    registeredname character varying(255) NOT NULL,
    hashedpassword character varying(255) NOT NULL,
    provideremail character varying(255) NOT NULL
);


ALTER TABLE public.providers OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16449)
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
-- Dependencies: 220
-- Name: providers_providerid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.providers_providerid_seq OWNED BY public.providers.providerid;


--
-- TOC entry 221 (class 1259 OID 16450)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    requestid uuid DEFAULT gen_random_uuid() NOT NULL,
    providerid uuid,
    companyname character varying(255) NOT NULL,
    userid uuid,
    datarequests jsonb NOT NULL,
    status character varying(50) NOT NULL
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16460)
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
-- Dependencies: 222
-- Name: requests_requestid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_requestid_seq OWNED BY public.requests.requestid;


--
-- TOC entry 223 (class 1259 OID 16461)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    hashedpassword character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16470)
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
-- Dependencies: 224
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 4870 (class 2606 OID 16472)
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (providerid);


--
-- TOC entry 4872 (class 2606 OID 16474)
-- Name: providers providers_registeredname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_registeredname_key UNIQUE (registeredname);


--
-- TOC entry 4874 (class 2606 OID 16476)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (requestid);


--
-- TOC entry 4876 (class 2606 OID 16478)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4878 (class 2606 OID 16480)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 4879 (class 2606 OID 16481)
-- Name: requests requests_providerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_providerid_fkey FOREIGN KEY (providerid) REFERENCES public.providers(providerid);


--
-- TOC entry 4880 (class 2606 OID 16486)
-- Name: requests requests_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


-- Completed on 2026-02-08 22:52:00

--
-- PostgreSQL database dump complete
--

\unrestrict mkLWr2aI8KOeAhjHhjImhTNPqCGzI04hgJafdKeqUHtqu0NBseRqoujhYrGEwY0

