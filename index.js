
(function($, window, undefined) {

  var $ELEMENT_form = $('[data-form]');
  var $ELEMENT_inputField = $('[data-input-field]');
  var $ELEMENT_formSubmit = $('[data-form-submit]');

  var SELECTOR_formValidation = '[data-form-validation]';
  var SLECTOR_forBlock = '[data-form-block]';

  var CLASS_formInputValid = 'form__input--valid';
  var CLASS_formInputInvalid = 'form__input--invalid';
  var CLASS_formValidationInvalid = 'form__validation--invalid';
  var CLASS_formValidationValid = 'form__validation--valid';
  var CLASS_formBlockShake = 'form__block--shake';

  var ATTR_pattern = 'pattern';
  var ATTR_title = 'title';
  var ATTR_required = 'required';

  var allInputsAreValid = true;

  function isInputValid(regex, inputValue) {
    if (regex === undefined) {
      return inputValue.length > 0;
    }

    return new RegExp(regex, 'i').test(inputValue);
  }

  function getCurrentInputInformation($ELEMENT_currentInput) {
    return {
      inputValue: $ELEMENT_currentInput.val(),
      regexString: $ELEMENT_currentInput.attr(ATTR_pattern),
      errorMessage: $ELEMENT_currentInput.attr(ATTR_title),
      isValid: true
    }
  }

  function shakeFormBlock($ELEMENT_currentInput) {
    $ELEMENT_currentInput.parent(SLECTOR_forBlock).removeClass(CLASS_formBlockShake);

    setTimeout(function() {
      $ELEMENT_currentInput.parent(SLECTOR_forBlock).addClass(CLASS_formBlockShake);
    }, 100);
  }

  function setCurrentInputToValid($ELEMENT_currentInput) {
    var $ELEMENT_currentValidation = $ELEMENT_currentInput.next(SELECTOR_formValidation);

    $ELEMENT_currentInput.addClass(CLASS_formInputValid);
    $ELEMENT_currentInput.removeClass(CLASS_formInputInvalid);
    $ELEMENT_currentValidation.removeClass(CLASS_formValidationInvalid);
    $ELEMENT_currentValidation.addClass(CLASS_formValidationValid);
    $ELEMENT_currentValidation.text('');
  }

  function setCurrentInputToInvalid($ELEMENT_currentInput, errorMessage, isTyping) {
    var $ELEMENT_currentValidation = $ELEMENT_currentInput.next(SELECTOR_formValidation);

    $ELEMENT_currentInput.removeClass(CLASS_formInputValid);
    $ELEMENT_currentInput.addClass(CLASS_formInputInvalid);
    $ELEMENT_currentValidation.removeClass(CLASS_formValidationValid);
    $ELEMENT_currentValidation.addClass(CLASS_formValidationInvalid);
    $ELEMENT_currentValidation.text(errorMessage);

    if (isTyping) {
      return;
    }

    shakeFormBlock($ELEMENT_currentInput);
  }

  function checkIfCurrentInputIsValid($ELEMENT_currentInput, isTyping) {

    if ($ELEMENT_currentInput.attr(ATTR_required) === undefined) {
      return;
    }

    var currentInputObj = getCurrentInputInformation($ELEMENT_currentInput);
    currentInputObj.isValid = isInputValid(currentInputObj.regexString, currentInputObj.inputValue);

    if (currentInputObj.isValid) {
      setCurrentInputToValid($ELEMENT_currentInput)
    } else {
      setCurrentInputToInvalid($ELEMENT_currentInput, currentInputObj.errorMessage, isTyping)
    }
  }

  function handleKeypressOnInput(event) {
    $ELEMENT_currentInput = $(event.target);
    var isTyping = true;
    checkIfCurrentInputIsValid($ELEMENT_currentInput, isTyping)
  }




  function validateRadioButtons() {
    if ($('input[name=gender]').length === 0) {
      return;
    }

    if ($('input[name=gender]:checked').val() === undefined) {
      var title = $('input[name=gender]').attr(ATTR_title);
      $('[data-form-radio-validation="gender"]').text(title);
      $('[data-form-radio-block]').addClass('form__block--invalid');
      $('[data-form-radio-gender]').addClass('form__radioBtn--invalid');
      return;
    }

    $('[data-form-radio-block]').removeClass('form__block--invalid');
    $('[data-form-radio-gender]').removeClass('form__radioBtn--invalid');
  }



  function scrollToElement($ELEMENT_this) {
    $('html, body').animate({
      scrollTop: $ELEMENT_this.offset().top
    }, 400, function() {
      $ELEMENT_this.focus();
    });
  }

  function checkIfAllInputsAreValid(event) {

    var firstErrorFound = false;
    var isTyping = false;

    validateRadioButtons();

    $ELEMENT_inputField.each(function() {
      var $ELEMENT_this = $(this);

      checkIfCurrentInputIsValid($ELEMENT_this, isTyping);

      if ($ELEMENT_this.hasClass(CLASS_formInputInvalid) && !firstErrorFound) {
        firstErrorFound = true;
        scrollToElement($ELEMENT_this);
      }
    });

    if (firstErrorFound) {
      event.preventDefault();
    }
  }

  function init() {
    $ELEMENT_inputField.on('blur', handleKeypressOnInput);
    $ELEMENT_formSubmit.on('click', checkIfAllInputsAreValid);
  }

  init();

})(jQuery, window);
