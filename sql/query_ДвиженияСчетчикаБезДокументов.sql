SELECT
	 CD.id AS CORDOC_ID,
    CAST(CD.deltadate + CD.deltatime AS TIMESTAMP) AS DOCUMENT_DATETIME,
    CAST(CD.delta AS DECIMAL(10,2)) AS DOCUMENT_SUM,
    CC.id AS CARD_ID,
    (
        SELECT
            CAST(SUM(COUNTERD.delta) AS DECIMAL(10,2))
        FROM
            COUNTERD
        WHERE
            COUNTERD.counterid = CD.counterid
            AND COUNTERD.chng <= CD.chng
    ) AS CARD_BALANCE
FROM
    COUNTERD CD
    JOIN COUNTER C ON CD.counterid = C.id
    JOIN COUNTERTYPE CT ON C.countertypeid = CT.id
    JOIN CCARDCOUNTER CCC ON CCC.counterid = C.id
    JOIN CCARD CC ON CCC.ccardid = CC.id
WHERE
    /* Код счетчика карт */
    CT.code = "20000001"
    AND CD.documentid IS NULL
    /* Начальная дата запроса строкой */
    AND CD.deltadate >= CAST('01012020' AS TIMESTAMP)
    /* Конечная дата запроса строкой */
    AND CD.deltadate <= CAST('01122020' AS TIMESTAMP)
ORDER BY 
    CD.deltadate,
    CD.deltatime