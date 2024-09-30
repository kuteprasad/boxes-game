import Head from 'next/head';
import Game from './components/Game';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Boxes Game</title>
        <meta name="description" content="A simple boxes game in React" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Game />
      </main>
    </div>
  );
}