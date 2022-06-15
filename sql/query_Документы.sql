SELECT
    CD.documentid AS DOCUMENT_ID,
    CAST(CD.deltadate + CD.deltatime AS TIMESTAMP) AS DOCUMENT_DATETIME,
    DC.uuid AS DOCUMENT_UUID,
	 DC.enterpriseid AS ENTERPRISE_ID,
    DCKD.id AS DOCUMENTTYPE_ID,
	 DCKD.code AS DOCUMENTTYPE_CODE,
    CAST(CD.delta AS DECIMAL(10,2)) AS DOCUMENT_SUM,
    CC.id AS CARD_ID,
    (
        SELECT
            CAST(SUM(TOTD.delta) AS DECIMAL(10,2))
        FROM
            COUNTERD TOTD
        WHERE
            TOTD.counterid = CD.counterid
            AND TOTD.chng <= CD.chng
    ) AS CARD_BALANCE
FROM
   COUNTERD CD
	JOIN DOCUMENT DC ON CD.documentid = DC.id
	JOIN DOCKIND DCKD ON DC.dockindid = DCKD.id
	JOIN COUNTER C ON CD.counterid = C.id
	JOIN COUNTERTYPE CT ON C.countertypeid = CT.id
	JOIN CCARDCOUNTER CCC ON CCC.counterid = C.id
	JOIN CCARD CC ON CCC.ccardid = CC.id
WHERE
    /* Код счетчика карт */
    CT.code = 20000001
	AND CD.documentid IS NOT NULL
    /* Загружаемые виды документов текст */
	AND (DCKD.code = 50 OR DCKD.code = 51)
    /* Начальная дата строкой */
    AND CD.deltadate >= CAST('01012020' AS TIMESTAMP)
    /* Конечная дата строкой */
    AND CD.deltadate <= CAST('01122020' AS TIMESTAMP)
ORDER BY 
    CD.deltadate,
    CD.deltatime