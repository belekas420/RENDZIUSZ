/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Car, 
  MapPin, 
  Sword, 
  Crown, 
  User, 
  Wallet, 
  Shield, 
  Activity,
  X,
  Package,
  Target,
  Skull,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';

// --- Types ---
interface PlayerData {
  playerId: number;
  name: string;
  money: number;
  bank: number;
  vip: boolean;
  health: number;
  armor: number;
  kills: number;
  deaths: number;
  discordName: string;
  discordAvatar: string;
}

interface Item {
  id: string;
  name: string;
  image?: string;
  category?: string;
  spawnCode: string;
}

interface Admin {
  id: string;
  name: string;
  role: string;
  status: string;
}

// --- Mock Data ---
const MOCK_PLAYER: PlayerData = {
  playerId: 1,
  name: "John Doe",
  money: 5000,
  bank: 125000,
  vip: false,
  health: 100,
  armor: 50,
  kills: 142,
  deaths: 89,
  discordName: "johndoe#1234",
  discordAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
};

const CARS: Item[] = [
  { id: '1', name: 'BMW X5', spawnCode: 'bmwx5', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Audi RS6', spawnCode: 'rs6', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Mercedes G63', spawnCode: 'g63', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Lamborghini Urus', spawnCode: 'urus', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400' },
];

const TELEPORTS: Item[] = [
  { id: '1', name: 'Redzone', spawnCode: 'redzone', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Police Station', spawnCode: 'police', image: 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Hospital', spawnCode: 'hospital', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Airport', spawnCode: 'airport', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=400' },
];

const GUNS: Item[] = [
  { id: '1', name: 'Pistol MK2', spawnCode: 'weapon_pistol_mk2', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Assault Rifle', spawnCode: 'weapon_assaultrifle', image: 'https://images.unsplash.com/photo-1584285418504-005502939773?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'SMG', spawnCode: 'weapon_smg', image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf839?auto=format&fit=crop&q=80&w=400' },
];

const ITEMS: Item[] = [
  { id: '1', name: 'Bread', spawnCode: 'bread' },
  { id: '2', name: 'Water', spawnCode: 'water' },
  { id: '3', name: 'Repair Kit', spawnCode: 'fixkit' },
  { id: '4', name: 'Medkit', spawnCode: 'medkit' },
  { id: '5', name: 'Bandage', spawnCode: 'bandage' },
  { id: '6', name: 'Cigarette', spawnCode: 'cigarette' },
  { id: '7', name: 'Lighter', spawnCode: 'lighter' },
  { id: '8', name: 'Phone', spawnCode: 'phone' },
];

const VIP_ITEMS: Item[] = [
  { id: '1', name: 'Gold AK-47', spawnCode: 'weapon_assaultrifle_gold', image: 'https://images.unsplash.com/photo-1584285418504-005502939773?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Ferrari SF90', spawnCode: 'sf90', image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=400' },
];

const DEFAULT_ADMINS: Admin[] = [
  { id: '1', name: 'Vardas_Pavarde', role: 'Owner', status: 'Offline' },
  { id: '2', name: 'Kitas_Zmogus', role: 'Admin', status: 'Offline' },
  { id: '3', name: 'Trecias_Admin', role: 'Admin', status: 'Offline' },
];

// --- Components ---

const TabButton = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  disabled = false 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
  disabled?: boolean;
}) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 border-l-4 ${
      disabled 
        ? 'opacity-30 cursor-not-allowed border-transparent' 
        : active 
          ? 'border-blue-600 bg-blue-600/10 text-white' 
          : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-500' : ''} />
    <span className="text-[11px] uppercase font-bold tracking-widest">{label}</span>
  </button>
);

const GridItem = ({ item }: { item: Item }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800"
  >
    {item.image && (
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    )}
    <div className="bg-black/90 py-3 px-4 border-t border-blue-600/50">
      <span className="text-blue-600 font-black text-xs uppercase tracking-tighter italic">
        {item.name}
      </span>
    </div>
  </motion.div>
);

const SimpleItem = ({ item }: { item: Item }) => (
  <motion.div
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between group transition-colors"
  >
    <span className="text-zinc-300 font-bold text-xs uppercase tracking-widest group-hover:text-white">
      {item.name}
    </span>
    <div className="w-2 h-2 rounded-full bg-blue-600/30 group-hover:bg-blue-600 animate-pulse" />
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOpen, setIsOpen] = useState(true); // Default to true for preview visibility
  const [admins, setAdmins] = useState<Admin[]>(DEFAULT_ADMINS);
  const [playerData, setPlayerData] = useState<PlayerData>(MOCK_PLAYER);

  const kdRatio = (playerData.kills / Math.max(1, playerData.deaths)).toFixed(2);

  // --- FiveM Integration ---
  
  // Handle messages from Lua
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.type === 'ui') {
        setIsOpen(data.status);
      } else if (data.type === 'adminDataUpdate') {
        setAdmins(data.admins);
      } else if (data.type === 'playerDataUpdate') {
        setPlayerData(prev => ({ ...prev, ...data.playerData }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle Keyboard (ESC to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Helper to send data back to FiveM Lua scripts
  const sendToFiveM = async (endpoint: string, data: any = {}) => {
    try {
      // @ts-ignore - GetParentResourceName is global in FiveM NUI
      const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'esx_ui';
      await fetch(`https://${resourceName}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      // Silent error for browser preview
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    sendToFiveM('exit');
  };

  const handleAction = (item: Item, actionType: string) => {
    sendToFiveM('triggerAction', { 
      item, 
      actionType,
      spawnCode: item.spawnCode 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[1000px] h-[650px] bg-zinc-950 border border-zinc-800 shadow-2xl flex relative overflow-hidden rounded-3xl"
      >
        {/* Sidebar */}
        <div className="w-[240px] bg-zinc-950 border-r border-zinc-900 flex flex-col">
          {/* Logo Section - Top Left */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black italic tracking-tighter uppercase leading-none">
                ESX <span className="text-blue-600">SERVER</span>
              </h1>
              <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Dashboard</span>
            </div>
          </div>

          {/* Navigation Tabs - Left Side */}
          <nav className="flex-1 mt-4">
            <TabButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
              icon={Home} 
              label="Home" 
            />
            <TabButton 
              active={activeTab === 'items'} 
              onClick={() => setActiveTab('items')} 
              icon={Package} 
              label="Items" 
            />
            <TabButton 
              active={activeTab === 'cars'} 
              onClick={() => setActiveTab('cars')} 
              icon={Car} 
              label="Cars" 
            />
            <TabButton 
              active={activeTab === 'teleports'} 
              onClick={() => setActiveTab('teleports')} 
              icon={MapPin} 
              label="Teleports" 
            />
            <TabButton 
              active={activeTab === 'guns'} 
              onClick={() => setActiveTab('guns')} 
              icon={Sword} 
              label="Guns" 
            />
            <TabButton 
              active={activeTab === 'vip'} 
              onClick={() => setActiveTab('vip')} 
              icon={Crown} 
              label="VIP" 
            />
            <TabButton 
              active={activeTab === 'admins'} 
              onClick={() => setActiveTab('admins')} 
              icon={Users} 
              label="Admins" 
            />
            <TabButton 
              active={activeTab === 'rules'} 
              onClick={() => setActiveTab('rules')} 
              icon={FileText} 
              label="Rules" 
            />
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 pb-12 border-t border-zinc-900 mt-auto">
            <button 
              onClick={handleClose}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all w-full justify-center"
            >
              <X size={20} className="text-zinc-600 group-hover:text-blue-500" />
              <span className="text-[12px] uppercase font-black tracking-widest text-zinc-500 group-hover:text-blue-500">Uždaryti</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Bar */}
          <div className="h-1 bg-blue-600 absolute top-0 left-0 w-full z-10" />
          <div className="flex justify-end p-4">
            {/* Close button moved to sidebar */}
          </div>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 to-transparent">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-blue-600/40 p-1">
                          <img 
                            src={playerData.discordAvatar} 
                            alt="Discord Avatar" 
                            className="w-full h-full rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-black uppercase italic tracking-tight leading-tight">{playerData.name}</h2>
                          <p className="text-[10px] text-blue-500 font-mono uppercase tracking-widest mb-1">{playerData.discordName}</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Jūsų ID: {playerData.playerId}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                            <Wallet size={14} className="text-green-500" /> Cash
                          </div>
                          <span className="text-green-500 font-mono text-lg font-bold">${playerData.money.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                            <Shield size={14} className="text-blue-500" /> Bank
                          </div>
                          <span className="text-blue-500 font-mono text-lg font-bold">${playerData.bank.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                      <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-6">Combat Statistics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                          <Target size={16} className="text-blue-500 mb-2" />
                          <span className="text-xl font-black italic">{playerData.kills}</span>
                          <span className="text-[8px] uppercase font-bold text-zinc-600">Kills</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                          <Skull size={16} className="text-zinc-500 mb-2" />
                          <span className="text-xl font-black italic">{playerData.deaths}</span>
                          <span className="text-[8px] uppercase font-bold text-zinc-600">Deaths</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-blue-600/5 rounded-xl border border-blue-600/20">
                          <TrendingUp size={16} className="text-blue-600 mb-2" />
                          <span className="text-xl font-black italic text-blue-600">{kdRatio}</span>
                          <span className="text-[8px] uppercase font-bold text-blue-900/60">K/D Ratio</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-zinc-500">
                          <span>Health Status</span>
                          <span className="text-blue-500">{playerData.health}%</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${playerData.health}%` }}
                            className="h-full bg-gradient-to-r from-blue-900 to-blue-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-zinc-500">
                          <span>Armor Integrity</span>
                          <span className="text-blue-500">{playerData.armor}%</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${playerData.armor}%` }}
                            className="h-full bg-gradient-to-r from-blue-900 to-blue-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-10 text-center">
                      <Activity size={40} className="text-zinc-800 mb-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">System Log</h3>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                        Welcome back, Officer. Your current combat efficiency is rated as <span className="text-blue-600">Optimal</span>. 
                        Check the Items tab for equipment restock.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'items' && (
                <motion.div
                  key="items"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {ITEMS.map(item => (
                    <div key={item.id} onClick={() => handleAction(item, 'spawnItem')}>
                      <SimpleItem item={item} />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'cars' && (
                <motion.div
                  key="cars"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {CARS.map(car => (
                    <div key={car.id} onClick={() => handleAction(car, 'spawnCar')}>
                      <GridItem item={car} />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'teleports' && (
                <motion.div
                  key="teleports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {TELEPORTS.map(tp => (
                    <div key={tp.id} onClick={() => handleAction(tp, 'teleport')}>
                      <GridItem item={tp} />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'guns' && (
                <motion.div
                  key="guns"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {GUNS.map(gun => (
                    <div key={gun.id} onClick={() => handleAction(gun, 'giveWeapon')}>
                      <GridItem item={gun} />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'vip' && (
                <motion.div
                  key="vip"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  <div className={`grid grid-cols-2 gap-6 ${!playerData.vip ? 'opacity-20 pointer-events-none blur-sm' : ''}`}>
                    {VIP_ITEMS.map(item => (
                      <div key={item.id} onClick={() => handleAction(item, 'vipAction')}>
                        <GridItem item={item} />
                      </div>
                    ))}
                  </div>
                  {!playerData.vip && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                      <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 mb-6">
                        <Crown size={40} className="text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic tracking-tight mb-2">VIP Prieiga Užrakinta</h3>
                      <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest max-w-[300px] leading-relaxed">
                        Ši skiltis skirta tik VIP nariams. Norėdami gauti prieigą, susisiekite su administracija per Discord.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'admins' && (
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {admins.map(admin => (
                      <div 
                        key={admin.id}
                        className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                            admin.role === 'Owner' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-blue-500/30 bg-blue-500/5'
                          }`}>
                            <User size={24} className={admin.role === 'Owner' ? 'text-yellow-500' : 'text-blue-500'} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase italic tracking-tight">{admin.name}</h3>
                            <span className={`text-[9px] uppercase font-bold tracking-widest ${
                              admin.role === 'Owner' ? 'text-yellow-500' : 'text-blue-500'
                            }`}>{admin.role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${admin.status === 'Online' ? 'bg-green-500' : 'bg-zinc-700'}`} />
                          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">{admin.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <h3 className="text-blue-500 font-black uppercase tracking-widest text-xs mb-3">Bendrosios Taisyklės</h3>
                      <ul className="space-y-2 text-zinc-400 text-xs font-bold uppercase tracking-tight">
                        <li className="flex gap-3"><span className="text-blue-600">01.</span> Draudžiama naudoti bet kokias pagalbines programas (čytus).</li>
                        <li className="flex gap-3"><span className="text-blue-600">02.</span> Būtina laikytis RolePlay (RP) taisyklių.</li>
                        <li className="flex gap-3"><span className="text-blue-600">03.</span> Draudžiama įžeidinėti kitus žaidėjus.</li>
                        <li className="flex gap-3"><span className="text-blue-600">04.</span> Draudžiama išnaudoti žaidimo klaidas (bugus).</li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <h3 className="text-blue-500 font-black uppercase tracking-widest text-xs mb-3">Saugi Zona</h3>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-tight leading-relaxed">
                        Ligoninė, Policijos Departamentas ir Mechanikų dirbtuvės yra saugios zonos. Jose draudžiamas bet koks smurtas.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <h3 className="text-blue-500 font-black uppercase tracking-widest text-xs mb-3">Administracija</h3>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-tight leading-relaxed">
                        Administracijos sprendimai yra galutiniai. Jei nesutinkate su sprendimu, galite pateikti apeliaciją Discord serveryje.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          <div className="px-10 py-4 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center">
            <div className="text-[10px] uppercase font-black text-zinc-700 tracking-widest">
              Authorized Personnel Only
            </div>
            <div className="text-[10px] uppercase font-black text-zinc-500">
              Press <span className="text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded border border-blue-600/30">M</span> to Toggle
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
