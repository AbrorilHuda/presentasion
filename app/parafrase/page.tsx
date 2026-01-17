'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Loader2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ParafrasePage() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [style, setStyle] = useState('formal');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const styles = [
        { value: 'formal', label: 'Formal' },
        { value: 'kasual', label: 'Kasual' },
        { value: 'ringkas', label: 'Ringkas' },
        { value: 'detail', label: 'Detail' },
        { value: 'akademik', label: 'Akademik' },
        { value: 'kreatif', label: 'Kreatif' },
    ];

    const handleParafrase = async () => {
        if (!inputText.trim()) {
            toast({
                title: 'Error',
                description: 'Silakan masukkan teks yang ingin diparafrase',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setOutputText('');
        setError('');
        setIsCopied(false);

        try {
            const response = await fetch('/api/parafrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText,
                    style: style,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Gagal melakukan parafrase');
                throw new Error(data.error || 'Gagal melakukan parafrase');
            }

            setOutputText(data.result);
            toast({
                title: 'Berhasil!',
                description: 'Teks berhasil diparafrase',
            });
        } catch (error: any) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Gagal melakukan parafrase',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!outputText) return;

        try {
            await navigator.clipboard.writeText(outputText);
            setIsCopied(true);
            toast({
                title: 'Berhasil!',
                description: 'Teks berhasil disalin ke clipboard',
            });

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Copy error:', error);
            toast({
                title: 'Error',
                description: 'Gagal menyalin teks',
                variant: 'destructive',
            });
        }
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
        setError('');
        setIsCopied(false);
    };

    const renderFormattedText = (text: string) => {
        return text.split('\n').map((line, i) => {
            const segments: React.ReactNode[] = [];
            let key = 0;

            const boldRegex = /\*\*(.*?)\*\*/g;
            let lastIndex = 0;
            let match;

            while ((match = boldRegex.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    segments.push(
                        <span key={`${i}-${key++}`}>{line.substring(lastIndex, match.index)}</span>
                    );
                }
                segments.push(<strong key={`${i}-${key++}`}>{match[1]}</strong>);
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex < line.length) {
                segments.push(<span key={`${i}-${key++}`}>{line.substring(lastIndex)}</span>);
            }

            if (segments.length === 0) {
                return (
                    <p key={i} className="mb-2">
                        {line || <br />}
                    </p>
                );
            }

            return (
                <p key={i} className="mb-2">
                    {segments}
                </p>
            );
        });
    };

    return (
        <main className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-br from-background to-muted">
            <div className="max-w-7xl w-full mx-auto space-y-6">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Parafrase AI
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Parafrase teks Anda dengan bantuan  AI
                    </p>
                </header>

                {error && (
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-destructive mb-1">Error</h3>
                                    <p className="text-sm text-muted-foreground">{error}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Teks Asli</CardTitle>
                            <CardDescription>Masukkan teks yang ingin diparafrase</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ketik atau paste teks Anda di sini...&#10;&#10;Contoh: Teknologi kecerdasan buatan telah mengalami perkembangan yang sangat pesat dalam beberapa tahun terakhir."
                                className="min-h-[400px] resize-y"
                            />

                            <div className="space-y-2">
                                <Label htmlFor="style">Gaya Parafrase</Label>
                                <Select value={style} onValueChange={setStyle}>
                                    <SelectTrigger id="style">
                                        <SelectValue placeholder="Pilih gaya" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {styles.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleParafrase}
                                    disabled={isLoading || !inputText.trim()}
                                    className="flex-1"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Parafrase
                                        </>
                                    )}
                                </Button>
                                <Button onClick={handleClear} variant="outline" size="lg">
                                    Clear
                                </Button>
                            </div>

                            {inputText && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Karakter:</strong> {inputText.length} | <strong>Kata:</strong>{' '}
                                        {inputText.split(/\s+/).filter((w) => w.length > 0).length}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Hasil Parafrase</CardTitle>
                            <CardDescription>Teks yang telah diparafrase oleh AI</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <div className="min-h-[400px] p-2 rounded-md border bg-muted/50 overflow-auto">
                                    {outputText ? (
                                        <div className="text-sm leading-relaxed">
                                            {renderFormattedText(outputText)}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            Hasil parafrase akan muncul di sini...
                                        </p>
                                    )}
                                </div>
                                {outputText && (
                                    <Button
                                        onClick={handleCopy}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        title={isCopied ? 'Tersalin!' : 'Copy hasil'}
                                    >
                                        {isCopied ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}
                            </div>

                            {outputText && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Karakter:</strong> {outputText.length} | <strong>Kata:</strong>{' '}
                                        {outputText.split(/\s+/).filter((w) => w.length > 0).length}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        💡 <strong>Tips:</strong> Pilih gaya parafrase yang sesuai dengan kebutuhan Anda.
                        Hasil parafrase akan mempertahankan makna asli dengan kata-kata yang berbeda.
                    </p>
                </div>
            </div>
        </main>
    );
}
