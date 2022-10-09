import axios from 'axios';

const notifySlack = async (empresa, err, adicional, adicional2) => {
	const programa = 'Hydra Server'
	const obj = {
		"attachments": [
			{
				"fallback"   : err.message,
				"color"      : "danger",
				"pretext"    : "Empresa: " + empresa,
				"author_name": "Metodo: " + adicional,
				"title"      : adicional2,
				"text"       : err.stack,
				"fields"     : [
					{
						"title": "Hora",
						"value": moment().format("DD/MM/YYYY, h:mm:ss a"),
						"short": true
					}
				]
			}
		]
	};

	const url = 'https://hooks.slack.com/services/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';
	obj.username = programa;

  try {
    const response = await axios.post(url, { form: JSON.stringify(obj)})
    return response
  } catch (error) {
    throw error
  }

	// axios.post(url, { form: JSON.stringify(obj)}, function(err, response, body) {
	// 	if (err) console.error('Error al enviar el request a slack:', err.message);
	//   if(callback) callback();
	// });
}


export default {
  notifySlack
}