INSERT INTO COUNTERD(ID, COUNTERID, DELTA, DELTADATE, DELTATIME, DTYPE) 
VALUES(GEN_ID(GCOUNTERD, 1), 2214018, CAST(2 AS DECIMAL(10,2)), '06.07.2022', '09:00:00', 0);
/*************************************************/
SELECT FIRST(1)
	CD.id AS CORDOC_ID,
	CD.counterid AS CARD_COUNTER,
    CAST(CD.deltadate + CD.deltatime AS TIMESTAMP) AS DOCUMENT_DATETIME,
    CAST(CD.delta AS DECIMAL(10,2)) AS DOCUMENT_SUM,
    CC.id AS CARD_ID,
    CC.code AS CARD_CODE,
	CC.val AS CARD_VAL
FROM 
	COUNTERD CD
   JOIN COUNTER C ON C.id = CD.counterid
   JOIN CCARDCOUNTER CCC ON CCC.counterid = C.id
   JOIN CCARD CC ON CC.id = CCC.ccardid
WHERE 
	CD.counterid = 2214018 /*ВнешнийИдентификаторСчетчикаКарты*/
	AND CD.delta = CAST(2 AS DECIMAL(10,2))
	AND CD.deltadate = '06.07.2022'
	AND CD.deltatime = '09:00:00'
	AND CD.dtype = 0
	AND CD.documentid IS NULL
ORDER BY
	CD.id DESC;