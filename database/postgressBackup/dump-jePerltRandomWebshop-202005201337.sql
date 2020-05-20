--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-20 13:37:10 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2953 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 40984)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    phonenumber text NOT NULL,
    name character varying(70) NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 40992)
-- Name: creditcards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcards (
    cardnumber text NOT NULL,
    verificationcode integer NOT NULL,
    expirationdate character varying NOT NULL,
    fk_account text NOT NULL
);


ALTER TABLE public.creditcards OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 41007)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    amount real NOT NULL,
    date date NOT NULL,
    approved boolean DEFAULT false,
    fk_creditcards text NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 41005)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- TOC entry 2954 (class 0 OID 0)
-- Dependencies: 204
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- TOC entry 2808 (class 2604 OID 41010)
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- TOC entry 2944 (class 0 OID 40984)
-- Dependencies: 202
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (phonenumber, name) FROM stdin;
\.


--
-- TOC entry 2945 (class 0 OID 40992)
-- Dependencies: 203
-- Data for Name: creditcards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcards (cardnumber, verificationcode, expirationdate, fk_account) FROM stdin;
\.


--
-- TOC entry 2947 (class 0 OID 41007)
-- Dependencies: 205
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, amount, date, approved, fk_creditcards) FROM stdin;
\.


--
-- TOC entry 2955 (class 0 OID 0)
-- Dependencies: 204
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- TOC entry 2811 (class 2606 OID 40991)
-- Name: accounts accounts_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pk PRIMARY KEY (phonenumber);


--
-- TOC entry 2813 (class 2606 OID 40999)
-- Name: creditcards creditcards_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcards
    ADD CONSTRAINT creditcards_pk PRIMARY KEY (cardnumber);


--
-- TOC entry 2815 (class 2606 OID 41012)
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);


--
-- TOC entry 2816 (class 2606 OID 41000)
-- Name: creditcards creditcards_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcards
    ADD CONSTRAINT creditcards_fk FOREIGN KEY (fk_account) REFERENCES public.accounts(phonenumber) ON DELETE CASCADE;


--
-- TOC entry 2817 (class 2606 OID 41017)
-- Name: transactions transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_fk FOREIGN KEY (fk_creditcards) REFERENCES public.creditcards(cardnumber);


-- Completed on 2020-05-20 13:37:10 CEST

--
-- PostgreSQL database dump complete
--

