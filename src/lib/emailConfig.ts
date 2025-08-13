// EmailJS Configuration
// Para configurar o EmailJS:
// 1. Acesse https://www.emailjs.com/
// 2. Crie uma conta gratuita
// 3. Configure um serviço de email (Gmail recomendado)
// 4. Crie um template de email
// 5. Substitua os valores abaixo pelos seus

export const emailConfig = {
  serviceId: 'service_leoveio', // Substitua pelo seu Service ID
  templateId: 'template_contact', // Substitua pelo seu Template ID
  publicKey: 'your_public_key_here', // Substitua pela sua Public Key
};

// Template sugerido para o EmailJS:
/*
Assunto: {{subject}} - Contato do Site LeoVeio

De: {{from_name}} <{{from_email}}>
Para: contatoleoveio@gmail.com

Mensagem:
{{message}}

---
Email de resposta: {{from_email}}
Nome: {{from_name}}

{{#if attachment_count}}
Anexos: {{attachment_count}} arquivo(s)
{{/if}}
*/ 