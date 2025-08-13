'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, MessageCircle, Paperclip, Send, Check, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/lib/emailConfig';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setSubmitStatus('error');
        setSubmitMessage(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return false;
      }
      return true;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Máximo 5 arquivos
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Para demonstração, vamos simular o envio sem EmailJS configurado
      if (emailConfig.publicKey === 'your_public_key_here') {
        // Simulação para demonstração
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSubmitStatus('success');
        setSubmitMessage(`✅ Formulário preenchido com sucesso! 
        
📧 Para enviar emails reais, configure o EmailJS seguindo as instruções em src/lib/emailConfig.ts
        
📋 Dados coletados:
• Nome: ${formData.name}
• Email: ${formData.email} 
• Assunto: ${formData.subject}
• Arquivos: ${attachedFiles.length}
        
Por enquanto, entre em contato diretamente: contatoleoveio@gmail.com`);
        
        // Limpar formulário após 5 segundos
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' });
          setAttachedFiles([]);
          onClose();
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 5000);
        
        return;
      }

      // Converter arquivos para base64 (apenas para arquivos pequenos)
      const attachments = await Promise.all(
        attachedFiles.slice(0, 3).map(async (file) => ({
          name: file.name,
          data: await convertFileToBase64(file)
        }))
      );

      // Preparar dados do template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: 'contatoleoveio@gmail.com',
        subject: formData.subject,
        message: formData.message,
        attachments: JSON.stringify(attachments),
        attachment_count: attachments.length
      };

      // Enviar email usando EmailJS
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      setSubmitStatus('success');
      setSubmitMessage('Email enviado com sucesso! Responderemos em breve.');
      
      // Limpar formulário
      setFormData({ name: '', email: '', subject: '', message: '' });
      setAttachedFiles([]);
      
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setSubmitStatus('error');
      setSubmitMessage(`❌ Erro ao enviar email. 
      
📧 Entre em contato diretamente: contatoleoveio@gmail.com
      
📋 Seus dados:
• Nome: ${formData.name}
• Email: ${formData.email}
• Assunto: ${formData.subject}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Entrar em Contato</h2>
                <p className="text-sm text-white/70">Envie um email para contatoleoveio@gmail.com</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white/70" />
            </motion.button>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Assunto *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Sobre o que você quer falar?"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Mensagem *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Digite sua mensagem aqui..."
                required
              />
            </div>

            {/* File Attachments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Anexos (opcional)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Adicionar arquivo
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileAttach}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />

              {/* Attached Files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-white/70" />
                        <span className="text-sm text-white/90">{file.name}</span>
                        <span className="text-xs text-white/50">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Messages */}
            {submitMessage && (
              <motion.div
                className={`p-4 rounded-lg ${
                  submitStatus === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-300'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  {submitStatus === 'success' ? (
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="text-sm whitespace-pre-line leading-relaxed">{submitMessage}</div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
              whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Email</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal; 