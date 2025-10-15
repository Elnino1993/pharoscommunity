"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Users, Percent, Trophy, Sparkles, ChevronRight, Volume2, VolumeX } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  prize: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of blockchain network is Pharos?",
    options: ["Layer 2 Rollup", "Modular & Full-stack Parallel L1", "Sidechain Network", "State Channel"],
    correctAnswer: 1,
    prize: "$100",
  },
  {
    id: 2,
    question: "How many primary layers does Pharos Network have?",
    options: ["2 layers", "3 layers", "4 layers", "5 layers"],
    correctAnswer: 1,
    prize: "$500",
  },
  {
    id: 3,
    question: "What does SPN stand for in Pharos Network?",
    options: [
      "Secure Processing Node",
      "Special Processing Network",
      "Shared Protocol Network",
      "Staking Pool Network",
    ],
    correctAnswer: 1,
    prize: "$1,000",
  },
  {
    id: 4,
    question: "Which layer provides industry-leading data availability and hardware acceleration?",
    options: ["L1-Core", "L1-Extension", "L1-Base", "L1-Advanced"],
    correctAnswer: 2,
    prize: "$5,000",
  },
  {
    id: 5,
    question: "What feature does L1-Core provide?",
    options: [
      "Smart contract deployment only",
      "High-throughput and sub-second finality",
      "Basic transaction processing",
      "Token minting services",
    ],
    correctAnswer: 1,
    prize: "$10,000",
  },
  {
    id: 6,
    question: "Which restaking protocols does Pharos integrate with?",
    options: ["Only Ethereum", "Polkadot and Cosmos", "Babylon and Eigenlayer", "Avalanche and Solana"],
    correctAnswer: 2,
    prize: "$50,000",
  },
  {
    id: 7,
    question: "What can SPNs run according to Pharos documentation?",
    options: [
      "Only blockchain networks",
      "Only sidechains",
      "Blockchain networks, sidechains, or non-blockchain apps like HFT, ZKML, and AI",
      "Only smart contracts",
    ],
    correctAnswer: 2,
    prize: "$100,000",
  },
  {
    id: 8,
    question: "What protocol does Pharos use for cross-chain asset interactions?",
    options: [
      "Basic Bridge Protocol",
      "Secure and confidential cross-chain interoperability protocol",
      "Standard Token Transfer",
      "Simple Swap Protocol",
    ],
    correctAnswer: 1,
    prize: "$250,000",
  },
  {
    id: 9,
    question: "Which layer uses the Adaptive Restaking Interaction Protocol?",
    options: ["Transaction Layer", "Data Layer", "Consensus Layer", "Application Layer"],
    correctAnswer: 2,
    prize: "$500,000",
  },
  {
    id: 10,
    question: "What does the Decentralized Data Exchange Protocol enable?",
    options: [
      "Only token swaps",
      "Synchronization with external data centers for AI and FHE use cases",
      "Basic data storage",
      "Simple file transfers",
    ],
    correctAnswer: 1,
    prize: "$1,000,000",
  },
]

const prizeList = [
  "$1,000,000",
  "$500,000",
  "$250,000",
  "$100,000",
  "$50,000",
  "$10,000",
  "$5,000",
  "$1,000",
  "$500",
  "$100",
]

export default function MillionaireGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameState, setGameState] = useState<"start" | "playing" | "correct" | "wrong" | "won">("start")
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    phoneAFriend: true,
    askAudience: true,
  })
  const [removedOptions, setRemovedOptions] = useState<number[]>([])
  const [showLifelineResult, setShowLifelineResult] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const correctAnswerRef = useRef<HTMLAudioElement | null>(null)
  const wrongAnswerRef = useRef<HTMLAudioElement | null>(null)
  const finalAnswerRef = useRef<HTMLAudioElement | null>(null)
  const winGameRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    backgroundMusicRef.current = new Audio("/sounds/millionaire-background.mp3")
    backgroundMusicRef.current.loop = true
    backgroundMusicRef.current.volume = 0.3

    correctAnswerRef.current = new Audio("/sounds/correct-answer.mp3")
    correctAnswerRef.current.volume = 0.5

    wrongAnswerRef.current = new Audio("/sounds/wrong-answer.mp3")
    wrongAnswerRef.current.volume = 0.5

    finalAnswerRef.current = new Audio("/sounds/final-answer.mp3")
    finalAnswerRef.current.volume = 0.4

    winGameRef.current = new Audio("/sounds/win-game.mp3")
    winGameRef.current.volume = 0.6

    return () => {
      backgroundMusicRef.current?.pause()
      correctAnswerRef.current?.pause()
      wrongAnswerRef.current?.pause()
      finalAnswerRef.current?.pause()
      winGameRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (!backgroundMusicRef.current) return

    if (soundEnabled && gameState === "playing") {
      backgroundMusicRef.current.play().catch(() => {})
    } else {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current.currentTime = 0
    }
  }, [gameState, soundEnabled])

  const playSound = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (!soundEnabled || !audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (soundEnabled) {
      backgroundMusicRef.current?.pause()
    }
  }

  const currentQ = questions[currentQuestion]

  const handleStart = () => {
    setGameState("playing")
  }

  const handleAnswerSelect = (index: number) => {
    if (gameState !== "playing") return
    setSelectedAnswer(index)
  }

  const handleFinalAnswer = () => {
    if (selectedAnswer === null) return

    playSound(finalAnswerRef)

    if (selectedAnswer === currentQ.correctAnswer) {
      setGameState("correct")
      setTimeout(() => {
        playSound(correctAnswerRef)
      }, 1000)

      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          setGameState("won")
          playSound(winGameRef)
        } else {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setGameState("playing")
          setRemovedOptions([])
          setShowLifelineResult(null)
        }
      }, 2000)
    } else {
      setGameState("wrong")
      setTimeout(() => {
        playSound(wrongAnswerRef)
      }, 1000)
    }
  }

  const handleFiftyFifty = () => {
    if (!lifelines.fiftyFifty || gameState !== "playing") return

    const wrongAnswers = currentQ.options.map((_, index) => index).filter((index) => index !== currentQ.correctAnswer)

    const toRemove = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2)
    setRemovedOptions(toRemove)
    setLifelines({ ...lifelines, fiftyFifty: false })
  }

  const handlePhoneAFriend = () => {
    if (!lifelines.phoneAFriend || gameState !== "playing") return

    const confidence = Math.random() > 0.2 ? "pretty sure" : "thinks"
    setShowLifelineResult(
      `Your friend ${confidence} the answer is ${String.fromCharCode(65 + currentQ.correctAnswer)}: ${currentQ.options[currentQ.correctAnswer]}`,
    )
    setLifelines({ ...lifelines, phoneAFriend: false })

    setTimeout(() => setShowLifelineResult(null), 5000)
  }

  const handleAskAudience = () => {
    if (!lifelines.askAudience || gameState !== "playing") return

    const percentages = [0, 0, 0, 0]
    percentages[currentQ.correctAnswer] = 60 + Math.floor(Math.random() * 25)

    let remaining = 100 - percentages[currentQ.correctAnswer]
    currentQ.options.forEach((_, index) => {
      if (index !== currentQ.correctAnswer) {
        const amount = Math.floor(Math.random() * remaining)
        percentages[index] = amount
        remaining -= amount
      }
    })
    percentages[currentQ.options.findIndex((_, i) => i !== currentQ.correctAnswer && percentages[i] === 0)] += remaining

    setShowLifelineResult(
      `Audience votes: ${currentQ.options.map((opt, i) => `${String.fromCharCode(65 + i)}: ${percentages[i]}%`).join(", ")}`,
    )
    setLifelines({ ...lifelines, askAudience: false })

    setTimeout(() => setShowLifelineResult(null), 7000)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setGameState("start")
    setLifelines({ fiftyFifty: true, phoneAFriend: true, askAudience: true })
    setRemovedOptions([])
    setShowLifelineResult(null)
  }

  if (gameState === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 border-primary hover:bg-primary/20 bg-transparent"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

        <Card className="relative z-10 max-w-2xl w-full p-12 text-center border-2 border-primary glow-blue bg-card/95 backdrop-blur">
          <div className="mb-8">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-accent animate-pulse" />
            <h1 className="text-5xl font-bold mb-4 text-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Who Wants to Be a Pharos Millionaire?
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Test your knowledge about Pharos Network</p>
            <p className="text-sm text-muted-foreground">Answer 10 questions correctly to win $1,000,000!</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-primary text-primary">
                <Phone className="w-3 h-3 mr-1" />
                Phone a Friend
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                <Percent className="w-3 h-3 mr-1" />
                50:50
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                <Users className="w-3 h-3 mr-1" />
                Ask Audience
              </Badge>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-6 glow-gold"
          >
            Start Game
            <ChevronRight className="ml-2 w-6 h-6" />
          </Button>
        </Card>
      </div>
    )
  }

  if (gameState === "won") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 border-primary hover:bg-primary/20 bg-transparent"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <Card className="relative z-10 max-w-2xl w-full p-12 text-center border-2 border-accent glow-gold bg-card/95 backdrop-blur">
          <Trophy className="w-32 h-32 mx-auto mb-6 text-accent animate-bounce" />
          <h1 className="text-6xl font-bold mb-4 text-accent text-glow">$1,000,000!</h1>
          <p className="text-2xl mb-8">Congratulations! You're a Pharos Network Expert! 🎉</p>
          <Button
            size="lg"
            onClick={handleRestart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-12 py-6"
          >
            Play Again
          </Button>
        </Card>
      </div>
    )
  }

  if (gameState === "wrong") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 border-primary hover:bg-primary/20 bg-transparent"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <Card className="relative z-10 max-w-2xl w-full p-12 text-center border-2 border-destructive bg-card/95 backdrop-blur">
          <h1 className="text-5xl font-bold mb-4 text-destructive">Game Over</h1>
          <p className="text-xl mb-4">
            The correct answer was:{" "}
            <span className="text-accent font-bold">{String.fromCharCode(65 + currentQ.correctAnswer)}</span>
          </p>
          <p className="text-lg mb-2 text-muted-foreground">{currentQ.options[currentQ.correctAnswer]}</p>
          <p className="text-2xl mb-8 text-primary font-bold">
            You won: {currentQuestion > 0 ? questions[currentQuestion - 1].prize : "$0"}
          </p>
          <Button
            size="lg"
            onClick={handleRestart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-12 py-6"
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSound}
        className="absolute top-4 right-4 z-20 border-primary hover:bg-primary/20 bg-transparent"
        aria-label="Toggle sound"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-lg px-4 py-2 border-primary text-primary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge className="text-lg px-4 py-2 bg-accent text-accent-foreground glow-gold">{currentQ.prize}</Badge>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleFiftyFifty}
                disabled={!lifelines.fiftyFifty}
                className="border-primary hover:bg-primary/20 disabled:opacity-30 bg-transparent"
              >
                <Percent className="w-5 h-5 mr-2" />
                50:50
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePhoneAFriend}
                disabled={!lifelines.phoneAFriend}
                className="border-primary hover:bg-primary/20 disabled:opacity-30 bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                Phone
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAskAudience}
                disabled={!lifelines.askAudience}
                className="border-primary hover:bg-primary/20 disabled:opacity-30 bg-transparent"
              >
                <Users className="w-5 h-5 mr-2" />
                Audience
              </Button>
            </div>

            {showLifelineResult && (
              <Card className="p-4 border-accent bg-accent/10 animate-in fade-in slide-in-from-top-4">
                <p className="text-center text-accent font-semibold">{showLifelineResult}</p>
              </Card>
            )}

            <Card className="p-8 border-2 border-primary glow-blue bg-card/95 backdrop-blur">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-balance leading-relaxed">
                {currentQ.question}
              </h2>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => {
                const isRemoved = removedOptions.includes(index)
                const isSelected = selectedAnswer === index
                const isCorrect = gameState === "correct" && index === currentQ.correctAnswer
                const isWrong = gameState === "wrong" && isSelected && index !== currentQ.correctAnswer
                const showCorrect = gameState === "wrong" && index === currentQ.correctAnswer

                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isRemoved || gameState !== "playing"}
                    className={`
                      h-auto min-h-[80px] p-6 text-left justify-start text-lg font-semibold
                      border-2 transition-all duration-300
                      ${isRemoved ? "opacity-20 cursor-not-allowed" : ""}
                      ${isSelected && gameState === "playing" ? "border-accent bg-accent/20 glow-gold" : "border-primary hover:bg-primary/20 hover:border-accent"}
                      ${isCorrect ? "border-green-500 bg-green-500/20 glow-blue" : ""}
                      ${isWrong ? "border-destructive bg-destructive/20" : ""}
                      ${showCorrect ? "border-green-500 bg-green-500/20" : ""}
                    `}
                  >
                    <span className="mr-4 text-accent">{String.fromCharCode(65 + index)}:</span>
                    <span className="flex-1 text-balance">{option}</span>
                  </Button>
                )
              })}
            </div>

            {selectedAnswer !== null && gameState === "playing" && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleFinalAnswer}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl px-12 py-6 glow-gold animate-in fade-in slide-in-from-bottom-4"
                >
                  Final Answer
                </Button>
              </div>
            )}
          </div>

          <Card className="p-6 border-2 border-primary bg-card/95 backdrop-blur h-fit sticky top-8">
            <h3 className="text-xl font-bold mb-4 text-center text-primary">Prize Ladder</h3>
            <div className="space-y-2">
              {prizeList.map((prize, index) => {
                const questionIndex = prizeList.length - 1 - index
                const isCurrent = questionIndex === currentQuestion
                const isPassed = questionIndex < currentQuestion

                return (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg text-center font-bold transition-all
                      ${isCurrent ? "bg-accent text-accent-foreground glow-gold scale-105" : ""}
                      ${isPassed ? "bg-primary/20 text-primary" : ""}
                      ${!isCurrent && !isPassed ? "bg-secondary/50 text-muted-foreground" : ""}
                    `}
                  >
                    {prize}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
