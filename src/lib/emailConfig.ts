// EmailJS Configuration
// Para configurar o EmailJS, siga os passos:
// 1. Acesse https://www.emailjs.com/ e crie uma conta
// 2. Configure Gmail como serviço de email
// 3. Crie um template de email 
// 4. Substitua os valores abaixo pelas suas chaves

export const emailConfig = {
  // Cole aqui o Service ID do EmailJS (ex: service_xxxxxxx)
  serviceId: 'YOUR_SERVICE_ID_HERE', 
  
  // Cole aqui o Template ID do EmailJS (ex: template_xxxxxxx)
  templateId: 'YOUR_TEMPLATE_ID_HERE', 
  
  // Cole aqui a Public Key do EmailJS (Account → General)
  publicKey: 'YOUR_PUBLIC_KEY_HERE', 
};

// ⚠️ IMPORTANTE: Após configurar, substitua os valores acima
// ✅ Exemplo correto: serviceId: 'service_abc123'

// Template sugerido para o EmailJS:
/*
Subject: {{subject}} - Contato Site LEOVEIO

Content:
<h2>Novo contato do site LEOVEIO</h2>

<p><strong>Nome:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Assunto:</strong> {{subject}}</p>

<h3>Mensagem:</h3>
<p>{{message}}</p>

<hr>
<p><small>Responder para: {{from_email}}</small></p>

{{#if attachment_count}}
<p><strong>Anexos:</strong> {{attachment_count}} arquivo(s)</p>
{{/if}}
*/ 