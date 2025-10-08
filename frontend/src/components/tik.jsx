import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// === ICONS (Inline SVG, pengganti lucide-react) ===
const UploadCloudIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const PackageCheckIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/><path d="M20 6 9 17l-5-5"/></svg>;
const DownloadIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const LoaderCircleIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// === UI COMPONENTS ===
const Card = ({ children, className = '' }) => <div className={`bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`mb-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, icon, className = '' }) => <h2 className={`text-2xl font-semibold flex items-center text-gray-100 ${className}`}>{icon && <span className="text-3xl mr-3">{icon}</span>}{children}</h2>;
const CardContent = ({ children, className = '' }) => <div className={className}>{children}</div>;
const Button = ({ children, onClick, disabled = false, className = '' }) => <button onClick={onClick} disabled={disabled} className={`w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 ${className}`}>{children}</button>;
const Label = ({ children, htmlFor, className = '' }) => <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}>{children}</label>;
const Input = (props) => <input {...props} className={`mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-gray-700 text-white ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 ${props.className || ''}`} />;
const Select = ({ children, ...props }) => <select {...props} className={`mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 bg-gray-700 text-white ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 ${props.className || ''}`}>{children}</select>;
const Textarea = (props) => <textarea {...props} className={`mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-gray-700 text-white ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 ${props.className || ''}`} />;


// === MAIN APP COMPONENT ===
export default function TikTokAffiliateAutoContentGenerator() {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Step 1 State
    const [productImage, setProductImage] = useState(null);
    const [productImageUrl, setProductImageUrl] = useState('');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    
    // Step 2 State
    const [productDescription, setProductDescription] = useState('');
    const [generatedText, setGeneratedText] = useState(null);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    
    // Step 3 State
    const [sourceText, setSourceText] = useState('');
    const [voiceStyle, setVoiceStyle] = useState('Wanita Natural 🇮🇩');
    const [generatedScripts, setGeneratedScripts] = useState(null);
    const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
    
    // Final State
    const [isDownloading, setIsDownloading] = useState(false);

    const finalOutputRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL || ''; // Untuk Vercel, ini akan kosong dan menggunakan path relatif

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);
            setProductImageUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerateImages = async () => {
        if (!productImage) return alert("Harap unggah gambar produk.");
        setIsGeneratingImages(true);
        const imageBase64 = await toBase64(productImage);
        try {
            const res = await fetch(`${API_URL}/api/image/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64, theme: "Minimalis" }), // Tema bisa dibuat dinamis
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setGeneratedImages(data.imageUrls.map(url => ({ theme: '', url })));
            setCurrentStep(2);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Gagal menghasilkan gambar. Cek konsol untuk detail.");
        } finally {
            setIsGeneratingImages(false);
        }
    };
    
    const handleGenerateText = async () => {
        if (!productDescription) return alert("Harap masukkan deskripsi produk.");
        setIsGeneratingText(true);
        try {
            const res = await fetch(`${API_URL}/api/text/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productDescription }),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setGeneratedText(data);
            setSourceText(data.caption); // Default source text for Step 3
            setCurrentStep(3);
        } catch (error) {
             console.error("Fetch error:", error);
            alert("Gagal menghasilkan teks. Cek konsol untuk detail.");
        } finally {
            setIsGeneratingText(false);
        }
    };

    const handleGenerateScripts = async () => {
        if (!sourceText) return alert("Harap pilih sumber teks.");
        setIsGeneratingScripts(true);
        try {
            const res = await fetch(`${API_URL}/api/voice-video/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceText, voiceStyle }),
            });
             if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setGeneratedScripts(data);
            setCurrentStep(4);
            setTimeout(() => finalOutputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Gagal menghasilkan voice over. Cek konsol untuk detail.");
        } finally {
            setIsGeneratingScripts(false);
        }
    };
    
    const handleDownloadZip = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            
            // Tambahkan gambar ke ZIP
            const imagePromises = generatedImages.map(async (img, i) => {
                const response = await fetch(img.url);
                const blob = await response.blob();
                zip.file(`images/image_${i + 1}.png`, blob);
            });
            await Promise.all(imagePromises);

            // Tambahkan file teks
            const textContent = `[Hook]\n${generatedText.hook}\n\n[Caption TikTok]\n${generatedText.caption}\n\n[Deskripsi Produk]\n${generatedText.description}\n\n[Call to Action]\n${generatedText.cta}`;
            zip.file('captions.txt', textContent);
            zip.file('voice-script.txt', generatedScripts.voiceScript);
            zip.file('video-prompt.txt', generatedScripts.videoPrompt);
            
            // Konversi base64 audio ke Blob dan tambahkan ke ZIP
            const audioBlob = await (await fetch(`data:audio/mp3;base64,${generatedScripts.audioBase64}`)).blob();
            zip.file('audio/voice_over.mp3', audioBlob);
            
            // Generate dan unduh ZIP
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "tiktok-affiliate-content.zip");
        } catch (error) {
            console.error("Error creating ZIP file:", error);
            alert("Gagal membuat file ZIP.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="container mx-auto max-w-4xl p-4 sm:p-8">
                <header className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        TikTok Affiliate Auto Content Generator
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                        Buat konten TikTok Affiliate dalam sekejap. Dapatkan variasi gambar, caption, script, dan prompt video AI secara otomatis.
                    </p>
                </header>
                <main className="space-y-8">
                    {/* STEP 1 */}
                    <Card><CardHeader><CardTitle icon="🖼️">Step 1: Foto Produk</CardTitle></CardHeader><CardContent><div className="grid lg:grid-cols-2 gap-8"><div className="space-y-6"><Label htmlFor="file-upload">Upload Gambar Produk</Label><div className="mt-2 flex justify-center items-center rounded-lg border-2 border-dashed border-gray-600 px-6 py-10 hover:border-blue-500 transition-colors bg-gray-900/50">{productImageUrl ? <img src={productImageUrl} alt="Pratinjau Produk" className="max-h-32 rounded-lg" /> : <div className="text-center"><UploadCloudIcon className="mx-auto h-12 w-12 text-gray-500" /><label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-400 hover:text-blue-500"><span>Unggah file</span><input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" /></label></div>}</div><Button onClick={handleGenerateImages} disabled={isGeneratingImages || !productImage}>{isGeneratingImages ? <><LoaderCircleIcon className="animate-spin h-5 w-5" /> Generating...</> : 'Generate Images'}</Button></div><div><h3 className="font-semibold text-lg mb-4 text-gray-200">Hasil Generate</h3><div className="grid grid-cols-2 gap-4">{isGeneratingImages ? Array(4).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-700 rounded-lg animate-pulse" />) : generatedImages.length > 0 ? generatedImages.map((img, i) => <div key={i}><img src={img.url} alt={`Generated ${i}`} className="aspect-square bg-gray-700 rounded-lg object-cover" /></div>) : Array(4).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-700/50 rounded-lg" />)}</div></div></div></CardContent></Card>
                    
                    {/* STEP 2 */}
                    {currentStep >= 2 && <div className="transition-opacity duration-500"><Card><CardHeader><CardTitle icon="📝">Step 2: Narasi & Deskripsi</CardTitle></CardHeader><CardContent><div className="grid lg:grid-cols-2 gap-8"><div className="space-y-6"><Label htmlFor="product-desc">Deskripsi Singkat Produk</Label><Textarea rows={5} id="product-desc" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Contoh: Kaos oversize bahan katun premium, adem, tidak mudah kusut, tersedia dalam 5 warna." /><Button onClick={handleGenerateText} disabled={isGeneratingText || !productDescription}>{isGeneratingText ? <><LoaderCircleIcon className="animate-spin h-5 w-5" /> Generating...</> : 'Generate Caption & Deskripsi'}</Button></div><div><h3 className="font-semibold text-lg mb-4 text-gray-200">Hasil Teks</h3>{isGeneratingText ? <div className="space-y-4"><div className="h-24 bg-gray-700 rounded-lg animate-pulse" /></div> : generatedText && <div className="space-y-3 text-sm text-gray-300 bg-gray-900/50 p-4 rounded-lg"><p><strong className="text-blue-400">Hook:</strong> {generatedText.hook}</p><p><strong className="text-blue-400">Caption:</strong> {generatedText.caption}</p></div>}</div></div></CardContent></Card></div>}
                    
                    {/* STEP 3 */}
                    {currentStep >= 3 && <div className="transition-opacity duration-500"><Card><CardHeader><CardTitle icon="🎙️">Step 3: Voice Over & Video</CardTitle></CardHeader><CardContent><div className="grid lg:grid-cols-2 gap-8"><div className="space-y-6"><Label htmlFor="voice-style">Pilih Gaya Suara</Label><Select id="voice-style" value={voiceStyle} onChange={(e) => setVoiceStyle(e.target.value)}><option>Wanita Natural 🇮🇩</option><option>Pria Enerjik 🇮🇩</option><option>Soft Voice 🇮🇩</option></Select><Button onClick={handleGenerateScripts} disabled={isGeneratingScripts || !sourceText}>{isGeneratingScripts ? <><LoaderCircleIcon className="animate-spin h-5 w-5" /> Generating...</> : 'Generate Voice Over'}</Button></div><div><h3 className="font-semibold text-lg mb-4 text-gray-200">Hasil Audio & Script</h3>{isGeneratingScripts ? <div className="h-32 bg-gray-700 rounded-lg animate-pulse" /> : generatedScripts && <div className="space-y-4">{generatedScripts.audioBase64 && <audio controls src={`data:audio/mp3;base64,${generatedScripts.audioBase64}`} className="w-full"></audio>}<div className="text-sm"><p className="font-semibold text-gray-200">Video Prompt:</p><p className="font-mono text-xs text-gray-400 bg-black/30 p-2 rounded mt-1">{generatedScripts.videoPrompt}</p></div></div>}</div></div></CardContent></Card></div>}
                    
                    {/* FINAL OUTPUT */}
                    {currentStep >= 4 && <div ref={finalOutputRef} className="transition-opacity duration-500"><Card><CardHeader><CardTitle icon={<PackageCheckIcon className="h-8 w-8 text-green-400" />}>Output Akhir</CardTitle></CardHeader><CardContent><p className="text-center text-gray-300 mb-6">Semua aset Anda telah berhasil dibuat. Unduh semuanya dalam satu paket.</p><Button onClick={handleDownloadZip} disabled={isDownloading} className="bg-green-600 hover:bg-green-500 disabled:opacity-50">{isDownloading ? <><LoaderCircleIcon className="animate-spin h-5 w-5" /> Mengunduh...</> : <><DownloadIcon className="h-5 w-5" /> Download Semua Hasil (.zip)</>}</Button></CardContent></Card></div>}
                </main>
            </div>
        </div>
    );
}

