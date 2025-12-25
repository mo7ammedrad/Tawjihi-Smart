import i18n from '../config/i18n.js';

export const resetPasswordTemp = (name, resetCode, locale) => {
	const t = (key, options) => i18n.__({ phrase: key, locale }, options);

	return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t('emails.reset_password.title')}</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      direction: ${locale === 'ar' ? 'rtl' : 'ltr'};
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">${t('emails.reset_password.title')}</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>${t('emails.reset_password.greeting', { name })}</p>
      <p>${t('emails.reset_password.body')}</p>
      <div style="text-align: center; margin: 30px 0">
        <span
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #8066ea;
          "
          >${resetCode}</span
        >
      </div>
      <p>
        ${t('emails.reset_password.code_expiry')}
      </p>
      <p>${t('emails.reset_password.ignore_email')}</p>
      <p>${t('emails.reset_password.regards')}</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>${t('emails.reset_password.automated_message')}</p>
    </div>
  </body>
</html>
`;
};

export const acceptTeacherTemp = (name, locale) => {
	const t = (key, options) => i18n.__({ phrase: key, locale }, options);
	return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t('emails.accept_teacher.title')}</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      direction: ${locale === 'ar' ? 'rtl' : 'ltr'};
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">${t('emails.accept_teacher.title')}</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>${t('emails.accept_teacher.greeting', { name })}</p>
      <p>${t('emails.accept_teacher.body')}</p>  
      <p>${t('emails.accept_teacher.regards')}</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>${t('emails.accept_teacher.automated_message')}</p>
    </div>
  </body>
</html>
`;
};

export const refuseTeacherTemp = (name, isActive, locale) => {
	const t = (key, options) => i18n.__({ phrase: key, locale }, options);
	const body = isActive
		? t('emails.refuse_teacher.body_active')
		: t('emails.refuse_teacher.body_inactive');

	return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t('emails.refuse_teacher.title')}</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      direction: ${locale === 'ar' ? 'rtl' : 'ltr'};
    "
  >
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">${t('emails.refuse_teacher.title')}</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      "
    >
      <p>${t('emails.refuse_teacher.greeting', { name })}</p>
      <p>${body}</p>  
      <p>${t('emails.refuse_teacher.regards')}</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>${t('emails.refuse_teacher.automated_message')}</p>
    </div>
  </body>
</html>
`;
};
