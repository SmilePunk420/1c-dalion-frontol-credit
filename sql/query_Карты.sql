SELECT
    CC.id AS CARD_ID,
    CC.code AS CARD_CODE,
    CC.val AS CARD_VAL,
    C.id AS CARD_COUNTER
FROM
    CCARD CC
    JOIN GRPCCARD GRPC ON GRPC.id = CC.grpccardid
    JOIN CCARDCOUNTER CCC ON CCC.ccardid = CC.id
    JOIN COUNTER C ON C.id = CCC.counterid
    JOIN COUNTERTYPE CT ON CT.id = C.countertypeid
WHERE
    GRPC.code = 20000002
    AND CT.code = 20000001
ORDER BY
    CC.val