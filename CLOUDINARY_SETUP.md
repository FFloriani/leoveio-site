# ☁️ Configuração do Cloudinary - LEOVEIO

## ✅ **CREDENCIAIS CONFIGURADAS**

- **Cloud Name**: `dcqgxyw0z`
- **API Key**: `991744351793697`
- **API Secret**: `lFnnd2h_tczs9O-SxQyEXOPYAxQ`
- **Upload Preset**: `leoveio-contacts` (PID: 03ba5fdd-7ca4-4a36-831a-9072869a8528)

## 🚀 **Setup Rápido**

### **1. Criar Upload Preset**
1. Acesse [https://cloudinary.com/console](https://cloudinary.com/console)
2. Vá em **Settings** → **Upload**
3. Clique **Add upload preset**
4. Configure:
   - **Preset name**: `leoveio-contacts`
   - **Signing Mode**: `Unsigned` (para uploads diretos)
   - **Folder**: `leoveio-contacts`
   - **Resource Type**: `Auto`
   - **Access Mode**: `Public`
5. Salve o preset

### **2. Testar Upload**
1. Execute `npm run dev`
2. Abra o modal de contato
3. Anexe um arquivo
4. Verifique se o upload funciona

## 📋 **Funcionalidades Implementadas**

### **✅ Upload com Download Forçado**
- **Imagens**: Visualização normal
- **Documentos**: Download forçado com `fl_attachment`
- **Arquivos**: PDF, DOC, DOCX, ZIP, RAR, TXT

### **✅ Interface Completa**
- Progresso visual do upload
- Validação de arquivos
- Links de download diretos
- Remoção de arquivos
- Integração com Formspree

### **✅ Limitações**
- **Tamanho máximo**: 10MB por arquivo
- **Máximo de arquivos**: 5 por formulário
- **Armazenamento gratuito**: 25GB
- **Bandwidth gratuito**: 25GB/mês

## 🔧 **Como Funciona**

1. **Usuário** seleciona arquivo(s)
2. **Cloudinary** processa o upload
3. **Sistema** gera URL de download forçado
4. **Formspree** recebe formulário + links
5. **Você** recebe email com links para download

## 🎯 **URLs Geradas**

### **Imagens** (visualização):
```
https://res.cloudinary.com/dcqgxyw0z/image/upload/v123456789/arquivo.jpg
```

### **Documentos** (download forçado):
```
https://res.cloudinary.com/dcqgxyw0z/raw/upload/fl_attachment/v123456789/arquivo.pdf
```

**⚠️ IMPORTANTE**: O Cloudinary não permite `fl_attachment` em URLs com `/image/` - apenas em URLs `/raw/` para arquivos diretos.

## 🚨 **Importante**

- **Upload Preset** deve ser criado no dashboard
- **Teste** sempre após mudanças
- **Monitore** uso no dashboard do Cloudinary
- **Links** são permanentes e seguros

## 📞 **Suporte**

- **Dashboard**: [https://cloudinary.com/console](https://cloudinary.com/console)
- **Documentação**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Status**: [https://status.cloudinary.com/](https://status.cloudinary.com/)
