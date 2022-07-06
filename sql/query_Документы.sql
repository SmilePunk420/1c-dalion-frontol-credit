SELECT
    CD.documentid AS DOCUMENT_ID,
    CAST(CD.deltadate + CD.deltatime AS TIMESTAMP) AS DOCUMENT_DATETIME,
    DC.uuid AS DOCUMENT_UUID,
    ENT.id AS ENTERPRISE_ID,
    ENT.code AS ENTERPRISE_CODE,
    DCKD.id AS DOCUMENTTYPE_ID,
    DCKD.code AS DOCUMENTTYPE_CODE,
    CAST(CD.delta AS DECIMAL(10,2)) AS DOCUMENT_SUM,
    USR.name AS DOCUMENT_CASHIER,
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
    JOIN "USER" USR ON DC.closeuserid = USR.id
    JOIN ENTERPRISE ENT ON DC.enterpriseid = ENT.id
WHERE
    /* Код счетчика карт */
    CT.code = 20000001
    AND CD.documentid IS NOT NULL
    /* Загружаемые виды документов текст */
    AND (DCKD.code = 4000001 OR DCKD.code = 4000002 OR DCKD.code = 4000003 OR DCKD.code = 4000004)
    /* Начальная дата строкой */
    AND CD.deltadate >= CAST('01.01.2020' AS TIMESTAMP)
    /* Конечная дата строкой */
    AND CD.deltadate <= CAST('31.12.2020' AS TIMESTAMP)
ORDER BY 
    CD.deltadate,
    CD.deltatime