'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import AnimatedBackground from '@/components/AnimatedBackground';
import TwitchCallsPanel from '@/components/TwitchCallsPanel';

import {
  // Hooks
  useBanca,
  useParticipants,
  // Components
  BancaHeader,
  BancaStats,
  BancaHistory,
  BancaFooter,
  CloseBancaModal,
  ParticipantList,
  CreateBancaModal,
  AddParticipantModal,
  EditParticipantModal,
  DashboardActions,
} from '@/features/banca';

export default function LeoBancaPage() {
  // Hooks de gerenciamento
  const {
    bancas,
    currentBanca,
    createBanca,
    closeBanca,
    reopenBanca,
    updateFinalBalance,
    clearCurrentBanca
  } = useBanca();

  const {
    participantForm,
    slotCalls,
    editingParticipant,
    setParticipantForm,
    addSlotCall,
    removeSlotCall,
    updateSlotCall,
    resetForm,
    addParticipant,
    startEditParticipant,
    updateParticipant,
    removeParticipant
  } = useParticipants();

  // Estados dos modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Estado local para atualizar banca
  const [localBanca, setLocalBanca] = useState(currentBanca);

  // Sincronizar banca local com hook
  if (currentBanca && (!localBanca || localBanca.id !== currentBanca.id)) {
    setLocalBanca(currentBanca);
  }

  // Handlers
  const handleCreateBanca = (title: string, description: string) => {
    createBanca(title, description);
  };

  const handleAddParticipant = () => {
    if (!localBanca) return;
    const updated = addParticipant(localBanca);
    if (updated) {
      setLocalBanca(updated);
    }
  };

  const handleEditParticipant = (participant: typeof editingParticipant) => {
    if (!participant) return;
    startEditParticipant(participant);
    setShowEditModal(true);
  };

  const handleUpdateParticipant = () => {
    if (!localBanca) return;
    const updated = updateParticipant(localBanca);
    if (updated) {
      setLocalBanca(updated);
    }
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (!localBanca) return;
    const updated = removeParticipant(localBanca, participantId);
    setLocalBanca(updated);
  };

  const handleUpdateFinalBalance = (balance: number) => {
    if (!localBanca) return;
    setLocalBanca({ ...localBanca, finalBalance: balance });
    updateFinalBalance(balance);
  };

  const handleCloseBanca = (finalBalance: number) => {
    if (!localBanca) return;
    // Fechar banca passando a banca atual e o saldo final
    closeBanca(localBanca, finalBalance);
    setLocalBanca(null);
  };

  const handleBack = () => {
    clearCurrentBanca();
    setLocalBanca(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatedBackground variant="tropical" intensity="medium" />

      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition-all duration-300 mr-4"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Voltar ao Site</span>
                <span className="sm:hidden">Voltar</span>
              </Link>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              BANCA DO BALÃO
            </h1>
          </motion.div>

          {/* Layout Principal */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Conteúdo Principal */}
            <div className="flex-1">
              {!localBanca ? (
                // Dashboard - Sem banca ativa
                <DashboardActions
                  onCreateBanca={() => setShowCreateModal(true)}
                  onShowHistory={() => setShowHistory(true)}
                />
              ) : (
                // Banca Ativa
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <BancaHeader
                    banca={localBanca}
                    onAddParticipant={() => setShowAddModal(true)}
                    onCloseBanca={() => setShowCloseModal(true)}
                    onBack={handleBack}
                    onUpdateFinalBalance={handleUpdateFinalBalance}
                  />

                  <BancaStats banca={localBanca} />

                  <ParticipantList
                    participants={localBanca.participants}
                    onEdit={handleEditParticipant}
                    onRemove={handleRemoveParticipant}
                    isLocked={localBanca.isLocked}
                  />
                </motion.div>
              )}
            </div>

            {/* Painel de Calls da Twitch - Lado Direito */}
            <div className="hidden xl:block xl:w-96 xl:flex-shrink-0">
              <div className="sticky top-24">
                <div className="h-[calc(100vh-150px)]">
                  <TwitchCallsPanel channels={['leoveio', 'florianitv']} enabled={true} />
                </div>
              </div>
            </div>
          </div>

          <BancaFooter />
        </div>
      </div>

      {/* Modais */}
      <CreateBancaModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBanca}
      />

      <AddParticipantModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        onSubmit={handleAddParticipant}
        participantForm={participantForm}
        setParticipantForm={setParticipantForm}
        slotCalls={slotCalls}
        onAddSlotCall={addSlotCall}
        onRemoveSlotCall={removeSlotCall}
        onUpdateSlotCall={updateSlotCall}
      />

      <EditParticipantModal
        isOpen={showEditModal}
        participant={editingParticipant}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleUpdateParticipant}
        participantForm={participantForm}
        setParticipantForm={setParticipantForm}
        slotCalls={slotCalls}
        onAddSlotCall={addSlotCall}
        onRemoveSlotCall={removeSlotCall}
        onUpdateSlotCall={updateSlotCall}
      />

      <BancaHistory
        isOpen={showHistory}
        bancas={bancas}
        onClose={() => setShowHistory(false)}
        onReopen={reopenBanca}
      />

      <CloseBancaModal
        isOpen={showCloseModal}
        banca={localBanca}
        onClose={() => setShowCloseModal(false)}
        onConfirm={handleCloseBanca}
      />
    </div>
  );
}
