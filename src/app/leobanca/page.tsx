'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Intro Video State: 'intro1' -> 'intro2' -> 'finished'
  const [introStage, setIntroStage] = useState<'intro1' | 'intro2' | 'finished'>('intro1');

  // Hooks de gerenciamento
  const {
    bancas,
    currentBanca,
    createBanca,
    closeBanca,
    reopenBanca,
    updateFinalBalance
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

  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        {/* Static Background - Always present behind */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/backgroundchines.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Intro Videos Sequence */}
        <AnimatePresence mode="wait">
          {introStage === 'intro1' && (
            <motion.video
              key="intro1"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              autoPlay
              muted
              playsInline
              onEnded={() => setIntroStage('intro2')}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/bgbancaintro.mp4"
            />
          )}

          {introStage === 'intro2' && (
            <motion.video
              key="intro2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              autoPlay
              muted
              playsInline
              onEnded={() => setIntroStage('finished')}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/bgbancaintro2.mp4"
            />
          )}
        </AnimatePresence>
      </div>
      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {/* Logo - Layer between background and content */}
      {/* Logo - Layer between background and content */}
      <AnimatePresence>
        {introStage === 'finished' && (
          <div
            className="absolute top-12 left-0 right-0 z-5 flex justify-center pointer-events-none"
          >
            <img
              src="/bancadobalao.png"
              alt="Banca do Balão"
              className="max-w-4xl w-full h-auto"
              style={{ filter: 'drop-shadow(0 4px 40px rgba(0,0,0,0.7))' }}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-[850px] pb-16">
        <div className="container mx-auto px-4">

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
        </div>
      </div>

      {/* Footer - Full Width */}
      <BancaFooter />

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
