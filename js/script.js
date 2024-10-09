// Код документа Рассрочка
var creditDocCode = 4000001;
// Код документа Оплата рассрочки
var creditLoanPaymentDocCode = 4000002;
// Код документа Возврат оплаты рассрочки
var creditLoanRepaymentDocCode = 4000003;
// Код документа Возврат рассрочки
var creditRepaymentDocCode = 4000004;
// Код типа карты рассрочки
var creditCardTypeCode = 20000002;
// Код счетчика рассрочки
var creditCounterCode = 20000001;
// Начальный номер диапазона карт рассрочки
var creditCardStartNumber = 3000;
// Конечный номер диапазона карт рассрочки
var creditCardEndNumber = 4999;
// Код вида оплаты Рассрочка
var creditPaymentCode = 4;
// Код товара "Погашение рассрочки", если 0 - то товар в документ Оплата рассрочки и Возврат оплаты рассрочки добавляется вручную
var loanItemCode = 14290;
// Название переменной для 1С начального значения счетчика карты
var creditVariableName1C = "COUNTER_INITIAL_VALUE";
// Служебная переменная для скрипта: Сумма рассрочки
var installmentPlanSumm = 0;

function init() {
  // Перед открытием документа
  frontol.addEventListener("openDocument", "beforeOpenDocument", true);
  // После открытия документа
  frontol.addEventListener("openDocument", "afterOpenDocument", false);
  // После добавления карты в документ
  frontol.addEventListener("addCard", "afterEnterCard", false);
  // Перед добавлением позиции в документ
  frontol.addEventListener("addPosition", "beforeAddPosition", true);
  // Перед добавлением оплаты в документ
  frontol.addEventListener("addPayment", "beforeAddPayment", true);
  // После добавления оплаты в документ
  frontol.addEventListener("addPayment", "afterAddPayment", false);
  // Перед закрытием документа
  frontol.addEventListener("closeDocument", "beforeCloseDocument", true);
  // После закрытия документа
  frontol.addEventListener("closeDocument", "afterCloseDocument", false);
}

// Перед открытием документа
function beforeOpenDocument() {
  // Установить значение суммы рассрочки
  installmentPlanSumm = 0;
  // Установить значение переменной для 1С
  frontol.currentDocument.userValues.set(creditVariableName1C, 0);
}

// После открытия документа
function afterOpenDocument() {
  // Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
  if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
		// Сообщение пользователю о необходимости ввести карту клиента
    frontol.actions.showMessage("Введите карту клиента\n*комбинация клавиш Ctrl+F8");
  }
}

// Перед добавлением позиции в документ
function beforeAddPosition(position) {
	// Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
	if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
    // Проверить на документ без введенной карты
		if (frontol.currentDocument.card.count == 0) {
			frontol.actions.showError("Не указана карта клиента");
			frontol.actions.cancel();
    }

		// Проверка типа введенной карты в документе
		for (frontol.currentDocument.card.index = 1; frontol.currentDocument.card.index <= frontol.currentDocument.card.count; frontol.currentDocument.card.index++) {
			// Если код типа карты документа не соответствует коду типа карты рассрочки
			if (frontol.currentDocument.card.type != creditCardTypeCode) {
				frontol.actions.showError("Тип карты не соответствует типам карт рассрочки");
				frontol.actions.cancel();
			}
		}
	}
}

// После добавления карты в документ
function afterEnterCard(c) {
  // Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
  if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {

    // Проверка номера карты документа на вхождение в диапазан доступных карт рассрочки
    if (c.value < creditCardStartNumber || c.value > creditCardEndNumber) {
      frontol.actions.showError("Номер карты рассрочки не входит в диапазон номеров карт рассрочки для текущего магазина!");
      frontol.actions.cancel();
    }

    // Сообщение об остатке долга по карте
    for (frontol.currentDocument.card.index = 1; frontol.currentDocument.card.index <= frontol.currentDocument.card.count; frontol.currentDocument.card.index++) {
      for (frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++) {
        // Если код счетчика соответствует коду счетчика рассрочки
        if (frontol.currentDocument.counter.type.code == creditCounterCode) {
          // Если по карте рассрочка отсутствует задолженость и открыт документ Оплата рассрочки
          if (frontol.currentDocument.type.code == creditLoanPaymentDocCode && frontol.currentDocument.counter.value <= 0) {
            frontol.actions.showError("Невозможно принять оплату рассрочки! По карте отсутствует задолженость!");
            frontol.actions.cancel();
          }
          // Проверка в документах Оплата рассрочки и Возврат оплаты рассрочки
          if (frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode) {
            if (loanItemCode != 0) {
              if (frontol.actions.showMessage("Добавить в документ услугу 'Погашение рассрочки'?", Button.YesNo + Icon.Question) == DialogResult.Yes) {
                try {
                  frontol.currentDocument.addPosition("Code", loanItemCode, 1, 1, 0, true);
                } catch (error) {
                  frontol.actions.showError("Невозможно добавить в документ услугу 'Погашение рассрочки'! " + error.message);
                  frontol.actions.cancel();
                }
              }
            }
          }
          // Сообщить задолженность по карте
          frontol.actions.showMessage("Задолженность по карте " + frontol.currentDocument.counter.value + " руб.");
        }
      }
    }
  }
}

// Перед выбором вида оплаты
function beforeAddPayment(p) {
	// Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
  if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
    // Если код типа документа равен коду типа документа Возврат рассрочки
    if (frontol.currentDocument.type.code == creditRepaymentDocCode) {
      for (frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++) {
        // Если код счетчика соответствует коду счетчика рассрочки
        if (frontol.currentDocument.counter.type.code == creditCounterCode) {
          // Если сумма платежа по рассрочке больше долга по карте
          if (frontol.currentDocument.totalSum > frontol.currentDocument.counter.value) {
            frontol.actions.showError("Задолженность по карте рассрочки должна быть больше или равна сумме возрата рассрочки!\nЗадолженность по карте составляет " + frontol.currentDocument.counter.value + " руб.");
            frontol.actions.cancel();
          }
        }
      }
    }
    // Если код типа документа равен коду типа документов Оплата рассрочки или Возврат оплаты рассрочки
    if (frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode) {
      // Если код типа документа равен коду типа документа Оплата рассрочки
			if (frontol.currentDocument.type.code == creditLoanPaymentDocCode) {
        for (frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++) {
          // Если код счетчика соответствует коду счетчика рассрочки
          if (frontol.currentDocument.counter.type.code == creditCounterCode) {
            // Если сумма платежа по рассрочке больше долга по карте
            if (frontol.currentDocument.totalSum > frontol.currentDocument.counter.value) {
              frontol.actions.showError("Сумма платежа по рассрочке не может быть больше задолженности по карте рассрочки!\nЗадолженность по карте составляет " + frontol.currentDocument.counter.value + " руб.");
              frontol.actions.cancel();
            }
          }
				}
			}
      // Если вид оплаты равен виду оплаты Рассрочка или виду оплаты с кодом 3 (Подарочный сертификат)
			if (p.type.code == creditPaymentCode || p.type.code == 3) {
				frontol.actions.showError("Этот вид оплаты выбирать нельзя! Выберите вид оплаты Наличными или Картой");
				frontol.actions.cancel();
			}
		}
	}
  // Добавлено условие на использование вида оплаты Рассрочка : 08.06.2022
  else {
    if (p.type.code == creditPaymentCode) {
      frontol.actions.showError("Этот вид оплаты выбирать нельзя!");
      frontol.actions.cancel();
    }
  }
}

// После выбора вида оплаты
function afterAddPayment() {
  // Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
  if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
    // Записать начальное значение счетчика рассрочки в переменную для 1С
    for (frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++) {
      // Если код счетчика соответствует коду счетчика рассрочки
      if (frontol.currentDocument.counter.type.code == creditCounterCode) {
        frontol.actions.showMessage(frontol.currentDocument.counter.value);
        frontol.currentDocument.userValues.set(creditVariableName1C, frontol.currentDocument.counter.value);
      }
    }

    // Если код типа документа Рассрочка или Возврат рассрочки
    if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
      // Записать суммы рассрочки в служебную переменную
      for (frontol.currentDocument.payment.index = 1; frontol.currentDocument.payment.index <= frontol.currentDocument.payment.count; frontol.currentDocument.payment.index++) {
        // Если код вида оплаты документа равен коду вида оплаты Рассрочка
        if (frontol.currentDocument.payment.type.code == creditPaymentCode) {
          installmentPlanSumm = frontol.currentDocument.payment.sumInBaseCurrency;
        }
      }
    }
  }
}

// Перед закрытием документа
function beforeCloseDocument() {
  // Проверка в документах Рассрочка, Возврат рссрочки, Оплата рассрочки и Возврат оплаты рассрочки
  if (frontol.currentDocument.type.code == creditDocCode || frontol.currentDocument.type.code == creditLoanPaymentDocCode || frontol.currentDocument.type.code == creditLoanRepaymentDocCode || frontol.currentDocument.type.code == creditRepaymentDocCode) {
    var creditPaymentExist = false;
    // Проверить наличие в документе вида оплаты Рассрочка
    for (frontol.currentDocument.payment.index = 1; frontol.currentDocument.payment.index <= frontol.currentDocument.payment.count; frontol.currentDocument.payment.index++) {
      if (frontol.currentDocument.payment.type.code == creditPaymentCode) {
        creditPaymentExist = true;
      }
    }
    // Если код типа документа равен коду типа документа Рассрочка и нет вида оплаты Рассрочка
    if (frontol.currentDocument.type.code == creditDocCode && creditPaymentExist != true) {
      frontol.actions.showError("В документе рассрочки отсутствует вид оплаты Рассрочка. Для закрытия документа необходимо выбрать вид оплаты Рассрочка.");
      frontol.actions.cancel();
    }
    // Если код типа документа равен коду типа документов Оплата рассрочки или Возврат оплаты рассрочки и есть вид оплаты Рассрочка
    if (frontol.currentDocument.type.code == creditLoanPaymentDocCode && creditPaymentExist == true || frontol.currentDocument.type.code == creditLoanRepaymentDocCode && creditPaymentExist == true) {
      frontol.actions.showError("В документах Оплата рассрочки и/или Возврат оплаты рассрочки не должно быть вида оплаты Рассрочка. Для закрытия документа необходимо сторнировать вид оплаты Рассрочка.");
      frontol.actions.cancel();
    }
  }
}

// После закрытия документа
function afterCloseDocument() {
  // Сумма для счетчика
  var summ = 0;

  // Закрытие документа Рассрочка
  if (frontol.currentDocument.type.code == creditDocCode && installmentPlanSumm != 0) {
    summ = installmentPlanSumm;
  }
  // Закрытие документа Оплата рассрочки
  else if (frontol.currentDocument.type.code == creditLoanPaymentDocCode) {
    summ = -frontol.currentDocument.totalSum;
  }
  // Закрытие документа Возврат оплаты рассрочки
  else if (frontol.currentDocument.type.code == creditLoanRepaymentDocCode) {
    summ = frontol.currentDocument.totalSum;
  }
  // Закрытие документа Возврат рассрочки
  else if (frontol.currentDocument.type.code == creditRepaymentDocCode && installmentPlanSumm != 0) {
    summ = -installmentPlanSumm;
  }

  // Если сумма для счетчика не равна 0, то добавить в значение счетчика
  if (summ != 0) {
    for (frontol.currentDocument.counter.index = 1; frontol.currentDocument.counter.index <= frontol.currentDocument.counter.count; frontol.currentDocument.counter.index++) {
      if (frontol.currentDocument.counter.type.code == creditCounterCode) {
        frontol.currentDocument.counter.addValueByTypeCode(creditCounterCode, summ);
      }
    }
  }
}
