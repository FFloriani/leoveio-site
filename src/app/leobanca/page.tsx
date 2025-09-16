'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  History, 
  Download, 
  DollarSign,
  Percent,
  CheckCircle,
  X,
  Edit,
  Trash2,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Types
interface Participant {
  id: string;
  name: string;
  contribution: number;
  percentage: number;
  finalAmount: number;
  profit: number;
}

interface Banca {
  id: string;
  title: string;
  startDate: string;
  description: string;
  participants: Participant[];
  totalInvested: number;
  finalBalance: number;
  isLocked: boolean;
  allowDynamic: boolean;
  status: 'active' | 'closed';
  createdAt: string;
}

export default function LeoBancaPage() {
  const [currentBanca, setCurrentBanca] = useState<Banca | null>(null);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Form states
  const [bancaForm, setBancaForm] = useState({
    title: '',
    description: '',
    isLocked: false,
    allowDynamic: true
  });

  const [participantForm, setParticipantForm] = useState({
    name: '',
    contribution: ''
  });

  const [finalBalance, setFinalBalance] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedBancas = localStorage.getItem('leobanca-bancas');
    if (savedBancas) {
      setBancas(JSON.parse(savedBancas));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('leobanca-bancas', JSON.stringify(bancas));
  }, [bancas]);

  // Calculate percentages
  const calculatePercentages = (participants: Participant[], total: number) => {
    return participants.map(p => ({
      ...p,
      percentage: total > 0 ? (p.contribution / total) * 100 : 0
    }));
  };

  // Calculate final distribution
  const calculateDistribution = (participants: Participant[], finalBalance: number) => {
    const totalInvested = participants.reduce((sum, p) => sum + p.contribution, 0);
    if (totalInvested === 0) return participants;

    return participants.map(p => {
      const finalAmount = (p.contribution / totalInvested) * finalBalance;
      const roundedAmount = Math.round(finalAmount * 100) / 100;
      return {
        ...p,
        finalAmount: roundedAmount,
        profit: roundedAmount - p.contribution
      };
    });
  };

  // Create new banca
  const createBanca = () => {
    if (!bancaForm.title.trim()) return;

    const newBanca: Banca = {
      id: Date.now().toString(),
      title: bancaForm.title,
      startDate: new Date().toISOString(),
      description: bancaForm.description,
      participants: [],
      totalInvested: 0,
      finalBalance: 0,
      isLocked: bancaForm.isLocked,
      allowDynamic: bancaForm.allowDynamic,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setCurrentBanca(newBanca);
    setBancas(prev => [newBanca, ...prev]);
    setBancaForm({ title: '', description: '', isLocked: false, allowDynamic: true });
    setShowCreateModal(false);
  };

  // Add participant
  const addParticipant = () => {
    if (!participantForm.name.trim() || !participantForm.contribution) return;
    if (!currentBanca) return;

    const contribution = parseFloat(participantForm.contribution);
    if (contribution <= 0) return;

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: participantForm.name,
      contribution,
      percentage: 0,
      finalAmount: 0,
      profit: 0
    };

    const updatedParticipants = [...currentBanca.participants, newParticipant];
    const totalInvested = updatedParticipants.reduce((sum, p) => sum + p.contribution, 0);
    const participantsWithPercentages = calculatePercentages(updatedParticipants, totalInvested);

    const updatedBanca = {
      ...currentBanca,
      participants: participantsWithPercentages,
      totalInvested
    };

    setCurrentBanca(updatedBanca);
    setBancas(prev => prev.map(b => b.id === currentBanca.id ? updatedBanca : b));
    setParticipantForm({ name: '', contribution: '' });
    setShowParticipantModal(false);
  };

  // Close banca
  const closeBanca = () => {
    if (!currentBanca || !finalBalance) return;

    const finalBalanceNum = parseFloat(finalBalance);
    if (finalBalanceNum < 0) return;

    const participantsWithDistribution = calculateDistribution(currentBanca.participants, finalBalanceNum);
    
    const closedBanca = {
      ...currentBanca,
      participants: participantsWithDistribution,
      finalBalance: finalBalanceNum,
      status: 'closed' as const
    };

    setBancas(prev => prev.map(b => b.id === currentBanca.id ? closedBanca : b));
    setCurrentBanca(null);
    setFinalBalance('');
    setShowCloseModal(false);
  };

  // Export to CSV
  const exportToCSV = (banca: Banca) => {
    const csvContent = [
      ['Banca', 'Data', 'Participante', 'Aporte', 'Percentual', 'Valor Final', 'Lucro/Prejuízo'],
      ...banca.participants.map(p => [
        banca.title,
        new Date(banca.startDate).toLocaleDateString('pt-BR'),
        p.name,
        `R$ ${p.contribution.toFixed(2)}`,
        `${p.percentage.toFixed(2)}%`,
        `R$ ${p.finalAmount.toFixed(2)}`,
        `R$ ${p.profit.toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banca-${banca.title}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

          {/* Dashboard */}
          {!currentBanca ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white text-center hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={32} className="mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Nova Banca</h3>
                <p className="text-white/80">Criar nova banca compartilhada</p>
              </motion.button>

              <motion.button
                onClick={() => setShowHistory(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl text-white text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <History size={32} className="mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Histórico</h3>
                <p className="text-white/80">Ver bancas anteriores</p>
              </motion.button>

              <motion.button
                className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white text-center hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart3 size={32} className="mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Relatórios</h3>
                <p className="text-white/80">Análise de performance</p>
              </motion.button>
            </motion.div>
          ) : (
            /* Active Banca */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Banca Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{currentBanca.title}</h2>
                    <p className="text-white/70">{currentBanca.description}</p>
                    <p className="text-white/50 text-sm mt-1">
                      Iniciada em {new Date(currentBanca.startDate).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => setShowParticipantModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                    <button
                      onClick={() => setShowCloseModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Encerrar
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <DollarSign size={24} className="mx-auto mb-2 text-green-400" />
                    <p className="text-2xl font-bold text-white">R$ {currentBanca.totalInvested.toFixed(2)}</p>
                    <p className="text-white/70 text-sm">Total Investido</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Users size={24} className="mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold text-white">{currentBanca.participants.length}</p>
                    <p className="text-white/70 text-sm">Participantes</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Percent size={24} className="mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold text-white">
                      {currentBanca.participants.length > 0 ? 
                        (currentBanca.participants[0]?.percentage || 0).toFixed(1) : 0}%
                    </p>
                    <p className="text-white/70 text-sm">Maior Participação</p>
                  </div>
                </div>
              </div>

              {/* Participants List */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Participantes</h3>
                {currentBanca.participants.length === 0 ? (
                  <p className="text-white/70 text-center py-8">Nenhum participante adicionado ainda</p>
                ) : (
                  <div className="space-y-3">
                    {currentBanca.participants.map((participant) => (
                      <div key={participant.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{participant.name}</h4>
                            <span className="text-white/70 text-sm">{participant.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-green-400 font-medium">
                              R$ {participant.contribution.toFixed(2)}
                            </span>
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${participant.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              const updatedParticipants = currentBanca.participants.filter(p => p.id !== participant.id);
                              const totalInvested = updatedParticipants.reduce((sum, p) => sum + p.contribution, 0);
                              const participantsWithPercentages = calculatePercentages(updatedParticipants, totalInvested);
                              const updatedBanca = {
                                ...currentBanca,
                                participants: participantsWithPercentages,
                                totalInvested
                              };
                              setCurrentBanca(updatedBanca);
                              setBancas(prev => prev.map(b => b.id === currentBanca.id ? updatedBanca : b));
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Modals */}
          {/* Create Banca Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Nova Banca</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Título da Banca</label>
                    <input
                      type="text"
                      value={bancaForm.title}
                      onChange={(e) => setBancaForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                      placeholder="Ex: Banca do Cassino - Live 15/01"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Descrição (opcional)</label>
                    <textarea
                      value={bancaForm.description}
                      onChange={(e) => setBancaForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 h-20 resize-none"
                      placeholder="Observações sobre a banca..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={bancaForm.isLocked}
                        onChange={(e) => setBancaForm(prev => ({ ...prev, isLocked: e.target.checked }))}
                        className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/70 text-sm">Bloquear aportes após iniciar</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={bancaForm.allowDynamic}
                        onChange={(e) => setBancaForm(prev => ({ ...prev, allowDynamic: e.target.checked }))}
                        className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/70 text-sm">Permitir aportes dinâmicos</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createBanca}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    Criar Banca
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Add Participant Modal */}
          {showParticipantModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Adicionar Participante</h3>
                  <button
                    onClick={() => setShowParticipantModal(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Nome do Participante</label>
                    <input
                      type="text"
                      value={participantForm.name}
                      onChange={(e) => setParticipantForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                      placeholder="Ex: João Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Valor do Aporte (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={participantForm.contribution}
                      onChange={(e) => setParticipantForm(prev => ({ ...prev, contribution: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowParticipantModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addParticipant}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Adicionar
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Close Banca Modal */}
          {showCloseModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Encerrar Banca</h3>
                  <button
                    onClick={() => setShowCloseModal(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Saldo Final (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={finalBalance}
                      onChange={(e) => setFinalBalance(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 text-2xl"
                      placeholder="0,00"
                    />
                  </div>

                  {finalBalance && parseFloat(finalBalance) > 0 && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Distribuição Calculada</h4>
                      <div className="space-y-3">
                        {calculateDistribution(currentBanca?.participants || [], parseFloat(finalBalance)).map((p) => (
                          <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                            <div>
                              <span className="text-white font-medium">{p.name}</span>
                              <span className="text-white/70 text-sm ml-2">({p.percentage.toFixed(2)}%)</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">R$ {p.finalAmount.toFixed(2)}</div>
                              <div className={`text-sm ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {p.profit >= 0 ? '+' : ''}R$ {p.profit.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={closeBanca}
                    disabled={!finalBalance || parseFloat(finalBalance) < 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Encerrar Banca
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* History Modal */}
          {showHistory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Histórico de Bancas</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                {bancas.length === 0 ? (
                  <p className="text-white/70 text-center py-8">Nenhuma banca encontrada</p>
                ) : (
                  <div className="space-y-4">
                    {bancas.map((banca) => (
                      <div key={banca.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{banca.title}</h4>
                            <p className="text-white/70 text-sm">
                              {new Date(banca.startDate).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              banca.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {banca.status === 'active' ? 'Ativa' : 'Encerrada'}
                            </span>
                            {banca.status === 'closed' && (
                              <button
                                onClick={() => exportToCSV(banca)}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                              >
                                <Download size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">Participantes:</span>
                            <span className="text-white ml-2">{banca.participants.length}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Total Investido:</span>
                            <span className="text-white ml-2">R$ {banca.totalInvested.toFixed(2)}</span>
                          </div>
                          {banca.status === 'closed' && (
                            <>
                              <div>
                                <span className="text-white/70">Saldo Final:</span>
                                <span className="text-white ml-2">R$ {banca.finalBalance.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Resultado:</span>
                                <span className={`ml-2 ${banca.finalBalance >= banca.totalInvested ? 'text-green-400' : 'text-red-400'}`}>
                                  {banca.finalBalance >= banca.totalInvested ? '+' : ''}R$ {(banca.finalBalance - banca.totalInvested).toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
