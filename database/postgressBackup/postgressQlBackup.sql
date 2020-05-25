PGDMP         (                x           jePerltRandomWebshop    12.2    12.2 $    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    40983    jePerltRandomWebshop    DATABASE     �   CREATE DATABASE "jePerltRandomWebshop" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
 &   DROP DATABASE "jePerltRandomWebshop";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3            �            1255    41051    update_name_log()    FUNCTION     �  CREATE FUNCTION public.update_name_log() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
name_change int;
BEGIN
	IF NEW.name <> OLD.name THEN
		 INSERT INTO namelog (oldname, fk_account)
		 VALUES(old.name, old.phonenumber);
		 SELECT COUNT(*) into name_change from namelog n2 where n2.fk_account = old.phonenumber;
	if name_change > 2 then
		update accounts set suspicious  = true where phonenumber  = old.phonenumber;
	end if;
		
	END IF;

	RETURN NEW;
END;

$$;
 (   DROP FUNCTION public.update_name_log();
       public          postgres    false    3            �            1259    40984    accounts    TABLE       CREATE TABLE public.accounts (
    phonenumber text NOT NULL,
    name character varying(70) NOT NULL,
    suspicious boolean DEFAULT false NOT NULL,
    CONSTRAINT "checkIfPhoneNumber" CHECK ((phonenumber ~ '[0-9][0-9][0-9][0-9][0-9][0-9][0-9]'::text))
);
    DROP TABLE public.accounts;
       public         heap    postgres    false    3            �           0    0    TABLE accounts    ACL     |   GRANT SELECT,INSERT,UPDATE ON TABLE public.accounts TO "jePerltUser";
GRANT ALL ON TABLE public.accounts TO "jePerltAdmin";
          public          postgres    false    202            �            1259    40992    creditcards    TABLE     3  CREATE TABLE public.creditcards (
    cardnumber text NOT NULL,
    verificationcode integer NOT NULL,
    expirationdate text NOT NULL,
    fk_account text NOT NULL,
    CONSTRAINT "checkCreditcardLength" CHECK ((cardnumber ~ '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'::text)),
    CONSTRAINT checkexpirationdate CHECK ((expirationdate ~ '[0-9][0-9]-[0-9][0-9]'::text)),
    CONSTRAINT checkverificationlenghlarger CHECK ((verificationcode <= 999)),
    CONSTRAINT checkverificationlengthlarger CHECK ((verificationcode >= 111))
);
    DROP TABLE public.creditcards;
       public         heap    postgres    false    3            �           0    0    TABLE creditcards    ACL     �   GRANT SELECT,INSERT,UPDATE ON TABLE public.creditcards TO "jePerltUser";
GRANT ALL ON TABLE public.creditcards TO "jePerltAdmin";
          public          postgres    false    203            �            1259    41036    namelog    TABLE     �   CREATE TABLE public.namelog (
    id integer NOT NULL,
    oldname character varying(70) NOT NULL,
    fk_account text NOT NULL,
    date date DEFAULT now()
);
    DROP TABLE public.namelog;
       public         heap    postgres    false    3            �           0    0    TABLE namelog    ACL     5   GRANT ALL ON TABLE public.namelog TO "jePerltAdmin";
          public          postgres    false    207            �            1259    41034    namelog_id_seq    SEQUENCE     �   CREATE SEQUENCE public.namelog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.namelog_id_seq;
       public          postgres    false    3    207            �           0    0    namelog_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.namelog_id_seq OWNED BY public.namelog.id;
          public          postgres    false    206            �            1259    41007    transactions    TABLE     �   CREATE TABLE public.transactions (
    id integer NOT NULL,
    amount real NOT NULL,
    date date DEFAULT now() NOT NULL,
    approved boolean DEFAULT false,
    fk_creditcards text NOT NULL,
    webshoporderid character varying(25) NOT NULL
);
     DROP TABLE public.transactions;
       public         heap    postgres    false    3            �           0    0    TABLE transactions    ACL     �   GRANT SELECT,INSERT,UPDATE ON TABLE public.transactions TO "jePerltUser";
GRANT ALL ON TABLE public.transactions TO "jePerltAdmin";
          public          postgres    false    205            �            1259    41005    transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transactions_id_seq;
       public          postgres    false    3    205            �           0    0    transactions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
          public          postgres    false    204            �           0    0    SEQUENCE transactions_id_seq    ACL     C   GRANT ALL ON SEQUENCE public.transactions_id_seq TO "jePerltUser";
          public          postgres    false    204            	           2604    41039 
   namelog id    DEFAULT     h   ALTER TABLE ONLY public.namelog ALTER COLUMN id SET DEFAULT nextval('public.namelog_id_seq'::regclass);
 9   ALTER TABLE public.namelog ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    207    206    207                       2604    41010    transactions id    DEFAULT     r   ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);
 >   ALTER TABLE public.transactions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204    205            �          0    40984    accounts 
   TABLE DATA           A   COPY public.accounts (phonenumber, name, suspicious) FROM stdin;
    public          postgres    false    202            �          0    40992    creditcards 
   TABLE DATA           _   COPY public.creditcards (cardnumber, verificationcode, expirationdate, fk_account) FROM stdin;
    public          postgres    false    203            �          0    41036    namelog 
   TABLE DATA           @   COPY public.namelog (id, oldname, fk_account, date) FROM stdin;
    public          postgres    false    207            �          0    41007    transactions 
   TABLE DATA           b   COPY public.transactions (id, amount, date, approved, fk_creditcards, webshoporderid) FROM stdin;
    public          postgres    false    205            �           0    0    namelog_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.namelog_id_seq', 13, true);
          public          postgres    false    206            �           0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transactions_id_seq', 20, true);
          public          postgres    false    204                       2606    40991    accounts accounts_pk 
   CONSTRAINT     [   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pk PRIMARY KEY (phonenumber);
 >   ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pk;
       public            postgres    false    202                       2606    40999    creditcards creditcards_pk 
   CONSTRAINT     `   ALTER TABLE ONLY public.creditcards
    ADD CONSTRAINT creditcards_pk PRIMARY KEY (cardnumber);
 D   ALTER TABLE ONLY public.creditcards DROP CONSTRAINT creditcards_pk;
       public            postgres    false    203                       2606    41044    namelog namelog_pk 
   CONSTRAINT     P   ALTER TABLE ONLY public.namelog
    ADD CONSTRAINT namelog_pk PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.namelog DROP CONSTRAINT namelog_pk;
       public            postgres    false    207                       2606    41012    transactions transactions_pk 
   CONSTRAINT     Z   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pk;
       public            postgres    false    205                       2620    41059    accounts updatenametrigger    TRIGGER     �   CREATE TRIGGER updatenametrigger AFTER UPDATE OF name ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_name_log();
 3   DROP TRIGGER updatenametrigger ON public.accounts;
       public          postgres    false    202    208    202                       2606    41000    creditcards creditcards_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.creditcards
    ADD CONSTRAINT creditcards_fk FOREIGN KEY (fk_account) REFERENCES public.accounts(phonenumber) ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.creditcards DROP CONSTRAINT creditcards_fk;
       public          postgres    false    2828    203    202                       2606    41045    namelog namelog_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.namelog
    ADD CONSTRAINT namelog_fk FOREIGN KEY (fk_account) REFERENCES public.accounts(phonenumber);
 <   ALTER TABLE ONLY public.namelog DROP CONSTRAINT namelog_fk;
       public          postgres    false    202    2828    207                       2606    41017    transactions transactions_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_fk FOREIGN KEY (fk_creditcards) REFERENCES public.creditcards(cardnumber);
 F   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_fk;
       public          postgres    false    203    2830    205            �   P   x�326Cά���"��,�4.#KKc΀Ԣ��.#Kc�@Jb1�kdbfbbf��֤TZ���Z������ ���      �   M   x�uͱ�0���%\d���s��*���\���&Ggw݈���,w����S$"ҵ\�3(͞��>Tud�'�      �   V   x�m�1�0 ��RCc��p,����O��Mn�v?/��Ŕ���͉3�����p3�ָ3���Gkl*����H����M��/,W      �   c   x��̱1�z9�!t���\���n�r�����R�/�4O��J�uU��r�%H#���l�Q�)�>��
r��l���ؽg,,��~1��y+$     