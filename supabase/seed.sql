-- Supabase Schema & Seed Script for TirthDarshan

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- 1. Create Tirthankars Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tirthankars (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_gujarati TEXT NOT NULL,
    symbol TEXT NOT NULL,
    symbol_emoji TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    height TEXT NOT NULL,
    lifespan TEXT NOT NULL,
    yaksha TEXT NOT NULL,
    yakshini TEXT NOT NULL,
    birth_place TEXT NOT NULL,
    nirvana_place TEXT NOT NULL,
    diksha_place TEXT NOT NULL,
    kevalgyan_place TEXT NOT NULL,
    teachings TEXT[] NOT NULL DEFAULT '{}',
    significance TEXT NOT NULL,
    famous_tirths TEXT[] NOT NULL DEFAULT '{}',
    panch_kalyanak JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tirthankars ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for everyone
CREATE POLICY "Allow public read access to tirthankars" 
    ON public.tirthankars 
    FOR SELECT 
    USING (true);

-- -------------------------------------------------------------
-- 2. Create Tirths Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tirths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tirthankar_id INTEGER REFERENCES public.tirthankars(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    nearest_city TEXT NOT NULL,
    state TEXT NOT NULL,
    history TEXT NOT NULL,
    mahima TEXT NOT NULL,
    how_to_reach JSONB NOT NULL DEFAULT '{}',
    best_time_to_visit TEXT NOT NULL,
    has_vr_darshan BOOLEAN NOT NULL DEFAULT false,
    vr_darshan_url TEXT,
    gallery TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tirths ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for everyone
CREATE POLICY "Allow public read access to tirths" 
    ON public.tirths 
    FOR SELECT 
    USING (true);

-- -------------------------------------------------------------
-- 3. Seed Tirthankars Data (24 Tirthankars)
-- -------------------------------------------------------------
TRUNCATE public.tirthankars RESTART IDENTITY CASCADE;

INSERT INTO public.tirthankars (
    id, name, name_gujarati, symbol, symbol_emoji, color, color_hex, height, lifespan, yaksha, yakshini, birth_place, nirvana_place, diksha_place, kevalgyan_place, teachings, significance, famous_tirths, panch_kalyanak
) VALUES 
(
    1, 
    'Aadinath Bhagwan', 
    'ઋષભદેવ ભગવાન', 
    'Bull (Nandi / Saamp)', 
    '🐂', 
    'Golden Yellow', 
    '#C8960C', 
    '500 Dhanusha', 
    '84 Lakh Purvas', 
    'Gomukh', 
    'Chakreshvari Devi', 
    'Ayodhya, Uttar Pradesh', 
    'Ashtapad (Himalayan peak)', 
    'Siddharthapur / Prayagraj', 
    'Prayagraj (Allahabad)', 
    ARRAY[
        'First teacher of Dharma in this cosmic cycle (Avasarpini)',
        'Introduced all 72 arts, crafts, agriculture, and writing to humanity',
        'Founded social structure and civilization in Jain tradition',
        'Father of Bharata Chakravarti; established four-fold Jain Sangh'
    ], 
    'Adinath — the very first Tirthankar of this cosmic era. Known as Rishabhadev, he is regarded as the father of civilization. His life spans an almost incomprehensible 84 lakh Purvas and he is associated with more major Tirth than any other Tirthankar.', 
    ARRAY['Shatrunjaya (Palitana)', 'Kesariyaji', 'Girnar', 'Ashtapad', 'Bhadreshwar'], 
    '{"garbha": "Ayodhya", "janma": "Ayodhya", "diksha": "Siddharthapur / Prayagraj", "kevalgyan": "Prayagraj (Allahabad)", "nirvana": "Ashtapad (Himalayan peak)"}'::jsonb
),
(
    2, 
    'Ajitnath Bhagwan', 
    'અજિતનાથ ભગવાન', 
    'Elephant', 
    '🐘', 
    'Golden Yellow', 
    '#C8960C', 
    '450 Dhanusha', 
    '72 Lakh Purvas', 
    'Mahayaksha', 
    'Rohini Devi', 
    'Ayodhya, Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Ayodhya', 
    'Ayodhya', 
    ARRAY[
        'Ahimsa (non-violence) as the supreme principle',
        'Non-attachment to all worldly relations and possessions',
        'Right conduct, right knowledge, and right faith as the three jewels'
    ], 
    'Ajitnath Bhagwan is the second Tirthankar, revered for emphasizing the three jewels of Jainism. He attained nirvana at the sacred Shatrunjaya hill, adding to its immense spiritual significance.', 
    ARRAY['Shatrunjaya (Palitana)', 'Ayodhya', 'Varanasi'], 
    '{"garbha": "Ayodhya", "janma": "Ayodhya", "diksha": "Ayodhya", "kevalgyan": "Ayodhya", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    3, 
    'Sambhavnath Bhagwan', 
    'સંભવનાથ ભગવાન', 
    'Horse', 
    '🐴', 
    'Golden Yellow', 
    '#C8960C', 
    '400 Dhanusha', 
    '60 Lakh Purvas', 
    'Trimukha', 
    'Prajnapti Devi', 
    'Shravasti, Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Shravasti', 
    'Shravasti', 
    ARRAY[
        'Renunciation of all worldly pleasures and sensory experiences',
        'Path of discipline and strict detachment leads to spiritual freedom',
        'Every moment of restraint brings the soul closer to liberation'
    ], 
    'The third Tirthankar, Sambhavnath, born in Shravasti, taught the power of renunciation. His symbol, the horse, represents swiftness in spiritual progress.', 
    ARRAY['Shatrunjaya (Palitana)', 'Shravasti Tirth', 'Antriksha Parshwanath'], 
    '{"garbha": "Shravasti", "janma": "Shravasti", "diksha": "Shravasti", "kevalgyan": "Shravasti", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    4, 
    'Abhinandannath Bhagwan', 
    'અભિનંદનનાથ ભગવાન', 
    'Monkey (Vanar)', 
    '🐒', 
    'Golden Yellow', 
    '#C8960C', 
    '350 Dhanusha', 
    '50 Lakh Purvas', 
    'Yaksheshvar', 
    'Vajrashrinkhala Devi', 
    'Ayodhya, Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Ayodhya', 
    'Ayodhya', 
    ARRAY[
        'Control of all five senses is the foundation of spiritual life',
        'Desires are the root cause of karmic bondage',
        'Self-discipline (Samyam) is the highest form of tapas'
    ], 
    'Abhinandannath, the fourth Tirthankar, taught the mastery of senses. His life exemplifies that through inner control, the soul can transcend all karmic chains.', 
    ARRAY['Shatrunjaya (Palitana)', 'Ayodhya Tirth', 'Rajgir'], 
    '{"garbha": "Ayodhya", "janma": "Ayodhya", "diksha": "Ayodhya", "kevalgyan": "Ayodhya", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    5, 
    'Sumatinath Bhagwan', 
    'સુમતિનાથ ભગવાન', 
    'Curlew (Kraunch Bird)', 
    '🐦', 
    'Golden Yellow', 
    '#C8960C', 
    '300 Dhanusha', 
    '40 Lakh Purvas', 
    'Tumbaru', 
    'Purushdutt Devi', 
    'Ayodhya, Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Ayodhya', 
    'Ayodhya', 
    ARRAY[
        'Good intellect and right reasoning (Sumati) are divine gifts',
        'Cultivating wisdom through systematic inquiry leads to liberation',
        'Discrimination between the real and unreal is the beginning of Moksha'
    ], 
    'Sumatinath, the fifth Tirthankar, whose very name means ''good intellect'', emphasized the role of right reasoning and wisdom in the spiritual path.', 
    ARRAY['Shatrunjaya (Palitana)', 'Hastinapur (Uttar Pradesh)'], 
    '{"garbha": "Ayodhya", "janma": "Ayodhya", "diksha": "Ayodhya", "kevalgyan": "Ayodhya", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    6, 
    'Padmaprabhu Bhagwan', 
    'પદ્મપ્રભ ભગવાન', 
    'Red Lotus', 
    '🪷', 
    'Red / Pink', 
    '#C0392B', 
    '250 Dhanusha', 
    '30 Lakh Purvas', 
    'Kusuma', 
    'Shyama Devi', 
    'Kaushambi, Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Kaushambi', 
    'Kaushambi', 
    ARRAY[
        'Purity of heart and mind is the lotus of the soul',
        'Live in the world like a lotus — untouched by mud (attachment)',
        'Inner purity (Nirmalta) is the real form of beauty'
    ], 
    'Padmaprabhu Bhagwan is uniquely identified by the Red Lotus and Red/Pink color — rare among Tirthankars who are predominantly golden. His teachings center on lotus-like spiritual existence.', 
    ARRAY['Kaushambi Tirth', 'Shatrunjaya (Palitana)', 'Shauripur'], 
    '{"garbha": "Kaushambi", "janma": "Kaushambi", "diksha": "Kaushambi", "kevalgyan": "Kaushambi", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    7, 
    'Suparshvanath Bhagwan', 
    'સુપાર્શ્વનાથ ભગવાન', 
    'Swastika', 
    '卐', 
    'Golden / Green', 
    '#27AE60', 
    '200 Dhanusha', 
    '20 Lakh Purvas', 
    'Matanga', 
    'Shanta Devi', 
    'Varanasi (Kashi), Uttar Pradesh', 
    'Shatrunjaya (Palitana)', 
    'Varanasi', 
    'Varanasi', 
    ARRAY[
        'The Swastika symbolizes the four states of existence and wellbeing',
        'Purity in thought, word, and action is the triple path',
        'Inner good fortune (Su-Parshva) comes through dharmic living'
    ], 
    'Suparshvanath, the seventh Tirthankar, born in the ancient city of Varanasi, is associated with the sacred Swastika symbol representing auspiciousness and the four states of living beings.', 
    ARRAY['Varanasi (Kashi)', 'Shatrunjaya (Palitana)'], 
    '{"garbha": "Varanasi", "janma": "Varanasi", "diksha": "Varanasi", "kevalgyan": "Varanasi", "nirvana": "Shatrunjaya (Palitana)"}'::jsonb
),
(
    8, 
    'Chandraprabhu Bhagwan', 
    'ચંદ્રપ્રભ ભગવાન', 
    'Moon (Crescent)', 
    '🌙', 
    'White', 
    '#ECF0F1', 
    '150 Dhanusha', 
    '10 Lakh Purvas', 
    'Vijay', 
    'Bhrigu Devi', 
    'Chandrapuri (near Varanasi), Uttar Pradesh', 
    'Chandragiri (Shravanabelagola, Karnataka)', 
    'Chandrapuri', 
    'Chandrapuri', 
    ARRAY[
        'Equanimity and coolness of mind in all circumstances',
        'The moon illuminates without burning — spread dharma without harm',
        'Tranquility (Prasannata) is the natural state of the liberated soul'
    ], 
    'Chandraprabhu Bhagwan, the eighth Tirthankar, is associated with the moon — white, cool, and serene. His nirvana at Chandragiri near Shravanabelagola makes that site doubly sacred.', 
    ARRAY['Shravanabelagola (Karnataka)', 'Chandrapuri', 'Shatrunjaya (Palitana)'], 
    '{"garbha": "Chandrapuri", "janma": "Chandrapuri", "diksha": "Chandrapuri", "kevalgyan": "Chandrapuri", "nirvana": "Chandragiri, Shravanabelagola"}'::jsonb
),
(
    9, 
    'Suvidhinath Bhagwan', 
    'સુવિધિનાથ ભગવાન', 
    'Makara (Crocodile)', 
    '🐊', 
    'White', 
    '#ECF0F1', 
    '100 Dhanusha', 
    '2 Lakh Purvas', 
    'Ajit', 
    'Sutara Devi', 
    'Kakandi, Uttar Pradesh', 
    'Kakandi / Champapuri', 
    'Kakandi', 
    'Kakandi', 
    ARRAY[
        'Proper and disciplined spiritual practice (Suvidhi = right method)',
        'The nine tattvas (fundamental truths) of Jain philosophy',
        'Systematic practice of the right path yields sure liberation'
    ], 
    'Also known as Pushpadanta, the ninth Tirthankar Suvidhinath taught the importance of following the correct method in spiritual practice. His symbol, the Makara, represents power restrained by wisdom.', 
    ARRAY['Kakandi Tirth', 'Champapuri Tirth'], 
    '{"garbha": "Kakandi", "janma": "Kakandi", "diksha": "Kakandi", "kevalgyan": "Kakandi", "nirvana": "Kakandi / Champapuri"}'::jsonb
),
(
    10, 
    'Sheetalnath Bhagwan', 
    'શીતળનાથ ભગવાન', 
    'Shrivatsa', 
    '✴️', 
    'Golden Yellow', 
    '#C8960C', 
    '90 Dhanusha', 
    '1 Lakh Purvas', 
    'Brahma', 
    'Manavi Devi', 
    'Bhadrikpuri, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath, Jharkhand)', 
    'Bhadrikpuri', 
    'Bhadrikpuri', 
    ARRAY[
        'Coolness of disposition overcomes the heat of anger and passion',
        'Sheetal (cool) mind is the mind free of kashaya (passions)',
        'Inner coolness is the mark of one progressing toward liberation'
    ], 
    'Sheetalnath, the tenth Tirthankar, embodies spiritual coolness — the absence of the burning fires of passion, anger, greed, and ego. He attained nirvana at the great Sammeta Shikhar.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Varanasi', 'Bhadrikpuri'], 
    '{"garbha": "Bhadrikpuri", "janma": "Bhadrikpuri", "diksha": "Bhadrikpuri", "kevalgyan": "Bhadrikpuri", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    11, 
    'Shreyansnath Bhagwan', 
    'શ્રેયાંસનાથ ભગવાન', 
    'Rhinoceros', 
    '🦏', 
    'Golden Yellow', 
    '#C8960C', 
    '80 Dhanusha', 
    '84 Lakh Purvas (shorter cycle)', 
    'Ishvar', 
    'Gauri Devi', 
    'Simhapuri (Sarnath area), Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Simhapuri', 
    'Simhapuri', 
    ARRAY[
        'Shreyans — the auspicious path of welfare for all living beings',
        'True welfare (Shreyas) means helping all souls toward liberation',
        'The noble path of ahimsa is the highest auspiciousness'
    ], 
    'Shreyansnath Bhagwan, the eleventh Tirthankar, taught the concept of Shreyas — the highest good and welfare of all beings. His rhinoceros symbol represents power and invincibility.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Simhapuri'], 
    '{"garbha": "Simhapuri", "janma": "Simhapuri", "diksha": "Simhapuri", "kevalgyan": "Simhapuri", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    12, 
    'Vasupujya Bhagwan', 
    'વાસુપૂજ્ય ભગવાન', 
    'Water Buffalo (Mahish)', 
    '🐃', 
    'Red', 
    '#C0392B', 
    '70 Dhanusha', 
    '72 Lakh Purvas (shorter cycle)', 
    'Kumar', 
    'Chandra Devi', 
    'Champapuri (Bhagalpur), Bihar', 
    'Champapuri, Bihar', 
    'Champapuri', 
    'Champapuri', 
    ARRAY[
        'Worship of the truly worthy (Vasu = wealth of merit; Pujya = worthy of worship)',
        'Devotion combined with inner purity leads to liberation',
        'Surrender to the worthy soul eliminates karmic bondage'
    ], 
    'Vasupujya Bhagwan, the twelfth Tirthankar, uniquely both born and attained nirvana in Champapuri (Bhagalpur, Bihar), making it his complete sacred site. One of two red-colored Tirthankars.', 
    ARRAY['Champapuri (Bhagalpur, Bihar)', 'Shatrunjaya (Palitana)'], 
    '{"garbha": "Champapuri", "janma": "Champapuri", "diksha": "Champapuri", "kevalgyan": "Champapuri", "nirvana": "Champapuri"}'::jsonb
),
(
    13, 
    'Vimalnath Bhagwan', 
    'વિમળનાથ ભગવાન', 
    'Boar (Varaha)', 
    '🐗', 
    'Golden Yellow', 
    '#C8960C', 
    '60 Dhanusha', 
    '60 Lakh Purvas (shorter cycle)', 
    'Shanmukha', 
    'Vidita Devi', 
    'Kampilya, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Kampilya', 
    'Kampilya', 
    ARRAY[
        'Purity of the soul (Vimal = completely pure) is our true nature',
        'Removal of karmic impurities through right conduct and tapas',
        'The pure soul has infinite knowledge, bliss, and power'
    ], 
    'Vimalnath Bhagwan, the thirteenth Tirthankar, embodies the concept of Vimalta — absolute purity. His teachings center on uncovering the naturally pure soul beneath layers of karma.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Kampilya', 'Hastinapur'], 
    '{"garbha": "Kampilya", "janma": "Kampilya", "diksha": "Kampilya", "kevalgyan": "Kampilya", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    14, 
    'Anantnath Bhagwan', 
    'અનંતનાથ ભગવાન', 
    'Porcupine / Falcon (Hawk)', 
    '🦅', 
    'Golden Yellow', 
    '#C8960C', 
    '50 Dhanusha', 
    '30 Lakh Purvas (shorter cycle)', 
    'Patala', 
    'Ankusha Devi', 
    'Ayodhya, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Ayodhya', 
    'Ayodhya', 
    ARRAY[
        'Infinite (Anant) consciousness is the true nature of every soul',
        'Liberation is infinite bliss — Anant Sukh is our birthright',
        'Four infinities of the liberated: Anant Gyan, Darshan, Virya, Sukh'
    ], 
    'Anantnath Bhagwan, the fourteenth Tirthankar, teaches about the infinite nature of the soul. ''Anant'' means infinite — his entire teaching is the revelation of the soul''s infinite potential.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Ayodhya'], 
    '{"garbha": "Ayodhya", "janma": "Ayodhya", "diksha": "Ayodhya", "kevalgyan": "Ayodhya", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    15, 
    'Dharmanath Bhagwan', 
    'ધર્મનાથ ભગવાન', 
    'Vajra (Thunderbolt / Diamond)', 
    '💎', 
    'Golden Yellow', 
    '#C8960C', 
    '45 Dhanusha', 
    '10 Lakh Purvas (shorter cycle)', 
    'Kinnara', 
    'Kandarpa Devi', 
    'Ratnapuri, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Ratnapuri', 
    'Ratnapuri', 
    ARRAY[
        'Dharma is the highest virtue — the soul''s true nature is dharma',
        'Ten characteristics of Dharma: Kshama, Mardav, Arjav, Satya, Shoch, Sanyam, Tapa, Tyag, Akinchanya, Brahmacharya',
        'Vajra-like resolve in pursuing the dharmic path leads to liberation'
    ], 
    'Dharmanath Bhagwan, the fifteenth Tirthankar, is associated with Dharma itself — the cosmic order and righteous living. His Vajra symbol represents the indestructible nature of right conduct.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Ratnapuri', 'Varanasi'], 
    '{"garbha": "Ratnapuri", "janma": "Ratnapuri", "diksha": "Ratnapuri", "kevalgyan": "Ratnapuri", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    16, 
    'Shantinath Bhagwan', 
    'શાંતિનાથ ભગવાન', 
    'Deer (Mriganka)', 
    '🦌', 
    'Golden Yellow', 
    '#C8960C', 
    '40 Dhanusha', 
    '1 Lakh Purva (shorter cycle)', 
    'Garuda', 
    'Nirvani Devi', 
    'Hastinapur, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Hastinapur', 
    'Hastinapur', 
    ARRAY[
        'Peace and equanimity (Shanti) are the mark of a true spiritual being',
        'The still mind that has overcome passions naturally achieves liberation',
        'Inner peace is the foundation of peace in the world'
    ], 
    'Shantinath Bhagwan, the sixteenth Tirthankar, is one of the most beloved — his very name means Peace. His teachings on Shanti resonate universally and he is worshipped for bringing peace to troubled minds.', 
    ARRAY['Hastinapur (Uttar Pradesh)', 'Sammeta Shikhar (Parasnath)', 'Shatrunjaya (Palitana)'], 
    '{"garbha": "Hastinapur", "janma": "Hastinapur", "diksha": "Hastinapur", "kevalgyan": "Hastinapur", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    17, 
    'Kunthunath Bhagwan', 
    'કુંથુનાથ ભગવાન', 
    'Goat', 
    '🐐', 
    'Golden Yellow', 
    '#C8960C', 
    '35 Dhanusha', 
    '95,000 Purvas', 
    'Gandharva', 
    'Bala Devi', 
    'Hastinapur, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Hastinapur', 
    'Hastinapur', 
    ARRAY[
        'Non-possessiveness (Aparigraha) — freedom from attachment to things and people',
        'Accumulation of material possessions creates karmic chains',
        'Simple living with minimum possessions accelerates liberation'
    ], 
    'Kunthunath Bhagwan, the seventeenth Tirthankar, taught Aparigraha — the principle of non-possessiveness that is central to Jain ethics and increasingly relevant in the modern world.', 
    ARRAY['Hastinapur (Uttar Pradesh)', 'Sammeta Shikhar (Parasnath)'], 
    '{"garbha": "Hastinapur", "janma": "Hastinapur", "diksha": "Hastinapur", "kevalgyan": "Hastinapur", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    18, 
    'Arnath Bhagwan', 
    'અરનાથ ભગવાન', 
    'Fish (Matsya)', 
    '🐟', 
    'Golden Yellow', 
    '#C8960C', 
    '30 Dhanusha', 
    '84,000 Purvas', 
    'Yaksha', 
    'Dharini Devi', 
    'Hastinapur, Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath)', 
    'Hastinapur', 
    'Hastinapur', 
    ARRAY[
        'The wheel of dharma (Ara = spoke of the wheel) keeps turning',
        'Every soul is fully capable of liberation through sincere right effort',
        'The spokes of right faith, knowledge, and conduct support the wheel'
    ], 
    'Arnath Bhagwan, the eighteenth Tirthankar, is associated with the spoke of the dharma wheel. His fish symbol represents a soul moving freely through the waters of samsara toward liberation.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Hastinapur'], 
    '{"garbha": "Hastinapur", "janma": "Hastinapur", "diksha": "Hastinapur", "kevalgyan": "Hastinapur", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    19, 
    'Mallinath Bhagwan', 
    'મલ્લિનાથ ભગવાન', 
    'Water Pot (Kalash)', 
    '🏺', 
    'Blue', 
    '#2980B9', 
    '25 Dhanusha', 
    '55,000 Purvas', 
    'Kubera', 
    'Dharini (Aparajita) Devi', 
    'Mithila, Bihar', 
    'Sammeta Shikhar (Parasnath)', 
    'Mithila', 
    'Mithila', 
    ARRAY[
        'The only female Tirthankar in the Shwetambar tradition',
        'Equal spiritual potential of women — liberation is not gender-bound',
        'Non-violence and deep compassion are the highest spiritual qualities'
    ], 
    'Mallinath Bhagwan is unique and historically significant — recognized by the Shwetambar tradition as the only female Tirthankar among the 24. This represents Jainism''s early acknowledgment of women''s equal spiritual capacity.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Mithila Tirth'], 
    '{"garbha": "Mithila", "janma": "Mithila", "diksha": "Mithila", "kevalgyan": "Mithila", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    20, 
    'Munisuvrat Bhagwan', 
    'મુનિસુવ્રત ભગવાન', 
    'Tortoise (Kachhua)', 
    '🐢', 
    'Black', 
    '#2C3E50', 
    '20 Dhanusha', 
    '30,000 Purvas', 
    'Varuna', 
    'Naradatta Devi', 
    'Rajagriha (Rajgir), Bihar', 
    'Sammeta Shikhar (Parasnath)', 
    'Rajgir', 
    'Rajgir', 
    ARRAY[
        'Slow, steady, patient spiritual progress like the tortoise always wins',
        'Consistent daily practice over time achieves what intensity alone cannot',
        'The Muni''s vow (Suvrat) of perfect restraint is the model for all aspirants'
    ], 
    'Munisuvrat Bhagwan, the twentieth Tirthankar, embodies the spiritual wisdom of the tortoise — steady, protected within, and patient. One of the two black-colored Tirthankars.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Rajgir', 'Pawapuri'], 
    '{"garbha": "Rajgir", "janma": "Rajgir", "diksha": "Rajgir", "kevalgyan": "Rajgir", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    21, 
    'Naminath Bhagwan', 
    'નમિનાથ ભગવાન', 
    'Blue Lotus (Utpala)', 
    '💐', 
    'Golden Yellow', 
    '#C8960C', 
    '15 Dhanusha', 
    '10,000 Purvas', 
    'Bhrikuti', 
    'Gandhari Devi', 
    'Mithila, Bihar', 
    'Sammeta Shikhar (Parasnath)', 
    'Mithila', 
    'Mithila', 
    ARRAY[
        'Humility and surrender to the truth of dharma (Nami = to bow)',
        'Bowing to the dharma of all living beings is the highest wisdom',
        'The ego is the last and greatest obstacle on the path to liberation'
    ], 
    'Naminath Bhagwan, the twenty-first Tirthankar, teaches profound humility. The word ''Nami'' means to bow — his entire teaching is an invitation to surrender to the truth in all living beings.', 
    ARRAY['Sammeta Shikhar (Parasnath)', 'Mithila Tirth'], 
    '{"garbha": "Mithila", "janma": "Mithila", "diksha": "Mithila", "kevalgyan": "Mithila", "nirvana": "Sammeta Shikhar"}'::jsonb
),
(
    22, 
    'Neminath Bhagwan', 
    'નેમિનાથ ભગવાન', 
    'Conch Shell (Shankha)', 
    '🐚', 
    'Black', 
    '#2C3E50', 
    '10 Dhanusha', 
    '1000 Purvas', 
    'Gomedha', 
    'Ambika Devi', 
    'Shauripur (Mathura area), Uttar Pradesh', 
    'Girnar, Gujarat', 
    'Dwarika / Sauripur', 
    'Girnar, Gujarat', 
    ARRAY[
        'Deep compassion for all living beings — even animals facing slaughter',
        'Neminath''s renunciation at his own wedding inspired by animals'' fear is the supreme act of ahimsa',
        'Cousin of Lord Krishna — a bridge between Jain and Vaishnava traditions'
    ], 
    'Neminath Bhagwan, the twenty-second Tirthankar, is one of the most beloved. The story of his renunciation at his wedding — moved by the cries of animals being slaughtered for the feast — is one of the most celebrated ahimsa narratives in all of Jain literature.', 
    ARRAY['Girnar (Junagarh, Gujarat)', 'Shatrunjaya (Palitana)', 'Dwarika', 'Shauripur'], 
    '{"garbha": "Shauripur", "janma": "Shauripur", "diksha": "Dwarika / Sauripur", "kevalgyan": "Girnar, Gujarat", "nirvana": "Girnar, Gujarat"}'::jsonb
),
(
    23, 
    'Parshvanath Bhagwan', 
    'પાર્શ્વનાથ ભગવાન', 
    'Snake (Serpent Hood)', 
    '🐍', 
    'Green / Blue', 
    '#16A085', 
    '9 Dhanusha', 
    '100 Years', 
    'Dharanendra', 
    'Padmavati Devi', 
    'Varanasi (Kashi), Uttar Pradesh', 
    'Sammeta Shikhar (Parasnath Hill, Jharkhand)', 
    'Varanasi', 
    'Varanasi', 
    ARRAY[
        'Fourfold Dharma: Ahimsa, Satya, Asteya, Aparigraha',
        'Most widely worshipped Tirthankar — protector of all devotees',
        'The serpent hood (Dharanendra) represents divine protection of the devoted soul'
    ], 
    'Parshvanath Bhagwan, the twenty-third Tirthankar, is the most widely worshipped of all Tirthankars in the living tradition. His fourfold dharma preceded Mahavir''s fivefold and forms the backbone of Jain ethics. Padmavati Devi, his Yakshini, is invoked by millions daily.', 
    ARRAY['Sammeta Shikhar (Parasnath, Jharkhand)', 'Antriksha Parshwanath (Shivpuri, MP)', 'Stambhantirth (Khambhat, Gujarat)', 'Kunthugi', 'Varanasi'], 
    '{"garbha": "Varanasi", "janma": "Varanasi", "diksha": "Varanasi", "kevalgyan": "Varanasi", "nirvana": "Sammeta Shikhar (Parasnath)"}'::jsonb
),
(
    24, 
    'Mahavir Swami', 
    'મહાવીર સ્વામી', 
    'Lion (Simha)', 
    '🦁', 
    'Golden Yellow', 
    '#C8960C', 
    '7 Dhanusha', 
    '72 Years', 
    'Matanga / Siddhaika', 
    'Siddhayika Devi', 
    'Vaishali (Kundagram), Bihar', 
    'Pawapuri, Bihar', 
    'Vaishali / Kundagram', 
    'Jrimbhikagrama (near Vaishali)', 
    ARRAY[
        'Five Great Vows (Panch Mahavrat): Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha',
        'Re-established the complete fourfold Jain Sangh (monks, nuns, laymen, laywomen)',
        'Anekantavada — many-sidedness of truth; no single perspective contains the whole truth',
        'Syadvada — conditional truth; all statements are conditional on perspective'
    ], 
    'Mahavir Swami — Vardhamana — is the last and twenty-fourth Tirthankar of this cosmic cycle. He is the great reformer who re-established the complete Jain Sangh after a period of decline. His nirvana at Pawapuri on Kartik Amavasya is now celebrated as Diwali by Jains worldwide.', 
    ARRAY['Pawapuri (Bihar)', 'Vaishali', 'Rajgir', 'Champapuri', 'Shatrunjaya (Palitana)'], 
    '{"garbha": "Vaishali / Kundagram", "janma": "Vaishali / Kundagram", "diksha": "Vaishali / Kundagram", "kevalgyan": "Jrimbhikagrama (near Vaishali)", "nirvana": "Pawapuri, Bihar"}'::jsonb
);


-- -------------------------------------------------------------
-- 4. Seed Tirths Data
-- -------------------------------------------------------------
TRUNCATE public.tirths CASCADE;

INSERT INTO public.tirths (
    id, name, tirthankar_id, location, nearest_city, state, history, mahima, how_to_reach, best_time_to_visit, has_vr_darshan, vr_darshan_url, gallery
) VALUES
(
    'shatrunjaya_palitana',
    'Shatrunjaya (Palitana)',
    1,
    'Palitana Hills',
    'Bhavnagar',
    'Gujarat',
    'One of the holiest Jain pilgrimage sites with hundreds of temples atop Shatrunjaya hill.',
    'Associated with Aadinath Bhagwan and countless saints who attained spiritual progress here.',
    '{"road": "Regular buses/taxis from Bhavnagar and Ahmadabad.", "rail": "Nearest station: Palitana / Bhavnagar.", "air": "Nearest airport: Bhavnagar."}'::jsonb,
    'October to March',
    true,
    'https://example.com/vr/shatrunjaya',
    ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd']
),
(
    'girnar_junagadh',
    'Girnar',
    22,
    'Girnar Hills',
    'Junagadh',
    'Gujarat',
    'Ancient mountain pilgrimage famous for thousands of steps and sacred Jain temples.',
    'Neminath Bhagwan attained Moksha here. One of the greatest Jain siddha kshetras.',
    '{"road": "Good road connectivity from Rajkot and Ahmadabad.", "rail": "Nearest station: Junagadh Junction.", "air": "Nearest airport: Rajkot / Keshod."}'::jsonb,
    'November to February',
    true,
    'https://example.com/vr/girnar',
    ARRAY['https://images.unsplash.com/photo-1593693397690-362cb9666fc2', 'https://images.unsplash.com/photo-1564507592333-c60657eea523']
),
(
    'pawapuri_bihar',
    'Pawapuri',
    24,
    'Nalanda District',
    'Bihar Sharif',
    'Bihar',
    'Sacred Jal Mandir built where Mahavir Swami attained Nirvana.',
    'One of the most revered Jain pilgrimage places connected with Mahavir Swami.',
    '{"road": "Accessible from Patna, Rajgir, Nalanda by road.", "rail": "Nearest station: Bihar Sharif / Playagir.", "air": "Nearest airport: Patna."}'::jsonb,
    'October to March',
    false,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1605649487212-47bdab064df7', 'https://images.unsplash.com/photo-1548013146-72479768bada']
),
(
    'sammed_shikhar',
    'Sammeta Shikhar (Parasnath)',
    23,
    'Parasnath Hills',
    'Giridih',
    'Jharkhand',
    'Most sacred Jain siddha kshetra where 20 Tirthankars attained Moksha.',
    'Pilgrimage of immense spiritual merit. Parshvanath Bhagwan especially associated here.',
    '{"road": "Taxis/buses from Giridih and Madhuban.", "rail": "Nearest station: Parasnath Railway Station.", "air": "Nearest airport: Ranchi."}'::jsonb,
    'October to February',
    true,
    'https://example.com/vr/sammed',
    ARRAY['https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 'https://images.unsplash.com/photo-1585136917235-bc9b59d1d7f3']
),
(
    'vaishali_bihar',
    'Vaishali',
    24,
    'Vaishali District',
    'Hajipur',
    'Bihar',
    'Birthplace region of Mahavir Swami, historically rich spiritual land.',
    'Highly revered for Mahavir Janma Kalyanak remembrance.',
    '{"road": "Connected from Patna and Hajipur.", "rail": "Nearest station: Hajipur.", "air": "Nearest airport: Patna."}'::jsonb,
    'November to February',
    false,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1561361058-c24cec5cae4f', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073']
),
(
    'champapuri_bihar',
    'Champapuri',
    12,
    'Bhagalpur Region',
    'Bhagalpur',
    'Bihar',
    'Birthplace and Nirvana land of Vasupujya Bhagwan.',
    'Rare tirth where multiple Kalyanaks are associated with one Tirthankar.',
    '{"road": "Connected via Bhagalpur city roads.", "rail": "Nearest station: Bhagalpur.", "air": "Nearest airport: Patna / Deoghar."}'::jsonb,
    'October to March',
    false,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1599661046827-dacde6976548', 'https://images.unsplash.com/photo-1548013146-72479768bada']
),
(
    'hastinapur_up',
    'Hastinapur',
    16,
    'Meerut District',
    'Meerut',
    'Uttar Pradesh',
    'Ancient Jain center linked with Shantinath, Kunthunath, and Arnath Bhagwan.',
    'Major pilgrimage site with temples, digambar complexes, and historical heritage.',
    '{"road": "Easy access from Delhi and Meerut.", "rail": "Nearest station: Meerut.", "air": "Nearest airport: Delhi."}'::jsonb,
    'October to March',
    true,
    'https://example.com/vr/hastinapur',
    ARRAY['https://images.unsplash.com/photo-1587474260584-136574528ed5', 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658']
),
(
    'kesariyaji_rajasthan',
    'Kesariyaji',
    1,
    'Rishabhdeo',
    'Udaipur',
    'Rajasthan',
    'Very ancient temple dedicated to Aadinath Bhagwan.',
    'Famous among Jains and local devotees alike for miracles and faith.',
    '{"road": "Road route from Udaipur.", "rail": "Nearest station: Udaipur.", "air": "Nearest airport: Udaipur."}'::jsonb,
    'October to February',
    false,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41', 'https://images.unsplash.com/photo-1585136917235-bc9b59d1d7f3']
),
(
    'rajgir_bihar',
    'Rajgir',
    20,
    'Rajgir Hills',
    'Rajgir',
    'Bihar',
    'Historic spiritual city connected to Jainism and many ancient traditions.',
    'Munisuvrat Bhagwan linked here. Important Jain temples and hill shrines.',
    '{"road": "Accessible from Patna and Nalanda.", "rail": "Nearest station: Rajgir.", "air": "Nearest airport: Patna."}'::jsonb,
    'October to March',
    false,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1609947017136-9daf32a5eb16', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2']
),
(
    'ashtapad_himalaya',
    'Ashtapad',
    1,
    'Mythic Himalayan Region',
    'Kailash Region',
    'Himalayan Area',
    'Traditionally believed Nirvana place of Aadinath Bhagwan.',
    'Extremely sacred and mystical site in Jain tradition.',
    '{"road": "No common direct route.", "rail": "Not applicable.", "air": "Nearest access through Himalayan expeditions."}'::jsonb,
    'Seasonal / Restricted',
    true,
    'https://example.com/vr/ashtapad',
    ARRAY['https://images.unsplash.com/photo-1506744038136-46273834b3fb', 'https://images.unsplash.com/photo-1511497584788-876760111969']
);
