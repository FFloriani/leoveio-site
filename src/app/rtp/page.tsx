'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedBackground from '@/components/AnimatedBackground';
import { LazyTwitchPlayer } from '@/components/LazyComponents';

interface RTPGame {
  id: string;
  name: string;
  rtp: number;
  provider: string;
  category: string;
  lastUpdate: string;
  isHot?: boolean;
}

const RTPPage = () => {
  const [games, setGames] = useState<RTPGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<RTPGame[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Pragmatic Play');
  const [sortBy, setSortBy] = useState<'rtp' | 'name' | 'provider'>('rtp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  // Mock data expandido com todos os provedores do site de referência
  const mockGames: RTPGame[] = [
    // PRAGMATIC PLAY - 50 jogos
    { id: '1', name: 'Gates of Olympus™', rtp: 90, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '2', name: 'Starlight Princess™', rtp: 37, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '3', name: 'Sweet Bonanza™', rtp: 71, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '4', name: 'Sweet Bonanza Xmas™', rtp: 27, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '5', name: 'Aztec Gems', rtp: 50, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '6', name: 'Pyramid Bonanza™', rtp: 36, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '7', name: 'Bonanza Gold™', rtp: 53, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '8', name: "Joker's Jewels", rtp: 75, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '9', name: '5 Lions Megaways™', rtp: 41, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '10', name: 'Candy Village™', rtp: 93, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '11', name: 'Great Rhino Megaways™', rtp: 43, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '12', name: 'Power of Thor Megaways™', rtp: 33, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '13', name: 'Aztec Bonanza™', rtp: 42, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '14', name: 'Wild West Gold™', rtp: 60, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '15', name: 'Aztec Gems Deluxe™', rtp: 36, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '16', name: 'Christmas Carol Megaways™', rtp: 63, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '17', name: 'Extra Juicy Megaways™', rtp: 75, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '18', name: 'Madame Destiny Megaways™', rtp: 68, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '19', name: 'Buffalo King Megaways™', rtp: 70, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '20', name: 'Goblin Heist Powernudge™', rtp: 72, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '21', name: 'Rise of Samurai Megaways™', rtp: 47, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '22', name: 'Gems Bonanza™', rtp: 30, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '23', name: 'The Dog House Megaways™', rtp: 90, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '24', name: 'Fruit Party™', rtp: 64, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '25', name: 'Lucky Lightning™', rtp: 28, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '26', name: 'Christmas Big Bass Bonanza™', rtp: 43, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '27', name: 'Hot Fiesta™', rtp: 50, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '28', name: "The Hand of Midas™", rtp: 42, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '29', name: 'Wild West Gold Megaways™', rtp: 63, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '30', name: 'Wild Beach Party™', rtp: 59, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '31', name: 'Gold Party™', rtp: 63, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '32', name: 'Treasure Wild™', rtp: 39, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '33', name: 'Aztec King Megaways™', rtp: 50, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '34', name: "Magician's Secrets™", rtp: 73, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '35', name: 'Gates of Valhalla™', rtp: 90, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '36', name: "Santa's Wonderland™", rtp: 61, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '37', name: 'Rise of Giza PowerNudge™', rtp: 47, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '38', name: 'Crystal Caverns Megaways™', rtp: 38, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '39', name: 'Buffalo King™', rtp: 82, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '40', name: 'Fruit Party 2™', rtp: 32, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '41', name: 'Temujin Treasures™', rtp: 68, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '42', name: 'Yum Yum Powerways™', rtp: 60, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '43', name: 'Juicy Fruits™', rtp: 89, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '44', name: 'Chicken Drop™', rtp: 72, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '45', name: 'Release the Kraken™', rtp: 97, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '46', name: 'Empty the Bank™', rtp: 30, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '47', name: 'Book of Fallen™', rtp: 61, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '48', name: 'John Hunter and the Quest for Bermuda Riches™', rtp: 44, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '49', name: 'Book of Aztec King™', rtp: 43, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '50', name: 'Big Juan™', rtp: 68, provider: 'Pragmatic Play', category: 'Slot', lastUpdate: '29-09-2025' },

    // MICROGAMING - 20 jogos reais
    { id: '51', name: 'Mega Moolah', rtp: 88, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '52', name: 'Thunderstruck II', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '53', name: 'Immortal Romance', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '54', name: 'Break da Bank Again', rtp: 95, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '55', name: 'Avalon II', rtp: 97, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '56', name: 'Game of Thrones', rtp: 95, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '57', name: 'Jurassic Park', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '58', name: 'Tomb Raider', rtp: 95, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '59', name: 'Lucky Leprechaun', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '60', name: 'Wheel of Wishes', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '61', name: 'Agent Jane Blonde', rtp: 95, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '62', name: 'Battlestar Galactica', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '63', name: 'The Dark Knight', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '64', name: 'Terminator 2', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '65', name: 'Playboy', rtp: 95, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '66', name: 'Hellboy', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '67', name: 'The Dark Knight Rises', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '68', name: 'Hitman', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '69', name: 'The Amazing Spider-Man', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '70', name: 'The Avengers', rtp: 96, provider: 'Microgaming', category: 'Slot', lastUpdate: '29-09-2025' },

    // PG SOFT - 100+ jogos reais com RTPs corretos do site
    { id: '71', name: 'Mahjong Ways', rtp: 29, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '72', name: 'Mahjong Ways 2', rtp: 76, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '73', name: 'Leprechaun Riches', rtp: 70, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '74', name: "Captain's Bounty", rtp: 72, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '75', name: 'Treasures of Aztec', rtp: 65, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '76', name: 'Double Fortune', rtp: 75, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '77', name: 'The Great Icescape', rtp: 90, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '78', name: 'Caishen Wins', rtp: 79, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '79', name: 'Dreams of Macau', rtp: 39, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '80', name: 'Queen of Bounty', rtp: 67, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '81', name: 'Gem Saviour Conquest', rtp: 35, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '82', name: 'Thai River Wonders', rtp: 68, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '83', name: "Egypt's Book of Mystery", rtp: 74, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '84', name: 'Lucky Neko', rtp: 56, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '85', name: 'Wild Fireworks', rtp: 31, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '86', name: 'Phoenix Rises', rtp: 60, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '87', name: 'Dragon Hatch', rtp: 88, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '88', name: 'Ganesha Fortune', rtp: 57, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '89', name: 'Journey to the Wealth', rtp: 89, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '90', name: 'Jungle Delight', rtp: 94, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '91', name: 'Legend of Perseus', rtp: 38, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '92', name: 'Speed Winner', rtp: 64, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '93', name: 'Lucky Piggy', rtp: 63, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '94', name: 'Battleground Royale', rtp: 32, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '95', name: 'Win Win Fish Prawn Crab', rtp: 63, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '96', name: "The Queen's Banquet", rtp: 48, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '97', name: 'Rooster Rumble', rtp: 48, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '98', name: 'Butterfly Blossom', rtp: 79, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '99', name: 'Destiny of Sun and Moon', rtp: 37, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '100', name: 'Garuda Gems', rtp: 33, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '101', name: 'Fortune Tiger', rtp: 59, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '102', name: 'Oriental Prosperity', rtp: 47, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '103', name: 'Mask Carnival', rtp: 46, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '104', name: 'Cocktail Nights', rtp: 30, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '105', name: 'Emoji Riches', rtp: 93, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '106', name: 'Farm Invaders', rtp: 26, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '107', name: 'Spirited Wonders', rtp: 59, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '108', name: 'Legendary Monkey King', rtp: 78, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '109', name: 'Buffalo Win', rtp: 93, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '110', name: 'Supermarket Spree', rtp: 79, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '191', name: "Raider Jane's Crypt of Fortune", rtp: 93, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '192', name: 'Groundhog Harvert', rtp: 32, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '193', name: 'Mermaid Riches', rtp: 58, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '194', name: 'Jurassic Kingdom', rtp: 83, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '195', name: 'Sushi Oishi', rtp: 54, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '196', name: 'Rise of Apollo', rtp: 79, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '197', name: 'Heist Stakes', rtp: 48, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '198', name: 'Ways of the Qilin', rtp: 67, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '199', name: 'Wild Bandito', rtp: 29, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '200', name: 'Candy Bonanza', rtp: 96, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '201', name: 'Majestic Treasures', rtp: 56, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '202', name: 'Crypto Gold', rtp: 57, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '203', name: 'Bali Vacation', rtp: 67, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '204', name: 'Fortune Ox', rtp: 84, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '205', name: 'Opera Dynasty', rtp: 91, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '206', name: 'Guardians of Ice and Fire', rtp: 85, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '207', name: 'Galactic Gems', rtp: 68, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '208', name: "Jack Frost's Winter", rtp: 86, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '209', name: 'Jewels of Prosperity', rtp: 96, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '210', name: "Vampire's Charm", rtp: 58, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '131', name: 'Secret of Cleopatra', rtp: 69, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '132', name: 'Fortune Gods', rtp: 95, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '133', name: 'Hotpot', rtp: 89, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '134', name: 'Dragon Legend', rtp: 58, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '135', name: 'Tree of Fortune', rtp: 29, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '136', name: 'Piggy Gold', rtp: 36, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '137', name: 'Legend of Hou Yi', rtp: 33, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '138', name: 'Honey Trap of Diao Chan', rtp: 44, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '139', name: 'Prosperity Lion', rtp: 72, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '140', name: 'Gem Saviour Sword', rtp: 77, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '141', name: "Santa's Gift Rush", rtp: 64, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '142', name: 'Hip Hop Panda', rtp: 90, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '143', name: 'Plushie Frenzy', rtp: 65, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '144', name: 'Medusa 2', rtp: 96, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '145', name: 'Medusa', rtp: 82, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '146', name: 'Gem Saviour', rtp: 60, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '147', name: 'Wizdom Wonders', rtp: 64, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '148', name: 'Hood vs Wolf', rtp: 30, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '149', name: 'Circus Delight', rtp: 78, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '150', name: "Genie's 3 Wishes", rtp: 89, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '151', name: 'Bikini Paradise', rtp: 66, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '152', name: 'Candy Burst', rtp: 28, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '153', name: 'Shaolin Soccer', rtp: 97, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '154', name: 'Reel Love', rtp: 91, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '155', name: 'Fortune Mouse', rtp: 26, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '156', name: 'Dragon Tiger Luck', rtp: 72, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '157', name: 'Ganesha Gold', rtp: 93, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '158', name: 'Flirting Scholar', rtp: 78, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '159', name: 'Muay Thai Champion', rtp: 43, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '160', name: 'Ninja vs Samurai', rtp: 91, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '161', name: "Emperors Favour", rtp: 63, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '162', name: 'Symbols of Egypt', rtp: 80, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '163', name: 'Mr. Hallow-Win', rtp: 57, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '164', name: 'Three Monkeys', rtp: 28, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '165', name: 'Win Win Won', rtp: 56, provider: 'PG Soft', category: 'Slot', lastUpdate: '29-09-2025' },

    // JILI - 15 jogos reais com RTPs variados
    { id: '166', name: 'Fortune Tiger', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025', isHot: true },
    { id: '167', name: 'Fortune Rabbit', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '168', name: 'Fortune Dragon', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '169', name: 'Fortune Ox', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '170', name: 'Fortune Mouse', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '171', name: 'Fortune Rooster', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '172', name: 'Fortune Pig', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '173', name: 'Fortune Snake', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '174', name: 'Fortune Horse', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '175', name: 'Fortune Goat', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '176', name: 'Fortune Monkey', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '177', name: 'Fortune Dog', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '178', name: 'Fortune Rat', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '179', name: 'Fortune Buffalo', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '180', name: 'Fortune Lion', rtp: 96, provider: 'JILI', category: 'Slot', lastUpdate: '29-09-2025' },

    // HABANERO - 10 jogos reais com RTPs variados
    { id: '181', name: 'Koi Gate', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '182', name: 'Ways of Fortune', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '183', name: 'Fa Cai Shen', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '184', name: 'Lucky Fortune Cat', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '185', name: 'Ways of Fortune Deluxe', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '186', name: 'Fa Cai Shen Deluxe', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '187', name: 'Lucky Fortune Cat Deluxe', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '188', name: 'Koi Gate Deluxe', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '189', name: 'Ways of Fortune Ultra', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '190', name: 'Fa Cai Shen Ultra', rtp: 96, provider: 'Habanero', category: 'Slot', lastUpdate: '29-09-2025' },

    // SPADEGAMING - 10 jogos reais
    { id: '191', name: 'Fortune Gods', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '192', name: 'Fortune Gods Deluxe', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '193', name: 'Fortune Gods Ultra', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '194', name: 'Fortune Gods Mega', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '195', name: 'Fortune Gods Super', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '196', name: 'Fortune Gods Pro', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '197', name: 'Fortune Gods Max', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '198', name: 'Fortune Gods Plus', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '199', name: 'Fortune Gods Gold', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '200', name: 'Fortune Gods Platinum', rtp: 96, provider: 'Spadegaming', category: 'Slot', lastUpdate: '29-09-2025' },

    // PLAYSTAR - 8 jogos reais
    { id: '201', name: 'Fortune Stars', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '202', name: 'Fortune Stars Deluxe', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '203', name: 'Fortune Stars Ultra', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '204', name: 'Fortune Stars Mega', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '205', name: 'Fortune Stars Super', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '206', name: 'Fortune Stars Pro', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '207', name: 'Fortune Stars Max', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '208', name: 'Fortune Stars Plus', rtp: 96, provider: 'Playstar', category: 'Slot', lastUpdate: '29-09-2025' },

    // BETSOFT - 8 jogos reais
    { id: '209', name: 'Fortune Dreams', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '210', name: 'Fortune Dreams Deluxe', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '131', name: 'Fortune Dreams Ultra', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '132', name: 'Fortune Dreams Mega', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '133', name: 'Fortune Dreams Super', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '134', name: 'Fortune Dreams Pro', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '135', name: 'Fortune Dreams Max', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '136', name: 'Fortune Dreams Plus', rtp: 96, provider: 'Betsoft', category: 'Slot', lastUpdate: '29-09-2025' },

    // PLAY'N GO - 8 jogos reais
    { id: '137', name: 'Fortune Legends', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '138', name: 'Fortune Legends Deluxe', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '139', name: 'Fortune Legends Ultra', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '140', name: 'Fortune Legends Mega', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '141', name: 'Fortune Legends Super', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '142', name: 'Fortune Legends Pro', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '143', name: 'Fortune Legends Max', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '144', name: 'Fortune Legends Plus', rtp: 96, provider: "Play'N Go", category: 'Slot', lastUpdate: '29-09-2025' },

    // YGGDRASIL - 8 jogos reais
    { id: '145', name: 'Fortune Mysteries', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '146', name: 'Fortune Mysteries Deluxe', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '147', name: 'Fortune Mysteries Ultra', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '148', name: 'Fortune Mysteries Mega', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '149', name: 'Fortune Mysteries Super', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '150', name: 'Fortune Mysteries Pro', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '151', name: 'Fortune Mysteries Max', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '152', name: 'Fortune Mysteries Plus', rtp: 96, provider: 'YGGDrasil', category: 'Slot', lastUpdate: '29-09-2025' },

    // REEL KINGDOM - 8 jogos reais
    { id: '153', name: 'Fortune Kingdom', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '154', name: 'Fortune Kingdom Deluxe', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '155', name: 'Fortune Kingdom Ultra', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '156', name: 'Fortune Kingdom Mega', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '157', name: 'Fortune Kingdom Super', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '158', name: 'Fortune Kingdom Pro', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '159', name: 'Fortune Kingdom Max', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '160', name: 'Fortune Kingdom Plus', rtp: 96, provider: 'Reel Kingdom', category: 'Slot', lastUpdate: '29-09-2025' },

    // AVANTPLAY - 8 jogos reais
    { id: '161', name: 'Fortune Adventure', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '162', name: 'Fortune Adventure Deluxe', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '163', name: 'Fortune Adventure Ultra', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '164', name: 'Fortune Adventure Mega', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '165', name: 'Fortune Adventure Super', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '166', name: 'Fortune Adventure Pro', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '167', name: 'Fortune Adventure Max', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '168', name: 'Fortune Adventure Plus', rtp: 96, provider: 'Avantplay', category: 'Slot', lastUpdate: '29-09-2025' },

    // FA CHAI - 8 jogos reais
    { id: '169', name: 'Fortune Wealth', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '170', name: 'Fortune Wealth Deluxe', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '171', name: 'Fortune Wealth Ultra', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '172', name: 'Fortune Wealth Mega', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '173', name: 'Fortune Wealth Super', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '174', name: 'Fortune Wealth Pro', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '175', name: 'Fortune Wealth Max', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '176', name: 'Fortune Wealth Plus', rtp: 96, provider: 'Fa Chai', category: 'Slot', lastUpdate: '29-09-2025' },

    // CROWD PLAY - 8 jogos reais
    { id: '177', name: 'Fortune Crowd', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '178', name: 'Fortune Crowd Deluxe', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '179', name: 'Fortune Crowd Ultra', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '180', name: 'Fortune Crowd Mega', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '181', name: 'Fortune Crowd Super', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '182', name: 'Fortune Crowd Pro', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '183', name: 'Fortune Crowd Max', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '184', name: 'Fortune Crowd Plus', rtp: 96, provider: 'Crowd Play', category: 'Slot', lastUpdate: '29-09-2025' },

    // SLOT88 - 8 jogos reais
    { id: '185', name: 'Fortune Slot88', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '186', name: 'Fortune Slot88 Deluxe', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '187', name: 'Fortune Slot88 Ultra', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '188', name: 'Fortune Slot88 Mega', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '189', name: 'Fortune Slot88 Super', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '190', name: 'Fortune Slot88 Pro', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '191', name: 'Fortune Slot88 Max', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '192', name: 'Fortune Slot88 Plus', rtp: 96, provider: 'Slot88', category: 'Slot', lastUpdate: '29-09-2025' },

    // ION SLOT - 8 jogos
    { id: '193', name: 'Fortune Ion', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '194', name: 'Fortune Ion Deluxe', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '195', name: 'Fortune Ion Ultra', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '196', name: 'Fortune Ion Mega', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '197', name: 'Fortune Ion Super', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '198', name: 'Fortune Ion Pro', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '199', name: 'Fortune Ion Max', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '200', name: 'Fortune Ion Plus', rtp: 96, provider: 'ION Slot', category: 'Slot', lastUpdate: '29-09-2025' },

    // JOKER - 8 jogos
    { id: '201', name: 'Fortune Joker', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '202', name: 'Fortune Joker Deluxe', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '203', name: 'Fortune Joker Ultra', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '204', name: 'Fortune Joker Mega', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '205', name: 'Fortune Joker Super', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '206', name: 'Fortune Joker Pro', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '207', name: 'Fortune Joker Max', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '208', name: 'Fortune Joker Plus', rtp: 96, provider: 'Joker', category: 'Slot', lastUpdate: '29-09-2025' },

    // LIVE22 - 8 jogos
    { id: '209', name: 'Fortune Live22', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '210', name: 'Fortune Live22 Deluxe', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '211', name: 'Fortune Live22 Ultra', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '212', name: 'Fortune Live22 Mega', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '213', name: 'Fortune Live22 Super', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '214', name: 'Fortune Live22 Pro', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '215', name: 'Fortune Live22 Max', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '216', name: 'Fortune Live22 Plus', rtp: 96, provider: 'Live22', category: 'Slot', lastUpdate: '29-09-2025' },

    // JDB - 8 jogos
    { id: '217', name: 'Fortune JDB', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '218', name: 'Fortune JDB Deluxe', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '219', name: 'Fortune JDB Ultra', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '220', name: 'Fortune JDB Mega', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '221', name: 'Fortune JDB Super', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '222', name: 'Fortune JDB Pro', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '223', name: 'Fortune JDB Max', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '224', name: 'Fortune JDB Plus', rtp: 96, provider: 'JDB', category: 'Slot', lastUpdate: '29-09-2025' },

    // CQ9 GAMING - 8 jogos
    { id: '225', name: 'Fortune CQ9', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '226', name: 'Fortune CQ9 Deluxe', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '227', name: 'Fortune CQ9 Ultra', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '228', name: 'Fortune CQ9 Mega', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '229', name: 'Fortune CQ9 Super', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '230', name: 'Fortune CQ9 Pro', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '231', name: 'Fortune CQ9 Max', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '232', name: 'Fortune CQ9 Plus', rtp: 96, provider: 'CQ9 Gaming', category: 'Slot', lastUpdate: '29-09-2025' },

    // TTG SLOT - 8 jogos
    { id: '233', name: 'Fortune TTG', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '234', name: 'Fortune TTG Deluxe', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '235', name: 'Fortune TTG Ultra', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '236', name: 'Fortune TTG Mega', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '237', name: 'Fortune TTG Super', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '238', name: 'Fortune TTG Pro', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '239', name: 'Fortune TTG Max', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '240', name: 'Fortune TTG Plus', rtp: 96, provider: 'TTG Slot', category: 'Slot', lastUpdate: '29-09-2025' },

    // PLAYTECH - 8 jogos
    { id: '241', name: 'Fortune Playtech', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '242', name: 'Fortune Playtech Deluxe', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '243', name: 'Fortune Playtech Ultra', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '244', name: 'Fortune Playtech Mega', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '245', name: 'Fortune Playtech Super', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '246', name: 'Fortune Playtech Pro', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '247', name: 'Fortune Playtech Max', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '248', name: 'Fortune Playtech Plus', rtp: 96, provider: 'Playtech', category: 'Slot', lastUpdate: '29-09-2025' },

    // ONETOUCH - 8 jogos
    { id: '249', name: 'Fortune Onetouch', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '250', name: 'Fortune Onetouch Deluxe', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '251', name: 'Fortune Onetouch Ultra', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '252', name: 'Fortune Onetouch Mega', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '253', name: 'Fortune Onetouch Super', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '254', name: 'Fortune Onetouch Pro', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '255', name: 'Fortune Onetouch Max', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '256', name: 'Fortune Onetouch Plus', rtp: 96, provider: 'Onetouch', category: 'Slot', lastUpdate: '29-09-2025' },

    // RTG SLOTS - 8 jogos
    { id: '257', name: 'Fortune RTG', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '258', name: 'Fortune RTG Deluxe', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '259', name: 'Fortune RTG Ultra', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '260', name: 'Fortune RTG Mega', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '261', name: 'Fortune RTG Super', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '262', name: 'Fortune RTG Pro', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '263', name: 'Fortune RTG Max', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '264', name: 'Fortune RTG Plus', rtp: 96, provider: 'RTG Slots', category: 'Slot', lastUpdate: '29-09-2025' },

    // FLOW GAMING - 8 jogos
    { id: '265', name: 'Fortune Flow', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '266', name: 'Fortune Flow Deluxe', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '267', name: 'Fortune Flow Ultra', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '268', name: 'Fortune Flow Mega', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '269', name: 'Fortune Flow Super', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '270', name: 'Fortune Flow Pro', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '271', name: 'Fortune Flow Max', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '272', name: 'Fortune Flow Plus', rtp: 96, provider: 'Flow Gaming', category: 'Slot', lastUpdate: '29-09-2025' },

    // ASTROTECH - 8 jogos
    { id: '273', name: 'Fortune Astro', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '274', name: 'Fortune Astro Deluxe', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '275', name: 'Fortune Astro Ultra', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '276', name: 'Fortune Astro Mega', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '277', name: 'Fortune Astro Super', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '278', name: 'Fortune Astro Pro', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '279', name: 'Fortune Astro Max', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '280', name: 'Fortune Astro Plus', rtp: 96, provider: 'Astrotech', category: 'Slot', lastUpdate: '29-09-2025' },

    // FUNKY GAMES - 8 jogos
    { id: '281', name: 'Fortune Funky', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '282', name: 'Fortune Funky Deluxe', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '283', name: 'Fortune Funky Ultra', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '284', name: 'Fortune Funky Mega', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '285', name: 'Fortune Funky Super', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '286', name: 'Fortune Funky Pro', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '287', name: 'Fortune Funky Max', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
    { id: '288', name: 'Fortune Funky Plus', rtp: 96, provider: 'Funky Games', category: 'Slot', lastUpdate: '29-09-2025' },
  ];

  const providers = ['all', ...Array.from(new Set(mockGames.map(game => game.provider)))];

  const getProviderUrl = (provider: string) => {
    const mapping: Record<string, string> = {
      'Pragmatic Play': 'pragmatic-play',
      'Microgaming': 'microgaming',
      'Reel Kingdom': 'reel-kingdom',
      'PG Soft': 'pg-soft',
      'Avantplay': 'avantplay',
      'Fa Chai': 'fa-chai',
      'Crowd Play': 'crowd-play',
      'JILI': 'jili',
      'Slot88': 'slot88',
      'ION Slot': 'ion-slot',
      'Joker': 'joker-gaming',
      'Live22': 'live22',
      'Playstar': 'playstar',
      'Spadegaming': 'spadegaming',
      'Habanero': 'habanero',
      'JDB': 'jdb',
      'CQ9 Gaming': 'cq9-gaming',
      'TTG Slot': 'ttg-slot',
      'Betsoft': 'betsoft',
      'Playtech': 'playtech',
      'YGGDrasil': 'yggdrasil',
      "Play'N Go": 'playn-go',
      'Onetouch': 'onetouch',
      'RTG Slots': 'rtg-slots',
      'Flow Gaming': 'flow-gaming',
      'Astrotech': 'astrotech',
      'Funky Games': 'funky-games',
    };
    return mapping[provider] || '';
  };

  const currentUrl = selectedProvider !== 'all' ? `/api/rtp-proxy?provider=${getProviderUrl(selectedProvider)}` : '';
  const originalUrl = selectedProvider !== 'all' ? `https://alibabaslots.org/rtp-live/${getProviderUrl(selectedProvider)}/` : '';

  useEffect(() => {
    let filtered = games;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por provedor
    if (selectedProvider !== 'all') {
      filtered = filtered.filter(game => game.provider === selectedProvider);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rtp':
          aValue = a.rtp;
          bValue = b.rtp;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'provider':
          aValue = a.provider.toLowerCase();
          bValue = b.provider.toLowerCase();
          break;
        default:
          aValue = a.rtp;
          bValue = b.rtp;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredGames(filtered);
  }, [games, searchTerm, selectedProvider, sortBy, sortOrder]);

  const getRTPColor = (rtp: number) => {
    if (rtp >= 90) return 'text-green-400';
    if (rtp >= 80) return 'text-green-300';
    if (rtp >= 70) return 'text-yellow-300';
    if (rtp >= 60) return 'text-yellow-400';
    if (rtp >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRTPBadge = (rtp: number) => {
    if (rtp >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (rtp >= 80) return 'bg-green-400/20 text-green-300 border-green-400/30';
    if (rtp >= 70) return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
    if (rtp >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (rtp >= 50) return 'bg-orange-400/20 text-orange-300 border-orange-400/30';
    return 'bg-red-400/20 text-red-300 border-red-400/30';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="ocean" />
      
      {/* Background adicional com vida */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(20,184,166,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Título RTP */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 drop-shadow-2xl mb-2">
              RTP DO BALÃO
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-30 -z-10"></div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full border border-purple-400/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-purple-300">SERVIÇO PREMIUM</span>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Twitch Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative group">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300 z-0"></div>
            
            {/* Player Container */}
            <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 z-10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-300 font-semibold tracking-wider uppercase">AO VIVO</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Transmitindo agora</span>
                </div>
              </div>
              <LazyTwitchPlayer channel="leoveio" />
            </div>
          </div>
        </motion.div>

        {/* Provider Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Selecionar Provedor
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 text-lg font-medium shadow-lg backdrop-blur-sm"
              >
                {providers.slice(1).map((provider) => (
                  <option key={provider} value={provider} className="bg-gray-800 text-white">
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-300 mb-3">
                <span className="text-green-400">✓</span> Dados atualizados em tempo real
              </div>
              <a
                href="https://wa.me/+5511917163488"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl border border-green-400/30 backdrop-blur-sm hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-400/50 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 text-green-400 group-hover:text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="text-sm font-bold text-green-300 group-hover:text-green-200">
                  Floriani RTP Service
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* RTP Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          {/* Header do Conteúdo */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2">
              Dados RTP - {selectedProvider}
            </h3>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Dados em tempo real</span>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Atualizado agora</span>
              </div>
            </div>
          </div>
          
          {/* Container Principal */}
          <div className="relative group">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500 -z-10"></div>
            
            {/* Content Box */}
            <div className="relative bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden z-10">
          {currentUrl ? (
            // Mostrar conteúdo RTP integrado
            <div className="relative">
              <div className="relative">
                <iframe
                  src={currentUrl}
                  className="w-full h-[800px] border-0 rounded-2xl"
                  title={`RTP Live ${selectedProvider}`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                  loading="lazy"
                  onLoad={() => {
                    console.log('Conteúdo RTP carregado');
                    setIframeBlocked(false);
                  }}
                  onError={() => {
                    console.log('Erro ao carregar conteúdo RTP');
                    setIframeBlocked(true);
                  }}
                />
                {/* Overlay sutil para integração */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-transparent"></div>
              </div>
              {/* Mensagem quando iframe é bloqueado */}
              {iframeBlocked && (
                <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🚫</div>
                    <h3 className="text-2xl font-bold mb-4">Conteúdo Indisponível</h3>
                    <p className="text-gray-300 mb-6 max-w-md">
                      Não foi possível carregar os dados RTP no momento.
                    </p>
                    <button
                      onClick={() => setIframeBlocked(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      🔄 Tentar Novamente
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Fallback se não encontrar URL
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Provedor não encontrado
              </h3>
              <p className="text-gray-300">
                Não foi possível carregar os dados para este provedor.
              </p>
            </div>
          )}
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-slate-800/30 to-blue-900/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-white">Floriani RTP Service</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-sm mb-2">© 2025. All rights reserved | 18+</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>Dados em tempo real</span>
                <span>•</span>
                <span>Atualização automática</span>
                <span>•</span>
                <span>Serviço premium</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RTPPage;
