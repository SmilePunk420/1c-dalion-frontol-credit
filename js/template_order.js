function printHeader(print)
{
	if ( frontol.currentDocument.cardValues >= 70000 && frontol.currentDocument.cardValues <= 89999 || frontol.currentDocument.cardValues >= 2500000000010 && frontol.currentDocument.cardValues <= 2510000000004 )
	{
		print.printLRStringLF(frontol.currentDocument.type.name+" №"+print.addCharLeft(frontol.currentDocument.number,0,8),
														 "Смена №"+print.addCharLeft(frontol.currentDocument.sessionNumber,0,4)," ");
		print.printCenterString("Закр. "+frontol.currentDocument.timeClose," ");
		print.printStringWordWrap("Магазин: " + frontol.currentDocument.enterprise.name);
		print.printStringWordWrap("Кассир: " + frontol.currentUser.name);
		print.printLRStringLF("=","=","=");
	}
}

function printPosition(print)
{

}

function printFooter(print)
{
	if ( frontol.currentDocument.cardValues >= 70000 && frontol.currentDocument.cardValues <= 89999 )
	{
		print.printCenterString("РАССРОЧКА", " ");
		print.printStringWordWrap("Договор №: " + frontol.currentDocument.cardValues);
		for(frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++)
		{
			if (frontol.currentDocument.counter.type.code == 20000001)
			{
				print.printLRStringLF("Остаток: ", print.formatCurrency(frontol.currentDocument.counter.value) + " руб.", "_");
				print.printLRStringLF("-","-","-");
			}
		}
	}
	else if ( frontol.currentDocument.cardValues >= 2500000000010 && frontol.currentDocument.cardValues <= 2510000000004 )
	{
		print.printCenterString("БОНУСНАЯ КАРТА", " ");
		print.printStringWordWrap("Карта №: " + frontol.currentDocument.cardValues);
		for(frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++)
		{
			if (frontol.currentDocument.counter.type.code == 5000001)
			{
				print.printLRStringLF("Баланс: ", print.formatCurrency(frontol.currentDocument.counter.value) + " руб.", "_");
				print.printLRStringLF("-","-","-");
			}
		}
	}
}