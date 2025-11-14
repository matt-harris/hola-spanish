'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Volume2, Play, CheckCircle, Home, Lightbulb, ThumbsUp, ThumbsDown, Repeat2
} from 'lucide-react'; 

// --- INITIAL IN-MEMORY DATA (87 Phrases across 6 Categories) ---
const INITIAL_PHRASES = [
  // 1. Greetings & Essential Politeness
  { english: "Hello", spanish: "Hola", phonetic: "OH-lah", category: "Greetings & Politeness" },
  { english: "Good morning", spanish: "Buenos días", phonetic: "BWAY-nohs DEE-ahs", category: "Greetings & Politeness" },
  { english: "Good afternoon", spanish: "Buenas tardes", phonetic: "BWAY-nahs TAR-des", category: "Greetings & Politeness" },
  { english: "Good evening / Good night", spanish: "Buenas noches", phonetic: "BWAY-nahs NO-chess", category: "Greetings & Politeness" },
  { english: "Please", spanish: "Por favor", phonetic: "por fa-VOR", category: "Greetings & Politeness" },
  { english: "Thank you", spanish: "Gracias", phonetic: "GRA-thee-ahs / GRA-see-ahs", category: "Greetings & Politeness" },
  { english: "Thank you very much", spanish: "Muchas gracias", phonetic: "MOO-chas GRA-thee-ahs", category: "Greetings & Politeness" },
  { english: "You're welcome", spanish: "De nada", phonetic: "day NAH-da", category: "Greetings & Politeness" },
  { english: "Goodbye", spanish: "Adiós", phonetic: "ah-dee-OHS", category: "Greetings & Politeness" },
  { english: "See you later", spanish: "Hasta luego", phonetic: "AH-sta loo-EH-go", category: "Greetings & Politeness" },
  { english: "Yes", spanish: "Sí", phonetic: "see", category: "Greetings & Politeness" },
  { english: "No", spanish: "No", phonetic: "no", category: "Greetings & Politeness" },
  { english: "Excuse me / Sorry (for bumping into someone)", spanish: "Perdón", phonetic: "per-DON", category: "Greetings & Politeness" },
  { english: "Excuse me (to get someone's attention)", spanish: "Disculpe", phonetic: "dis-KUL-pay", category: "Greetings & Politeness" },
  
  // 2. Basic Conversation & Introductions
  { english: "What is your name? (informal)", spanish: "¿Cómo te llamas?", phonetic: "KOH-moh tay YA-mas", category: "Conversation & Introductions" },
  { english: "My name is...", spanish: "Me llamo...", phonetic: "may YA-moh...", category: "Conversation & Introductions" },
  { english: "How are you? (formal)", spanish: "¿Cómo está usted?", phonetic: "KOH-moh es-TAH oos-TED", category: "Conversation & Introductions" },
  { english: "How's it going? / What's up? (casual)", spanish: "¿Qué tal?", phonetic: "kay tal", category: "Conversation & Introductions" },
  { english: "I'm fine, thank you", spanish: "Estoy bien, gracias", phonetic: "es-TOY bee-en, GRA-thee-ahs", category: "Conversation & Introductions" },
  { english: "Nice to meet you", spanish: "Mucho gusto / Encantado(a)", phonetic: "MOO-cho GOOS-toh / en-kan-TAH-do/a", category: "Conversation & Introductions" },
  { english: "Do you speak English?", spanish: "¿Hablas inglés?", phonetic: "AH-blahs een-GLAYS", category: "Conversation & Introductions" },
  { english: "I speak a little Spanish", spanish: "Hablo un poco de español", phonetic: "AH-blo oon POH-koh day es-pan-YOL", category: "Conversation & Introductions" },
  { english: "I don't understand", spanish: "No entiendo", phonetic: "no en-tee-EN-doh", category: "Conversation & Introductions" },
  { english: "I don't know", spanish: "No sé", phonetic: "no say", category: "Conversation & Introductions" },
  { english: "Can you speak more slowly, please?", spanish: "¿Puedes hablar más despacio, por favor?", phonetic: "PWAY-des ah-BLAR mas des-PA-thee-oh, por fa-VOR", category: "Conversation & Introductions" },
  { english: "Where are you from?", spanish: "¿De dónde eres?", phonetic: "day DON-day EH-res", category: "Conversation & Introductions" },
  { english: "I am from...", spanish: "Soy de...", phonetic: "soy day...", category: "Conversation & Introductions" },

  // 3. At the Restaurant & Bar
  { english: "A table for four, please", spanish: "Una mesa para cuatro, por favor", phonetic: "OO-nah MAY-sa PA-ra KWA-tro, por fa-VOR", category: "Restaurant & Bar" },
  { english: "The menu, please", spanish: "La carta, por favor", phonetic: "la CAR-ta, por fa-VOR", category: "Restaurant & Bar" },
  { english: "The menu of the day (set lunch menu)", spanish: "El menú del día", phonetic: "el may-NOO del DEE-ah", category: "Restaurant & Bar" },
  { english: "I would like... (polite)", spanish: "Quisiera...", phonetic: "kee-see-EH-ra...", category: "Restaurant & Bar" },
  { english: "I want... (more direct)", spanish: "Quiero...", phonetic: "kee-EH-ro...", category: "Restaurant & Bar" },
  { english: "To drink...", spanish: "Para beber...", phonetic: "PA-ra bay-BER...", category: "Restaurant & Bar" },
  { english: "To eat...", spanish: "Para comer...", phonetic: "PA-ra koh-MER...", category: "Restaurant & Bar" },
  { english: "A beer", spanish: "Una cerveza", phonetic: "OO-nah ser-VAY-tha", category: "Restaurant & Bar" },
  { english: "A glass of wine (red / white / rosé)", spanish: "Una copa de vino (tinto / blanco / rosado)", phonetic: "OO-nah KOH-pa day VEE-no (TEEN-toh / BLAN-koh / ro-SAH-doh)", category: "Restaurant & Bar" },
  { english: "Water (sparkling / still)", spanish: "Agua (con gas / sin gas)", phonetic: "AH-gwa (kon gas / seen gas)", category: "Restaurant & Bar" },
  { english: "A coffee with milk", spanish: "Un café con leche", phonetic: "oon ka-FAY kon LEH-chay", category: "Restaurant & Bar" },
  { english: "Cheers!", spanish: "¡Salud!", phonetic: "sa-LOOD", category: "Restaurant & Bar" },
  { english: "It was delicious", spanish: "Estaba delicioso", phonetic: "es-TA-ba day-lee-thee-OH-so", category: "Restaurant & Bar" },
  { english: "I have an allergy to...", spanish: "Tengo alergia a...", phonetic: "TEN-go ah-LER-hee-ah ah...", category: "Restaurant & Bar" },
  { english: "The bill, please", spanish: "La cuenta, por favor", phonetic: "la KWEN-ta, por fa-VOR", category: "Restaurant & Bar" },
  { english: "Can I pay by card?", spanish: "¿Puedo pagar con tarjeta?", phonetic: "PWAY-doh pa-GAR kon tar-HAY-ta", category: "Restaurant & Bar" },

  // 4. Numbers, Days, & Time
  { english: "One, two, three", spanish: "Uno, dos, tres", phonetic: "OO-noh, dohs, trays", category: "Numbers, Days, & Time" },
  { english: "Four, five, six", spanish: "Cuatro, cinco, seis", phonetic: "KWA-tro, THEEN-koh, says", category: "Numbers, Days, & Time" },
  { english: "Seven, eight, nine, ten", spanish: "Siete, ocho, nueve, diez", phonetic: "see-EH-tay, OH-cho, NWAY-vay, dee-ETH", category: "Numbers, Days, & Time" },
  { english: "One hundred", spanish: "Cien", phonetic: "thee-EN", category: "Numbers, Days, & Time" },
  { english: "What time is it?", spanish: "¿Qué hora es?", phonetic: "kay O-ra es?", category: "Numbers, Days, & Time" },
  { english: "It's one o'clock", spanish: "Es la una", phonetic: "es la OO-na", category: "Numbers, Days, & Time" },
  { english: "It's two / three o'clock...", spanish: "Son las dos / tres...", phonetic: "son las dohs / trays", category: "Numbers, Days, & Time" },
  { english: "Today", spanish: "Hoy", phonetic: "oy", category: "Numbers, Days, & Time" },
  { english: "Tomorrow", spanish: "Mañana", phonetic: "man-YA-na", category: "Numbers, Days, & Time" },
  { english: "Yesterday", spanish: "Ayer", phonetic: "ah-YER", category: "Numbers, Days, & Time" },
  { english: "Monday", spanish: "Lunes", phonetic: "LOO-nes", category: "Numbers, Days, & Time" },
  { english: "Tuesday", spanish: "Martes", phonetic: "MAR-tes", category: "Numbers, Days, & Time" },
  { english: "Wednesday", spanish: "Miércoles", phonetic: "mee-EHR-koh-les", category: "Numbers, Days, & Time" },
  { english: "Thursday", spanish: "Jueves", phonetic: "HWEH-ves", category: "Numbers, Days, & Time" },
  { english: "Friday", spanish: "Viernes", phonetic: "vee-EHR-nes", category: "Numbers, Days, & Time" },
  { english: "Saturday", spanish: "Sábado", phonetic: "SA-ba-doh", category: "Numbers, Days, & Time" },
  { english: "Sunday", spanish: "Domingo", phonetic: "doh-MEEN-go", category: "Numbers, Days, & Time" },

  // 5. Months and Seasons
  { english: "January", spanish: "Enero", phonetic: "eh-NEH-roh", category: "Months and Seasons" },
  { english: "February", spanish: "Febrero", phonetic: "feh-BREH-roh", category: "Months and Seasons" },
  { english: "March", spanish: "Marzo", phonetic: "MAHR-soh", category: "Months and Seasons" },
  { english: "April", spanish: "Abril", phonetic: "ah-BREEL", category: "Months and Seasons" },
  { english: "May", spanish: "Mayo", phonetic: "MAH-yoh", category: "Months and Seasons" },
  { english: "June", spanish: "Junio", phonetic: "HOO-nee-oh", category: "Months and Seasons" },
  { english: "July", spanish: "Julio", phonetic: "HOO-lee-oh", category: "Months and Seasons" },
  { english: "August", spanish: "Agosto", phonetic: "ah-GOHS-toh", category: "Months and Seasons" },
  { english: "September", spanish: "Septiembre", phonetic: "sep-tee-EHM-breh", category: "Months and Seasons" },
  { english: "October", spanish: "Octubre", phonetic: "ok-TOO-breh", category: "Months and Seasons" },
  { english: "November", spanish: "Noviembre", phonetic: "noh-vee-EHM-breh", category: "Months and Seasons" },
  { english: "December", spanish: "Diciembre", phonetic: "dee-thee-EHM-breh", category: "Months and Seasons" },
  { english: "Spring", spanish: "Primavera", phonetic: "pree-mah-VEH-rah", category: "Months and Seasons" },
  { english: "Summer", spanish: "Verano", phonetic: "veh-RAH-noh", category: "Months and Seasons" },
  { english: "Autumn / Fall", spanish: "Otoño", phonetic: "oh-TOH-nyoh", category: "Months and Seasons" },
  { english: "Winter", spanish: "Invierno", phonetic: "een-vee-EHR-noh", category: "Months and Seasons" },
  
  // 6. Colours (New Category)
  { english: "Red", spanish: "Rojo", phonetic: "ROH-hoh", category: "Colours" },
  { english: "Blue", spanish: "Azul", phonetic: "ah-SOOL", category: "Colours" },
  { english: "Green", spanish: "Verde", phonetic: "VAYR-deh", category: "Colours" },
  { english: "Yellow", spanish: "Amarillo", phonetic: "ah-mah-REE-yoh", category: "Colours" },
  { english: "Black", spanish: "Negro", phonetic: "NEH-groh", category: "Colours" },
  { english: "White", spanish: "Blanco", phonetic: "BLAHN-koh", category: "Colours" },
  { english: "Purple", spanish: "Morado", phonetic: "moh-RAH-doh", category: "Colours" },
  { english: "Orange", spanish: "Naranja", phonetic: "nah-RAHN-hah", category: "Colours" },
  { english: "Pink", spanish: "Rosado", phonetic: "roh-SAH-doh", category: "Colours" },
  { english: "Grey", spanish: "Gris", phonetic: "grees", category: "Colours" }, // Updated from Gray to Grey
];

interface Phrase {
  english: string;
  spanish: string;
  phonetic: string;
  category: string;
}

const App = () => {
  const [view, setView] = useState('home'); // 'home' | 'learning' | 'finished'
  const [selectedPhrases, setSelectedPhrases] = useState<Phrase[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0: None, 1: First Letter, 2: Phonetic
  const [knownCount, setKnownCount] = useState(0); // State to track correct answers
  const [ttsSupported, setTtsSupported] = useState(true);
  
  // NEW STATE: Tracks phrases the user flagged for review
  const [reviewList, setReviewList] = useState<Phrase[]>([]);
  
  // New state to hold the specific Google voice object
  const [googleSpanishVoice, setGoogleSpanishVoice] = useState<SpeechSynthesisVoice | null>(null);

  // --- Local Data States ---
  const [allPhrases] = useState<Phrase[]>(INITIAL_PHRASES); 

  // --- Category Management ---
  const ALL_CATEGORIES = useMemo(() => {
      // Extract unique categories from the local phrase data
      return Array.from(new Set(allPhrases.map(p => p.category))).sort();
  }, [allPhrases]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  useEffect(() => {
      // Auto-select all categories initially
      if (ALL_CATEGORIES.length > 0 && selectedCategories.length === 0) {
          setSelectedCategories(ALL_CATEGORIES);
      }
  }, [ALL_CATEGORIES, selectedCategories.length]);


  const toggleCategory = (category: string) => {
      setSelectedCategories(prev => {
          if (prev.includes(category)) {
              // Prevent deselecting the last category
              if (prev.length === 1) return prev; 
              return prev.filter(c => c !== category);
          } else {
              return [...prev, category];
          }
      });
  };
  // --- End Category Management ---

  // --- Dynamic Phrase Calculation (for Home and Finished Views) ---
  const { phrasesInSelection, phrasesToStart } = useMemo(() => {
    // Only count phrases from selected categories
    const filteredPhrases = allPhrases.filter(p => selectedCategories.includes(p.category));
    const countInSelection = filteredPhrases.length;
    // Session size limit is 10
    const countToStart = Math.min(10, countInSelection);
    return { phrasesInSelection: countInSelection, phrasesToStart: countToStart };
  }, [allPhrases, selectedCategories]);

  // --- TTS Voice Initialization (Updated to find Google Spanish voice) ---
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn("TTS INIT: Text-to-Speech is NOT supported in this browser.");
      setTtsSupported(false);
      return;
    }
    
    const findAndLogVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Look for a high-quality Google voice, prioritizing one with 'es-' lang code
      const targetVoice = voices.find(voice => 
          voice.name.includes('Google') && 
          (voice.lang.startsWith('es-') || voice.name.includes('Spanish') || voice.name.includes('español'))
      );

      if (targetVoice) {
          console.log(`TTS INIT: Found preferred Google Spanish voice: ${targetVoice.name} (${targetVoice.lang}).`);
          setGoogleSpanishVoice(targetVoice);
      } else {
          // Fallback to any generic Spanish voice for logging purposes
          const fallbackVoice = voices.find(voice => voice.lang.startsWith('es-'));
          if (fallbackVoice) {
               console.warn(`TTS INIT: Could not find specific Google Spanish voice. Falling back to browser default Spanish voice: ${fallbackVoice.name} (${fallbackVoice.lang}).`);
          } else {
               console.warn("TTS INIT: Could not find any Spanish voice. Using 'es-ES' language code fallback.");
          }
          setGoogleSpanishVoice(null); // Set null if the specific Google voice isn't found
      }
    };

    // Check immediately and then on voiceschanged event
    findAndLogVoice();
    window.speechSynthesis.onvoiceschanged = findAndLogVoice;
    
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []); 

  const selectRandomPhrases = useCallback(() => {
    const filteredPhrases = allPhrases.filter(p => selectedCategories.includes(p.category));

    if (filteredPhrases.length === 0) {
        console.error("Cannot start session: No phrases available based on selected categories.");
        return; 
    }

    // Use the updated session limit of 10
    const countToSelect = Math.min(10, filteredPhrases.length);
    
    // Simple shuffle for randomization
    const shuffledPhrases = filteredPhrases.sort(() => Math.random() - 0.5);
    const uniquePhrases = shuffledPhrases.slice(0, countToSelect);
    
    setSelectedPhrases(uniquePhrases);
    setCurrentStep(0);
    setShowAnswer(false);
    setHintLevel(0);
    setKnownCount(0);
    // Clear review list when starting a fresh session from Home
    setReviewList([]); 
    setView('learning');
  }, [allPhrases, selectedCategories]);

  // NEW FUNCTION: Starts a session using only the missed phrases
  const startReviewSession = useCallback(() => {
    setSelectedPhrases(reviewList);
    setCurrentStep(0);
    setShowAnswer(false);
    setHintLevel(0);
    setKnownCount(0);
    // Clear the review list so subsequent sessions start fresh
    setReviewList([]); 
    setView('learning');
  }, [reviewList]);


  const currentPhrase = selectedPhrases[currentStep];

  const speakPhrase = useCallback((text: string) => {
    if (!ttsSupported) {
        console.error('TTS Speak: Text-to-Speech is not available in your browser.'); 
        return;
    }

    // Stop any current speaking before starting a new one
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 1. Try to use the specifically identified Google Spanish Voice
    if (googleSpanishVoice) {
        utterance.voice = googleSpanishVoice;
        utterance.lang = googleSpanishVoice.lang; // Use the specific lang code of the chosen voice
    } else {
        // 2. Fallback to generic es-ES language code
        utterance.lang = 'es-ES'; 
    }

    window.speechSynthesis.speak(utterance);
  }, [ttsSupported, googleSpanishVoice]); 

  const handleNext = () => {
    if (currentStep < selectedPhrases.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowAnswer(false);
      setHintLevel(0);
    } else {
      setView('finished'); 
    }
  };

  const handleKnowIt = () => {
    setKnownCount(prev => prev + 1);
    handleNext();
  };

  const handleNeedsReview = () => {
    // ADD THE CURRENT PHRASE TO THE REVIEW LIST
    if (currentPhrase) {
        setReviewList(prev => [...prev, currentPhrase]);
    }
    handleNext();
  };

  const handleRestart = () => {
    setView('home');
    setSelectedPhrases([]);
    setCurrentStep(0);
    setShowAnswer(false);
    setHintLevel(0);
    setKnownCount(0);
    setReviewList([]); // Clear review list when going back to home
    setSelectedCategories(ALL_CATEGORIES); 
  };
  
  // --- UI Components ---

  const ActionButton = ({
    children,
    onClick,
    color = 'bg-indigo-600',
    disabled = false,
    icon: Icon = null,
    className = ''
  }: {
    children: React.ReactNode;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
    icon?: React.ComponentType<{ className?: string }> | null;
    className?: string; 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 px-4 text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-1 
        ${color} text-white shadow-lg transform
        ${disabled ? 'opacity-50 cursor-not-allowed shadow-inner' : 'hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98]'}
        md:text-sm md:px-3
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
  
  const HintButton = () => {
    let buttonText;
    if (hintLevel === 0) {
      buttonText = 'Hint (First Letter)';
    } else if (hintLevel === 1) {
      buttonText = 'Hint (Phonetic)';
    } else {
      buttonText = 'Max Hint Reached'; 
    }

    return (
      <button
        onClick={() => setHintLevel(prev => prev + 1)}
        disabled={hintLevel >= 2 || showAnswer}
        className={`
            py-2 px-4 text-sm font-semibold rounded-full flex items-center space-x-2 transition duration-200
            ${hintLevel >= 2 || showAnswer 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:scale-[0.98]'}
        `}
      >
        <Lightbulb className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>
    );
  };
  

  const HomeView = () => {
    const isStartDisabled = selectedCategories.length === 0 || phrasesInSelection === 0;

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl border-t-8 border-indigo-500 w-full">
        <h1 className="text-5xl md:text-7xl font-black text-indigo-700 mb-2 tracking-tight">
          Hola Spanish!
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-500 mb-6 text-center">
          Your essential Spanish phrasebook.
        </p>
        
        {reviewList.length > 0 && (
            <div className="w-full p-4 mb-4 bg-orange-100 border-l-4 border-orange-400 rounded-lg shadow-inner">
                <p className="font-semibold text-orange-800">
                    <Repeat2 className="inline w-4 h-4 mr-2" />
                    You have **{reviewList.length} phrases** pending review!
                </p>
                <p className="text-sm text-orange-700 mt-1">
                    Finish your current review list before starting a new selection.
                </p>
            </div>
        )}

        
        {/* Category Selection */}
        <div className="w-full mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                Select Categories ({phrasesInSelection} phrases available)
            </h3>
            {ALL_CATEGORIES.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {ALL_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`
                                p-3 text-sm font-medium rounded-xl transition-colors duration-200 border-2
                                text-center
                                ${selectedCategories.includes(category)
                                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }
                                ${(selectedCategories.includes(category) && selectedCategories.length === 1) ? 'opacity-80' : ''}
                            `}
                            // Disabled only if this is the last selected category
                            disabled={selectedCategories.includes(category) && selectedCategories.length === 1}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mb-6">
                    No phrases found.
                </div>
            )}
            
            <ActionButton 
                onClick={selectRandomPhrases} 
                icon={Play} 
                color="bg-green-500 hover:bg-green-600"
                disabled={isStartDisabled || reviewList.length > 0} // Disable if review list exists
            >
                Start Session ({phrasesToStart} Phrases)
            </ActionButton>
            {isStartDisabled && phrasesInSelection === 0 && (
                <p className="text-red-500 text-sm mt-2 text-center font-medium">No phrases available in the selected categories.</p>
            )}
            {reviewList.length > 0 && (
                 <ActionButton 
                    onClick={startReviewSession} 
                    icon={Repeat2} 
                    color="bg-orange-500 hover:bg-orange-600"
                    className="mt-4"
                >
                    Start Review Session ({reviewList.length} Phrases)
                </ActionButton>
            )}
        </div>
      </div>
    );
  };

  const LearningView = () => (
    <div className="flex flex-col p-6 md:p-10 bg-white rounded-3xl shadow-2xl w-full border border-gray-100">
      
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest">
          Phrase {currentStep + 1} of {selectedPhrases.length}
        </p>
        <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / selectedPhrases.length) * 100}%` }}
          />
        </div>
      </div>


      {/* English Phrase (Question) */}
      <div className="min-h-[140px] mb-4 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 text-center">
          {currentPhrase.english}
        </h2>
      </div>

      {/* Quiz Prompt / Hint Section */}
      <div className="min-h-[180px] flex flex-col justify-start">
        {!showAnswer ? (
          <div className="p-4 text-center bg-white rounded-xl">
             <p className="text-lg font-medium text-gray-700 mb-4">
                 Think: What is the Spanish translation?
             </p>
             
             {/* Dynamic Hint Display based on hintLevel */}
             <div className="h-10 mb-4 flex items-center justify-center">
                {hintLevel === 1 && (
                    <p className="text-6xl font-bold text-yellow-600">
                        {currentPhrase.spanish.charAt(0)}...
                    </p>
                )}
                {hintLevel === 2 && (
                    <p className="text-xl italic px-4 py-2 bg-yellow-100 rounded-lg border border-yellow-300 text-yellow-800">
                        {currentPhrase.phonetic}
                    </p>
                )}
             </div>
             
             {/* Hint Button */}
             <div className="flex justify-center mt-2">
                 {!showAnswer && currentPhrase.phonetic && hintLevel < 2 && <HintButton />}
             </div>
          </div>
        ) : (
          /* Spanish Answer Section (Reveal Mode) */
          <div className="p-5 md:p-6 bg-indigo-500 text-white rounded-xl shadow-xl transform transition-all duration-300">
            <p className="text-xs font-light opacity-90 mb-1">Spanish Translation</p>
            <p className="text-3xl md:text-4xl font-black mb-3">
              {currentPhrase.spanish}
            </p>
            <div className="flex justify-between items-end text-sm border-t border-indigo-400 pt-3">
                <span className="italic font-light">
                  Phonetic: {currentPhrase.phonetic || 'N/A'}
                </span>
                <span className="font-medium text-xs bg-indigo-700 py-1 px-3 rounded-full">
                  {currentPhrase.category}
                </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-4">
        {!showAnswer ? (
          <ActionButton onClick={() => setShowAnswer(true)} color="bg-indigo-600 hover:bg-indigo-700">
            Reveal Answer
          </ActionButton>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton 
              onClick={() => speakPhrase(currentPhrase.spanish)} 
              color="bg-blue-500 hover:bg-blue-600"
              icon={Volume2}
              disabled={!ttsSupported}
            >
              Speak
            </ActionButton>
            <ActionButton 
                onClick={handleNeedsReview} 
                color="bg-orange-500 hover:bg-orange-600"
                icon={ThumbsDown}
            >
              Needs Review
            </ActionButton>
             <ActionButton 
                onClick={handleKnowIt} 
                color="bg-green-500 hover:bg-green-600"
                icon={ThumbsUp}
            >
              I Knew It!
            </ActionButton>
          </div>
        )}
      </div>
      
      {/* Restart Button */}
      <div className="mt-4">
        <ActionButton onClick={handleRestart} color="bg-gray-400 hover:bg-gray-500" icon={Home}>
            Back to Home
        </ActionButton>
      </div>
    </div>
  );
  
  const FinishedView = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-2xl text-center border-t-8 border-green-500 w-full">
        <CheckCircle className="h-20 w-20 text-green-500 mb-4 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-black text-green-700 mb-2">¡Felicidades!</h1>
        <p className="text-xl text-gray-700 mb-4">
            You finished the session and knew <span className="font-bold text-gray-900">{knownCount}</span> out of <span className="font-bold text-gray-900">{selectedPhrases.length}</span> phrases!
        </p>
        
        {reviewList.length > 0 ? (
            <div className="w-full mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                <p className="text-lg font-semibold text-orange-800">
                    You flagged **{reviewList.length} phrases** for review.
                </p>
                <ActionButton 
                    onClick={startReviewSession} 
                    color="bg-orange-600 hover:bg-orange-700" 
                    icon={Repeat2}
                    className="mt-3"
                >
                    Start Review Session ({reviewList.length} Phrases)
                </ActionButton>
            </div>
        ) : (
            <p className="text-lg text-gray-600 mb-6">
                Excellent! You knew every phrase in this set.
            </p>
        )}

        <ActionButton onClick={handleRestart} color="bg-indigo-600 hover:bg-indigo-700" icon={Home}>
          Return to Home
        </ActionButton>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 md:p-8">
      {/* Container Card */}
      <div className="w-full max-w-2xl">
        {(() => {
          switch (view) {
            case 'learning':
              return <LearningView />;
            case 'finished':
              return <FinishedView />;
            default:
              return <HomeView />;
          }
        })()}
      </div>
    </div>
  );
};

export default App;
