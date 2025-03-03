"use client";

import { Card } from "@/components/ui/card";
import Head from "next/head";
import { useEffect, useState } from "react";

// Définir l'interface pour le Player YouTube
interface YouTubePlayer {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
}

// Définir l'interface pour les options du Player YouTube
interface PlayerOptions {
  height: string | number;
  width: string | number;
  playerVars?: {
    autoplay?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

// Mettre à jour le type de window
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (elementId: string, options: PlayerOptions) => YouTubePlayer;
    };
  }
}

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [clickedGames, setClickedGames] = useState<Set<number>>(new Set());
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const games = [
    {
      id: 1,
      name: "Uncharted (2007)",
      url: "https://youtu.be/CeUYzDgs498?si=B9OHISlMYRK3dLBl",
    },
    {
      id: 2,
      name: "Sekiro (2019)",
      url: "https://youtu.be/IBpcUlfaJcY?si=LldQdimVMWnbNtik",
    },
    {
      id: 3,
      name: "Pac-Man (1980)",
      url: "https://youtu.be/M2Ht83lKLjQ?si=Uz6bQtdQaBMtF2id",
    },
    {
      id: 4,
      name: "Donkey Kong (1981)",
      url: "https://www.youtube.com/watch?v=GKYUNtGrShc",
    },
    {
      id: 5,
      name: "Elden Ring (2022)",
      url: "https://youtu.be/ZfGqwHDK2Uw?si=dwWFDaujYldedR3P",
    },
    {
      id: 6,
      name: "The Legend of Zelda (1986)",
      url: "https://youtu.be/uyMKWJ5e1kg?si=R1KsWG3EFY_v7Idi",
    },
    {
      id: 7,
      name: "Metroid (1987)",
      url: "https://youtu.be/M-U3sVX2G3w?si=88Na0b_moMLFuHsd",
    },
    {
      id: 8,
      name: "Fortnite (2017)",
      url: "https://youtu.be/2q-k7ScMs0k?si=oFFcjdWPAgcyp23P",
    },
    {
      id: 9,
      name: "Super Smash Brawl (2008)",
      url: "https://youtu.be/zeKE0NHUtUw?si=n6nU1v8erV6rTUNc",
    },
    {
      id: 10,
      name: "Sonic the Hedgehog (1992)",
      url: "https://youtu.be/G-i8HYi1QH0?si=BlbweDgLxvHS_GVN",
    },
    {
      id: 11,
      name: "Doom (1993)",
      url: "https://youtu.be/BSsfjHCFosw?si=TbdpnJK-8iq5PO9V",
    },
    {
      id: 12,
      name: "The Elder Scrolls IV: Oblivion (2006)",
      url: "https://youtu.be/XpJEg6MTPzc?si=cFQC7rNqAXa-4V4O",
    },
    {
      id: 13,
      name: "Spyro (1999)",
      url: "https://youtu.be/LPOnak-ozjw?si=9jvHXC07LKIvAP-z",
    },
    {
      id: 14,
      name: "Detroit Become Human (2018)",
      url: "https://youtu.be/nJ0Nk07_5po?si=e2Wz5X_dZtOGHx6s",
    },
    {
      id: 15,
      name: "Grand Theft Auto III (2001)",
      url: "https://youtu.be/WlCaDv6bXjk?si=gis4cs8U-hNqhZkx",
    },
    {
      id: 16,
      name: "Halo: Combat Evolved (2002)",
      url: "https://youtu.be/0jXTBAGv9ZQ?si=QePD_vsPYYp0Y3S0",
    },
    {
      id: 17,
      name: "World of Warcraft (2004)",
      url: "https://youtu.be/QYidb1LvMs8?si=8nVk0wf2l9gFexaj",
    },
    {
      id: 18,
      name: "Final Fantasy VII (1997)",
      url: "https://youtu.be/7HV3oyxr0Eg?si=76EZqbtGGQOJ_RYp",
    },
    { id: 19, name: "God of War (2005)", url: "https://youtu.be/1vYktiU-zdI" },
    {
      id: 20,
      name: "Borderlands 2 (2012)",
      url: "https://youtu.be/ebG0dkxe9-A?si=WPRwBvCE35n8D-t7",
    },
    {
      id: 21,
      name: "Red Dead Redemption (2010)",
      url: "https://youtu.be/hRMtt8tES-U?si=92EGnbEK6DKnDYrM",
    },
    {
      id: 22,
      name: "Doom (1993) (Encore)",
      url: "https://youtu.be/BSsfjHCFosw?si=TbdpnJK-8iq5PO9V",
    },
    {
      id: 23,
      name: "Pokémon Bleu (1996)",
      url: "https://youtu.be/NdJQopRuH1E?si=tWVP1D1JfifqE_Xc",
    },
    {
      id: 24,
      name: "The Last of Us (2013)",
      url: "https://youtu.be/pfA5UqEU_80?si=xUSYi1TMdkDTmjBC",
    },
    {
      id: 25,
      name: "League of Legends (2009)",
      url: "https://youtu.be/fmI_Ndrxy14?si=BfzMTmk0mUF7g44G",
    },
    {
      id: 26,
      name: "The Witcher 3: Wild Hunt (2015)",
      url: "https://youtu.be/viM0-3PXef0?si=gNXDL5rzpZ9dmDSp",
    },
    {
      id: 27,
      name: "Overwatch (2016)",
      url: "https://youtu.be/PDanWcodhOQ?si=TKYeqhoeXVhepDXU",
    },
    {
      id: 28,
      name: "Silent Hill (1999)",
      url: "https://youtu.be/w2cK8mOG4Q8?si=4QQH2uWmFCLzEDbb",
    },
    {
      id: 29,
      name: "Cyberpunk 2077 (2020)",
      url: "https://youtu.be/CHENRaquRHo?si=AxyuWrWak7Cpe5Ev",
    },
    {
      id: 30,
      name: "Super Mario Bros. (1985)",
      url: "https://youtu.be/NTa6Xbzfq1U?si=7rBKrstsRqLYbqjF",
    },
  ];

  // Ajouter un useEffect pour charger l'API YouTube
  useEffect(() => {
    // Charger l'API YouTube
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Définir la fonction onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
        },
      });
      setPlayer(newPlayer);
    };
  }, []);

  const handleGameClick = (gameId: number) => {
    setSelectedGame(gameId);
    setClickedGames(prev => new Set(prev).add(gameId));

    const game = games.find((g) => g.id === gameId);
    if (game && player) {
      const videoId = game.url.match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/
      )?.[1];

      if (videoId) {
        player.loadVideoById(videoId);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Grille de Jeux Vidéo</title>
        <meta name="description" content="Grille interactive de jeux vidéo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Hister
        </h1>

        {/* Ajouter un div invisible pour le lecteur YouTube */}
        <div id="youtube-player" style={{ display: "none" }}></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`p-4 py-8 cursor-pointer transition-colors duration-200 hover:shadow-lg 
                ${
                  selectedGame === game.id && isPlaying
                    ? "bg-green-500 text-white"
                    : clickedGames.has(game.id)
                    ? "bg-red-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                }`}
              onClick={() => handleGameClick(game.id)}
            >
              <div className="flex items-center justify-center">
                <span className="font-bold text-lg">{game.id}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
