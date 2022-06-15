SELECT
    CC.id AS CARD_ID,
    CC.val AS CARD_CODE,
	 C.id AS CARD_COUNTER,
    CLNT.id AS CLIENT_ID,
    CLNT.name AS CLIENT_NAME,
    CLNT.sex AS CLIENT_SEX,
    CAST(CLNT.regdate AS TIMESTAMP) AS CLIENT_REGDATE,
    CLNT.telephone AS CLIENT_TELEPHONE,
    CLNT.email AS CLIENT_EMAIL,
    CLNT.city AS CLIENT_CITY,
    CLNT.address AS CLIENT_ADDRESS
FROM
    CLIENT CLNT
    JOIN CLIENTCARD CLCR ON CLCR.clientid = CLNT.id
    JOIN CCARD CC ON CC.id = CLCR.ccardid
    JOIN GRPCCARD GRPC ON GRPC.id = CC.grpccardid
	 JOIN CCARDCOUNTER CCC ON CCC.ccardid = CC.id
	 JOIN COUNTER C ON C.id = CCC.counterid
	 JOIN COUNTERTYPE CT ON CT.id = C.countertypeid
WHERE
    /*Код вида карт*/
    GRPC.code = "20000001"
    /*Код счетчика карт*/
	 AND CT.code = "20000001"
ORDER BY
    CC.val