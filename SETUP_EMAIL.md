# 📧 Configuração do Sistema de Email

Este guia explica como configurar o sistema de email do site LeoVeio para funcionar completamente.

## 🚀 Como Funciona Atualmente

- ✅ **Interface completa**: Formulário com nome, email, assunto, mensagem e anexos
- ✅ **Validações**: Campos obrigatórios e validação de tamanho de arquivos
- ✅ **Simulação**: Sistema funciona em modo demonstração
- ⏳ **EmailJS**: Precisa ser configurado para envios reais

## 🔧 Configuração do EmailJS (Gratuito)

### Passo 1: Criar Conta
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### Passo 2: Configurar Serviço de Email
1. No dashboard, vá em "Email Services"
2. Clique "Add New Service"
3. Escolha "Gmail" (recomendado)
4. Conecte sua conta Gmail (`contatoleoveio@gmail.com`)
5. Anote o **Service ID** gerado

### Passo 3: Criar Template
1. Vá em "Email Templates"
2. Clique "Create New Template"
3. Use este template:

```html
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
```

4. Anote o **Template ID** gerado

### Passo 4: Obter Public Key
1. Vá em "Account" → "General"
2. Copie a **Public Key**

### Passo 5: Configurar no Código
Edite o arquivo `src/lib/emailConfig.ts`:

```typescript
export const emailConfig = {
  serviceId: 'seu_service_id_aqui',
  templateId: 'seu_template_id_aqui', 
  publicKey: 'sua_public_key_aqui',
};
```

## 🎯 Funcionalidades do Sistema

### ✅ Já Implementado
- Formulário responsivo e acessível
- Validação de campos obrigatórios
- Upload de múltiplos arquivos (máx. 5)
- Validação de tamanho (máx. 10MB por arquivo)
- Conversão de arquivos para Base64
- Feedback visual (loading, sucesso, erro)
- Limpeza automática do formulário
- Design integrado com o tema do site

### 📋 Campos do Formulário
- **Nome**: Obrigatório
- **Email**: Obrigatório, com validação
- **Assunto**: Obrigatório
- **Mensagem**: Obrigatória, textarea expansível
- **Anexos**: Opcional, suporta imagens, PDFs, documentos

### 🎨 Interface
- Modal flutuante com backdrop blur
- Animações suaves (Framer Motion)
- Tema dark integrado
- Responsivo (mobile-first)
- Ícones intuitivos (Lucide React)

## 🔒 Segurança e Limitações

### Limitações do EmailJS Gratuito
- 200 emails/mês
- Anexos limitados (Base64 pode ser pesado)
- Dependente de serviços terceiros

### Recomendações de Segurança
- Use validação server-side em produção
- Implemente rate limiting
- Considere captcha para spam
- Monitore uso da quota

## 🚀 Alternativas para Produção

### Para Alto Volume
- **Resend**: API moderna, 3000 emails grátis/mês
- **SendGrid**: Robusto, 100 emails grátis/dia
- **Amazon SES**: Pay-per-use, muito barato

### Implementação Server-Side
```typescript
// pages/api/contact.ts (Next.js API Route)
export default async function handler(req, res) {
  // Validação server-side
  // Envio via API de email
  // Rate limiting
}
```

## 🎯 Status Atual

🟢 **Funcionando**: Interface completa, validações, simulação
🟡 **Pendente**: Configuração EmailJS para envios reais
🔵 **Futuro**: Possível migração para solução server-side

## 📞 Suporte

Para dúvidas sobre a configuração:
- Email: contatoleoveio@gmail.com
- Documentação EmailJS: https://www.emailjs.com/docs/ 