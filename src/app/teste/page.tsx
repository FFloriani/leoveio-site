import type { Metadata } from 'next';
import TwitchPlayer from '@/components/TwitchPlayer';

export const metadata: Metadata = {
	title: 'Teste - Twitch ffloriani',
	robots: {
		index: false,
		follow: false,
	},
};

export default function TestPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-5xl">
				<TwitchPlayer channel="ffloriani" />
			</div>
		</div>
	);
} 