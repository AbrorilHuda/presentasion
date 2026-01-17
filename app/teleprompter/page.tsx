'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeleprompterPage() {
    const [text, setText] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState([3]);
    const [fontSize, setFontSize] = useState([32]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const animationRef = useRef<number | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isRunning) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const animate = () => {
            setCurrentPosition((prev) => {
                const newPosition = prev + speed[0] * 0.5;


                if (contentRef.current && displayRef.current) {
                    const contentHeight = contentRef.current.offsetHeight;
                    const displayHeight = displayRef.current.offsetHeight;

                    if (newPosition >= contentHeight + displayHeight) {
                        setIsRunning(false);
                        return 0;
                    }
                }

                return newPosition;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isRunning, speed]);

    const handleStart = () => {
        if (!text.trim()) {
            alert('Silakan masukkan teks terlebih dahulu!');
            return;
        }
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentPosition(0);
    };

    const handleFontSizeChange = (size: number) => {
        setFontSize([size]);
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !(e.target as HTMLElement).matches('textarea')) {
                e.preventDefault();
                if (text.trim()) {
                    setIsRunning((prev) => !prev);
                }
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                handleReset();
            } else if (e.code === 'KeyF') {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.code === 'KeyH') {
                e.preventDefault();
                setShowHelp((prev) => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [text]);


    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);

            if (document.fullscreenElement) {
                setShowHelp(true);
                setTimeout(() => setShowHelp(false), 3000);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <main className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-br from-background to-muted">
            <div className="max-w-7xl w-full mx-auto space-y-6">

                <header className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Teleprompter
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Masukkan teks Anda dan atur kecepatan gulir sesuai keinginan
                    </p>
                </header>


                <Card className="overflow-hidden" ref={containerRef}>
                    <CardContent className="p-0 relative">

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-30 bg-black/50 hover:bg-black/70"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? (
                                <Minimize className="w-4 h-4 text-white" />
                            ) : (
                                <Maximize className="w-4 h-4 text-white" />
                            )}
                        </Button>

                        <div
                            ref={displayRef}
                            className={cn(
                                "overflow-hidden relative bg-black",
                                isFullscreen ? "h-screen" : "h-[500px]"
                            )}
                        >
                            <div className="absolute left-0 right-0 top-1/2 h-1 bg-primary/60 pointer-events-none z-20 shadow-lg shadow-primary/50" />

                            <div
                                className="absolute inset-0 pointer-events-none z-10"
                                style={{
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.85) 100%)'
                                }}
                            />


                            {isFullscreen && showHelp && (
                                <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm animate-in fade-in slide-in-from-bottom-2">
                                    <div className="font-semibold mb-2 text-primary">⌨️ Keyboard Shortcuts</div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 min-w-[60px] text-center">Space</kbd>
                                            <span className="text-white/80">Mulai / Pause</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 min-w-[60px] text-center">R</kbd>
                                            <span className="text-white/80">Reset</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 min-w-[60px] text-center">F</kbd>
                                            <span className="text-white/80">Fullscreen</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 min-w-[60px] text-center">H</kbd>
                                            <span className="text-white/80">Toggle Help</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isFullscreen && (
                                <div className="absolute top-4 left-4 z-30 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                                    <div
                                        className={cn(
                                            'w-2 h-2 rounded-full',
                                            isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                        )}
                                    />
                                    <span className="text-white text-sm font-medium">
                                        {isRunning ? 'Berjalan' : 'Siap'}
                                    </span>
                                    <span className="text-white/60 text-xs ml-2">
                                        {speed[0].toFixed(1)}x
                                    </span>
                                </div>
                            )}
                            <div
                                ref={contentRef}
                                className="text-center text-white whitespace-pre-wrap p-8 transition-transform duration-100 ease-linear"
                                style={{
                                    fontSize: `${fontSize[0]}px`,
                                    lineHeight: '2',
                                    transform: `translateY(${displayRef.current ? displayRef.current.offsetHeight / 2 : 250}px) translateY(-${currentPosition}px)`,
                                }}
                            >
                                {text || 'Teks Anda akan muncul di sini...'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Input Teks</CardTitle>
                            <CardDescription>
                                Ketik atau paste teks yang akan ditampilkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="min-h-[200px] resize-y font-mono"
                                placeholder="Ketik atau paste teks Anda di sini...&#10;&#10;Teks akan berjalan otomatis dari bawah ke atas seperti teleprompter profesional.&#10;&#10;Anda bisa mengatur kecepatan dan ukuran font sesuai kebutuhan!"
                            />
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Pengaturan</CardTitle>
                            <CardDescription>
                                Atur kecepatan dan tampilan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Kecepatan
                                    </label>
                                    <span className="text-sm font-semibold text-primary">
                                        {speed[0].toFixed(1)}x
                                    </span>
                                </div>
                                <Slider
                                    value={speed}
                                    onValueChange={setSpeed}
                                    min={1}
                                    max={10}
                                    step={0.5}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Ukuran Font
                                    </label>
                                    <span className="text-sm font-semibold text-primary">
                                        {fontSize[0]}px
                                    </span>
                                </div>
                                <Slider
                                    value={fontSize}
                                    onValueChange={setFontSize}
                                    min={16}
                                    max={72}
                                    step={4}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    Ukuran Cepat
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFontSizeChange(24)}
                                    >
                                        S
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFontSizeChange(32)}
                                    >
                                        M
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFontSizeChange(48)}
                                    >
                                        L
                                    </Button>
                                </div>
                            </div>


                            <div className="grid grid-cols-4 gap-2 pt-4">
                                <Button
                                    onClick={handleStart}
                                    disabled={isRunning || !text.trim()}
                                    size="sm"
                                    className="w-full"
                                >
                                    <Play className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={handlePause}
                                    disabled={!text.trim()}
                                    variant="secondary"
                                    size="sm"
                                    className="w-full"
                                >
                                    {isRunning ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={toggleFullscreen}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    {isFullscreen ? (
                                        <Minimize className="w-4 h-4" />
                                    ) : (
                                        <Maximize className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>


                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                <div
                                    className={cn(
                                        'w-3 h-3 rounded-full',
                                        isRunning ? 'bg-green-500 animate-pulse' : 'bg-destructive'
                                    )}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {isRunning ? 'Berjalan' : 'Siap'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        💡 <strong>Tips:</strong> Tekan{' '}
                        <kbd className="px-2 py-1 bg-muted rounded border">Space</kbd> untuk
                        mulai/pause, <kbd className="px-2 py-1 bg-muted rounded border">R</kbd>{' '}
                        untuk reset, <kbd className="px-2 py-1 bg-muted rounded border">F</kbd>{' '}
                        untuk fullscreen
                    </p>
                </div>
            </div>
        </main>
    );
}
